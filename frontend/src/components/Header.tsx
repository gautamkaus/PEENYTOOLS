import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

const NavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick?: () => void }) => (
  <Link to={to} className="block sm:inline-block text-foreground hover:text-blue-600 transition-colors py-2 sm:py-0" onClick={onClick}>
    {children}
  </Link>
);

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getCartKey = () => {
    const email = localStorage.getItem('userEmail');
    return email ? `cart_${email}` : 'cart_guest';
  };
  const getCart = () => JSON.parse(localStorage.getItem(getCartKey()) || '[]');

  useEffect(() => {
    const updateLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      if (token) {
        axios.get(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => setIsAdmin(!!res.data.is_admin))
          .catch(() => setIsAdmin(false));
      } else {
        setIsAdmin(false);
      }
    };

    const updateCartCount = () => {
      const storedCart = getCart();
      setCartCount(storedCart.length);
    };

    updateLoginStatus();
    updateCartCount();

    window.addEventListener('storage', () => {
      updateLoginStatus();
      updateCartCount();
    });

    return () => {
      window.removeEventListener('storage', () => {
        updateLoginStatus();
        updateCartCount();
      });
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/login';
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/icon.png" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              PennyTools
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            {isLoggedIn && (
              <NavLink to="/cart">
                <span className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-1" />
                  Cart ({cartCount})
                </span>
              </NavLink>
            )}
            {isLoggedIn && <NavLink to="/order-history">Order History</NavLink>}
            {isLoggedIn && isAdmin && <NavLink to="/admin">Admin</NavLink>}
            {isLoggedIn ? (
              <Button onClick={handleLogout} size="sm">Logout</Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLink to="/" onClick={closeMenu}>Home</NavLink>
                  <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
                  {isLoggedIn && (
                    <NavLink to="/cart" onClick={closeMenu}>
                      <span className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-1" />
                        Cart ({cartCount})
                      </span>
                    </NavLink>
                  )}
                  {isLoggedIn && <NavLink to="/order-history" onClick={closeMenu}>Order History</NavLink>}
                  {isLoggedIn && isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
                  <div className="border-t pt-4">
                    {isLoggedIn ? (
                      <Button onClick={() => { handleLogout(); closeMenu(); }} className="w-full">Logout</Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Running Sale Text Strip */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap py-2">
          <div className="flex items-center justify-center space-x-8 text-white font-semibold text-sm md:text-base">
            <Sparkles className="w-4 h-4 animate-pulse text-yellow-400" />
            <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              FLASH SALE
            </span>
            <span>
              🎉 MEGA SALE ALERT! 90% OFF on Premium Tools & Software 🎉
            </span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
              LIMITED TIME
            </span>
            <span>
              🚀 Upgrade Your Workflow with Professional Tools at Unbeatable Prices! 🚀
            </span>
            <Sparkles className="w-4 h-4 animate-pulse text-yellow-400" />
            <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              FLASH SALE
            </span>
            <span>
              🎉 MEGA SALE ALERT! 90% OFF on Premium Tools & Software 🎉
            </span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
              LIMITED TIME
            </span>
            <span>
              🚀 Upgrade Your Workflow with Professional Tools at Unbeatable Prices! 🚀
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 