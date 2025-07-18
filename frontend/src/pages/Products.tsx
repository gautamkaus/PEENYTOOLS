import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Filter, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { API_BASE_URL } from '../lib/config';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// Helper for Indian Rupee formatting
const formatINR = (value) => {
  if (isNaN(value)) return value;
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogMessage, setLoginDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setAllProducts(response.data);
        setProducts(response.data);
      } catch (error) {
        toast({
          title: "Error fetching products",
          description: "Could not load products from the server.",
          variant: "destructive",
        });
      }
    };
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    let filtered = allProducts;
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    setProducts(filtered);
  }, [searchTerm, selectedCategory, allProducts]);
  
  // User-specific cart helpers
  const getCartKey = () => {
    const email = localStorage.getItem('userEmail');
    return email ? `cart_${email}` : 'cart_guest';
  };
  const getCart = () => JSON.parse(localStorage.getItem(getCartKey()) || '[]');
  const saveCart = (cart) => localStorage.setItem(getCartKey(), JSON.stringify(cart));

  const addToCart = (product, duration, price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoginDialogMessage("Please login to add items to cart.");
      setLoginDialogOpen(true);
      return;
    }

    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.duration === duration);
    
    if (existingItemIndex > -1) {
        // For simplicity, we just notify user. A real app might increment quantity.
        toast({ title: "Item already in cart", description: "You can change the duration in the cart." });
        return;
    }

    const cartItem = {
      ...product,
      duration: duration,
      totalPrice: price,
      cartId: `${product.id}-${duration}` // Use a different name to avoid clash with product.id
    };
    
    cart.push(cartItem);
    saveCart(cart);
    toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
    });
    // Force header update
    window.dispatchEvent(new Event('storage'));
  };

  const buyNow = (product, duration, price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoginDialogMessage("Please login to purchase products.");
      setLoginDialogOpen(true);
      return;
    }

    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.duration === duration);
    
    if (existingItemIndex === -1) {
        const cartItem = {
          ...product,
          duration: duration,
          totalPrice: price,
          cartId: `${product.id}-${duration}`
        };
        cart.push(cartItem);
        saveCart(cart);
        window.dispatchEvent(new Event('storage'));
    }
    
    navigate('/checkout');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+918975170356?text=Hi,%20I%27m%20interested%20in%20PennyTools%20AI%20products.', '_blank');
  };

  const [cartCount, setCartCount] = useState(getCart().length);
  useEffect(() => {
    const updateCartCount = () => setCartCount(getCart().length);
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info to check admin status
      axios.get(`${API_BASE_URL}/api/me`, {
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
      {/* Login Required Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>{loginDialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setLoginDialogOpen(false); navigate('/login'); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Go to Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">AI Tools Collection</h1>
          <p className="text-xl opacity-90">Professional AI tools with amazing discounts - Limited time offer!</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center max-w-5xl mx-auto flex-wrap">
            <div className="relative w-full md:flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search AI tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border rounded-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500 hidden md:block" />
              <ToggleGroup
                type="single"
                defaultValue="all"
                value={selectedCategory}
                onValueChange={(value) => {
                  if (value) setSelectedCategory(value);
                }}
                className="flex flex-wrap justify-center gap-2"
                aria-label="Product categories"
              >
                <ToggleGroupItem value="all" aria-label="All categories" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">All</ToggleGroupItem>
                <ToggleGroupItem value="content" aria-label="Content AI" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">Content AI</ToggleGroupItem>
                <ToggleGroupItem value="analytics" aria-label="Analytics" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">Analytics</ToggleGroupItem>
                <ToggleGroupItem value="development" aria-label="Development" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">Development</ToggleGroupItem>
                <ToggleGroupItem value="design" aria-label="Design" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">Design</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <div className="break-inside-avoid mb-6" key={product.id}>
                <ProductCard 
                  product={product} 
                  onAddToCart={addToCart}
                  onBuyNow={buyNow}
                />
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              {allProducts.length === 0 && (
                <p className="text-gray-400 mt-2">Products are managed from the admin panel.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const [selectedDuration, setSelectedDuration] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Get available durations from product rates
  const durationsRaw = (product.rates || []).map(rate => Number(rate.duration)).filter(d => typeof d === 'number' && !isNaN(d));
  const availableDurations = Array.from(new Set(durationsRaw)) as number[];
  availableDurations.sort((a, b) => a - b);
  
  // Set default selected duration to first available
  useEffect(() => {
    if (availableDurations.length > 0 && !selectedDuration) {
      setSelectedDuration(availableDurations[0].toString());
    }
  }, [availableDurations, selectedDuration]);

  const getPriceForDuration = (duration) => {
    const rate = product.rates?.find(r => r.duration === duration);
    return rate ? rate.rate : 0;
  };

  const handleAddToCart = () => {
    if (!selectedDuration) return;
    
    const duration = parseInt(selectedDuration);
    const price = getPriceForDuration(duration);
    onAddToCart(product, duration, price);
  };

  const handleBuyNow = () => {
    if (!selectedDuration) return;
    
    const duration = parseInt(selectedDuration);
    const price = getPriceForDuration(duration);
    onBuyNow(product, duration, price);
  };

  const selectedPrice = getPriceForDuration(parseInt(selectedDuration));

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          className="group transition-all duration-300 border border-gray-200 shadow-md cursor-pointer w-[320px] h-[480px] flex flex-col justify-between hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.25)] hover:border-blue-400 p-4"
          onMouseEnter={() => setPopoverOpen(true)}
          onMouseLeave={() => setPopoverOpen(false)}
        >
          <div className="relative overflow-hidden rounded-t-lg h-40 w-full flex-shrink-0">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop&auto=format&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            {availableDurations.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Duration
                  </label>
                  <Select value={selectedDuration} onValueChange={value => setSelectedDuration(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDurations.map(duration => {
                        const price = getPriceForDuration(duration);
                        return (
                          <SelectItem key={`${product.id}-${duration}`} value={duration.toString()}>
                            {duration} {duration === 1 ? 'month' : 'months'} - {formatINR(price)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatINR(selectedPrice)}
                    </span>
                    <span className="block text-sm text-gray-500">
                      for {selectedDuration} {parseInt(selectedDuration) === 1 ? 'month' : 'months'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                    disabled={!selectedDuration}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    onClick={handleBuyNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!selectedDuration}
                  >
                    Buy Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8 flex-1 flex flex-col justify-center">
                No pricing available
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button className="w-full" disabled>
                    Add to Cart
                  </Button>
                  <Button className="w-full" disabled>
                    Buy Now
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="break-words break-all whitespace-pre-line w-80">
        <ul className="text-gray-600 space-y-1 text-sm">
          {product.description.split('\n').map((line, idx) => {
            const isNegative = /\b(no|not|without|none)\b/i.test(line);
            const emoji = isNegative ? '❌' : '✅';
            return (
              <li key={`${product.id}-desc-${idx}`} className="flex items-start gap-2 w-full">
                <span className="text-lg">{emoji}</span>
                <span className="block w-full truncate break-words break-all whitespace-pre-line">{line.trim()}</span>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default Products;
