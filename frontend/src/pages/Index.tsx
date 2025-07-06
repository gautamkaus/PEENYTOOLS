import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ui/ParticleBackground';
import NeonText from '@/components/ui/NeonText';
import HolographicButton from '@/components/ui/HolographicButton';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// Helper for Indian Rupee formatting
const formatINR = (value) => {
  if (isNaN(value)) return value;
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};

function FeaturedToolCard({ tool }) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  return (
    <motion.div
      key={tool.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            className="group transition-all duration-300 border border-gray-200 shadow-md cursor-pointer w-[320px] h-[320px] flex flex-col justify-between hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.25)] hover:border-blue-400 p-4"
            onMouseEnter={() => setPopoverOpen(true)}
            onMouseLeave={() => setPopoverOpen(false)}
          >
            <div className="relative overflow-hidden rounded-t-lg h-40 w-full flex-shrink-0">
              <img
                src={tool.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop&auto=format&q=80'}
                alt={tool.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-400 animate-pulse">
                -{tool.discount}%
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{tool.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Link to={`/products?tool=${tool.id}`}>
                <HolographicButton className="w-full">
                  Get Started
                </HolographicButton>
              </Link>
            </CardContent>
          </div>
        </PopoverTrigger>
        <PopoverContent side="right" className="break-words break-all whitespace-pre-line w-80">
          <ul className="text-gray-600 space-y-1 text-sm">
            {tool.description.split('\n').map((line, idx) => {
              const isNegative = /\b(no|not|without|none)\b/i.test(line);
              const emoji = isNegative ? '❌' : '✅';
              return (
                <li key={`${tool.id}-desc-${idx}`} className="flex items-start gap-2 w-full">
                  <span className="text-lg">{emoji}</span>
                  <span className="block w-full truncate break-words break-all whitespace-pre-line">{line.trim()}</span>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}

const Index = () => {
  const [featuredTools, setFeaturedTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setFeaturedTools(response.data.filter(p => p.featured));
      } catch (error) {
        setFeaturedTools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+918975170356?text=Hi,%20I%27m%20interested%20in%20PennyTools%20AI%20products.', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white py-32 overflow-hidden">
        <ParticleBackground />
        <div className="relative container mx-auto px-4 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-white"
          >
            AI Tools for the Future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200"
          >
            Supercharge your productivity with premium AI tools at 90% - 60% off. 
            Professional-grade solutions for content creation, analytics, and development.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Link to="/products">
                <Button
                  className="relative w-full bg-white text-blue-700 font-bold text-lg py-6 px-8 rounded-lg"
                >
                  Explore Tools
                </Button>
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Button
                onClick={handleWhatsAppClick}
                className="relative w-full bg-white text-blue-700 font-bold text-lg py-6 px-8 rounded-lg"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured AI Tools</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular AI-powered tools with exclusive discounts
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : featuredTools.length === 0 ? (
            <div className="text-center text-gray-500">No featured products available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {featuredTools.map((tool) => (
                <FeaturedToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/30" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PennyTools?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🚀",
                title: "AI-Powered",
                description: "Advanced AI algorithms for maximum productivity and efficiency",
                bgColor: "bg-blue-100"
              },
              {
                icon: "💰",
                title: "90% - 60% Discount",
                description: "Premium tools at unbeatable prices for limited time",
                bgColor: "bg-yellow-100"
              },
              {
                icon: "⚡",
                title: "Instant Access",
                description: "Get started immediately with easy setup and onboarding",
                bgColor: "bg-green-100"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white pt-12 pb-8 mt-16 overflow-hidden">
        {/* Glowing Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-sm opacity-80" />
        {/* Subtle Particle/Gradient BG (optional, can use ParticleBackground if desired) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <ParticleBackground />
        </div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">PennyTools</span>
              </div>
              <p className="text-blue-100/80">AI-powered tools for the modern professional</p>
              <div className="flex space-x-3 mt-4">
                <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg></a>
                <a href="#" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg></a>
                <a href="#" className="hover:text-blue-400 transition-colors" aria-label="GitHub"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.18 9.18 0 0 1 2.5-.34c.85 0 1.7.11 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg></a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4 text-blue-100">Products</h4>
              <ul className="space-y-2 text-blue-100/80">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/products" className="hover:text-white transition-colors flex items-center gap-2"><span>🛠️</span> All Tools</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/products?category=content" className="hover:text-white transition-colors flex items-center gap-2"><span>✍️</span> Content AI</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/products?category=analytics" className="hover:text-white transition-colors flex items-center gap-2"><span>📊</span> Analytics</Link>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-semibold mb-4 text-blue-100">Support</h4>
              <ul className="space-y-2 text-blue-100/80">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>❓</span> Help Center</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>📞</span> Contact Us</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>📄</span> Documentation</a>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold mb-4 text-blue-100">Connect</h4>
              <HolographicButton
                onClick={handleWhatsAppClick}
                className="w-full text-white bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 shadow-lg hover:from-green-500 hover:to-blue-700 border-0"
              >
                <span className="flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.003 5.45-4.437 9.884-9.88 9.884m8.413-18.297a11.815 11.815 0 0 0-8.413-3.413c-6.479 0-11.755 5.275-11.757 11.752 0 2.071.541 4.085 1.566 5.845l-1.662 6.07a1 1 0 0 0 1.225 1.225l6.063-1.615a11.76 11.76 0 0 0 5.565 1.396h.005c6.478 0 11.753-5.275 11.755-11.752a11.72 11.72 0 0 0-3.413-8.408"/></svg> WhatsApp Support</span>
              </HolographicButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100/70"
          >
            <p>&copy;  2020-2025 PennyTools. All rights reserved. <span className="text-xs align-super">ᵏᵍ</span></p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
