import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import OrderHistory from "./pages/OrderHistory";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import LoginForm from './pages/LoginForm';
import Register from './pages/Register';
import Header from './components/Header';

const queryClient = new QueryClient();

const WhatsAppPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem('whatsappPopoverShown');
    if (!hasBeenShown) {
      setIsOpen(true);
      sessionStorage.setItem('whatsappPopoverShown', 'true');
    }
  }, []);

  const handleWhatsAppClick = () => {
    const message = "Hi, I'm interested in purchasing an AI tool from PennyTools. Could you please assist me with the available options, pricing, and the buying process? Thank you!";
    window.open(`https://wa.me/+918975170356?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-background border-2 border-blue-500 text-blue-500 shadow-lg flex items-center justify-center"
        >
          <Phone className="w-8 h-8" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-80 mr-2 mb-2"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="relative p-4 bg-background border rounded-lg shadow-xl">
           <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <p className="font-bold text-lg mb-2">Assistance</p>
          <p className="text-sm mb-2">
            Connect with us on WhatsApp for personal help. We're here to help you choose the right tools and answer all your questions.
          </p>
          <p className="text-sm mb-4">
            You can also get your tools delivered directly through WhatsApp. Just let our team know what you'd like to order!
          </p>
          <Button onClick={handleWhatsAppClick} className="w-full bg-green-500 hover:bg-green-600">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat on WhatsApp
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/order-history" element={<OrderHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppPopover />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
