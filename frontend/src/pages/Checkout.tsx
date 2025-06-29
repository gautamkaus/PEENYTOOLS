import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

// Helper for Indian Rupee formatting
const formatINR = (value) => {
  if (isNaN(value)) return value;
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};

// Helper to get the price for a given duration from the item's rates array
const getPriceForDuration = (item, duration) => {
  if (!item.rates) return 0;
  const found = item.rates.find(r => r.duration === duration);
  return found ? found.rate : 0;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    upiId: '',
    transactionId: ''
  });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to access checkout.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
  }, [navigate, toast]);

  const getCartKey = () => {
    const email = localStorage.getItem('userEmail');
    return email ? `cart_${email}` : 'cart_guest';
  };
  const getCart = () => JSON.parse(localStorage.getItem(getCartKey()) || '[]');

  useEffect(() => {
    const storedCart = getCart();
    setCartItems(storedCart);
    
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    if (userName) setFormData(prev => ({ ...prev, name: userName }));
    if (userEmail) setFormData(prev => ({ ...prev, email: userEmail }));
  }, []);

  // Use getPriceForDuration for all calculations
  const subtotal = cartItems.reduce((sum, item) => sum + getPriceForDuration(item, item.duration), 0);
  const finalTotal = subtotal;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        toast({ title: "Your cart is empty", variant: "destructive" });
        return;
    }
    setIsProcessing(true);

    if (!formData.name || !formData.email || !formData.phone || !formData.upiId || !formData.transactionId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        upi_id: formData.upiId,
        transaction_id: formData.transactionId,
        items: cartItems.map(item => ({
            product_id: item.id,
            duration: item.duration,
            price_per_month: getPriceForDuration(item, item.duration),
            total_price: getPriceForDuration(item, item.duration)
        })),
        total: finalTotal
    };

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast({
        title: "Order Placed Successfully!",
        description: "You will receive access details via email shortly.",
      });
      
      localStorage.removeItem(getCartKey());
      window.dispatchEvent(new Event('storage'));

      const orderDetails = cartItems.map(item => 
        `${item.name} (${item.duration} months) - ${formatINR(getPriceForDuration(item, item.duration))}`
      ).join('\n');
      
      const message = `Order Confirmation:\n\nCustomer: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nUPI ID: ${formData.upiId}\nTransaction ID: ${formData.transactionId}\n\nItems:\n${orderDetails}\n\nTotal: ${formatINR(finalTotal)}\nPaid Amount: ${formatINR(finalTotal)}\n\nPlease confirm and provide access.`;
      
      window.open(`https://wa.me/+918626027614?text=${encodeURIComponent(message)}`, '_blank');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      toast({
        title: "Order Failed",
        description: error.response?.data?.error || "There was an error placing your order.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppClick = () => {
    const orderDetails = cartItems.map(item => 
      `${item.name} (${item.duration} months) - ${formatINR(getPriceForDuration(item, item.duration))}`
    ).join('\n');
    
    const message = `Hi, I want to complete my checkout:\n\n${orderDetails}\n\nTotal: ${formatINR(finalTotal)}\n\nPlease assist me with the payment process.`;
    window.open(`https://wa.me/+918626027614?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">UPI Payment</h3>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="font-semibold text-blue-800">Scan and Pay using any UPI app</p>
                        <div className="flex justify-center my-4">
                          {/* Placeholder for QR Code */}
                          <div className="w-40 h-40 bg-gray-300 flex items-center justify-center">
                            <p>QR Code</p>
                          </div>
                        </div>
                        <p className="text-center font-mono text-blue-700">pennytools@upi</p>
                      </div>

                      <p className="mb-4 text-center text-sm font-bold text-red-600">
                        Make the payment and add the below details, then click on the button below to get your credentials on WhatsApp.<br/>
                        <span className="block mt-2">Please also send a screenshot of your payment on WhatsApp to help us verify your transaction quickly.</span>
                      </p>

                      <div>
                        <Label htmlFor="upiId">Your UPI ID *</Label>
                        <Input
                          id="upiId"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="your-name@upi"
                          required
                        />
                      </div>

                       <div>
                        <Label htmlFor="transactionId">Transaction ID *</Label>
                        <Input
                          id="transactionId"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          placeholder="Enter payment transaction ID"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                        disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Get Your Login Info'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    {cartItems.length > 0 ? (
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.cartId} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.duration} month(s)</p>
                                    </div>
                                    <p>{formatINR(getPriceForDuration(item, item.duration))}</p>
                                </div>
                            ))}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>{formatINR(finalTotal)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Our Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4 text-sm text-gray-700">
                    <li className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      <span>100% Secure Payment Gateway</span>
                    </li>
                    <li className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      <span>Instant Access Post-Payment</span>
                    </li>
                    <li className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      <span>24/7 Customer Support</span>
                    </li>
                  </ul>
                  <p className="mb-4 text-sm">Have questions or need assistance? Chat with us directly on WhatsApp.</p>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Contact Support on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
