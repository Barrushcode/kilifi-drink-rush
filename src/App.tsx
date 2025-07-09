
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Recipes from "./pages/Recipes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Help from "./pages/Help";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import OrderPlaced from "./pages/OrderPlaced";
import CartDrawer from "@/components/CartDrawer";
import AgeVerification from "@/components/AgeVerification";
import { MiniCartDrawerProvider, useMiniCartDrawer } from "@/contexts/CartContext";

const MiniCartDrawerWrapper = () => {
  const { open, closeDrawer } = useMiniCartDrawer();
  return <CartDrawer open={open} onClose={closeDrawer} />;
};

const queryClient = new QueryClient();

const App = () => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const handleAgeVerified = () => {
    setIsAgeVerified(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MiniCartDrawerProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {!isAgeVerified ? (
              <AgeVerification onVerified={handleAgeVerified} />
            ) : (
              <BrowserRouter>
                <Navigation />
                <div className="pt-16 lg:pt-20 min-h-screen bg-background flex flex-col">
                  <MiniCartDrawerWrapper />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/order-placed" element={<OrderPlaced />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            )}
          </TooltipProvider>
        </CartProvider>
      </MiniCartDrawerProvider>
    </QueryClientProvider>
  );
};

export default App;
