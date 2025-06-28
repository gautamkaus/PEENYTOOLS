import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

// Helper for Indian Rupee formatting
const formatINR = (value) => {
  if (value == null || isNaN(value)) return '₹0.00';
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};

// Helper to get the price for a given duration from the item's rates array
const getPriceForDuration = (item, duration) => {
  if (!item.rates) return 0;
  const found = item.rates.find(r => r.duration === duration);
  return found ? found.rate : 0;
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const getCartKey = () => {
    const email = localStorage.getItem('userEmail');
    return email ? `cart_${email}` : 'cart_guest';
  };
  const getCart = () => JSON.parse(localStorage.getItem(getCartKey()) || '[]');
  const saveCart = (cart) => localStorage.setItem(getCartKey(), JSON.stringify(cart));

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    const loadCart = () => {
      setCartItems(getCart());
    };
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, [navigate]);

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info to check admin status
      axios.get('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setIsAdmin(!!res.data.is_admin);
          localStorage.setItem('isAdmin', res.data.is_admin ? 'true' : 'false');
        })
        .catch(() => {
          setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');
        });
    } else {
      setIsAdmin(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  const durations = [1, 2, 3, 4, 6, 12];

  const updateDuration = (cartId, newDuration) => {
    const updatedCart = cartItems.map(item => {
      if (item.cartId === cartId) {
        return {
          ...item,
          duration: newDuration,
          totalPrice: getPriceForDuration(item, newDuration),
          cartId: `${item.id}-${newDuration}` // Re-generate cartId
        };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const removeItem = (cartId) => {
    const updatedCart = cartItems.filter(item => item.cartId !== cartId);
    saveCart(updatedCart);
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getPriceForDuration(item, item.duration), 0);
  const finalTotal = subtotal;

  const handleWhatsAppClick = () => {
    const orderDetails = cartItems.map(item => 
      `${item.name} (${item.duration} months) - ${formatINR(getPriceForDuration(item, item.duration))}`
    ).join('\n');
    
    const message = `Hi, I want to place an order:\n\n${orderDetails}\n\nTotal: ${formatINR(finalTotal)}`;
    window.open(`https://wa.me/+918626027614?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some AI tools to get started</p>
              <Link to="/products">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.cartId} className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Duration:</label>
                          <Select 
                            value={item.duration.toString()} 
                            onValueChange={(value) => updateDuration(item.cartId, parseInt(value))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.rates?.sort((a,b) => a.duration - b.duration).map(rate => (
                                <SelectItem key={rate.duration} value={rate.duration.toString()}>
                                  {rate.duration} {rate.duration === 1 ? 'month' : 'months'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold">{formatINR(getPriceForDuration(item, item.duration))}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.cartId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-100 sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Discount Applied</span>
                      <span className="text-green-600">Up to 90% - 60% OFF</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{formatINR(finalTotal)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Link to="/checkout" className="block">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      
                      <Button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-lg py-3"
                      >
                        Order on WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
