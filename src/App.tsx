
import React, { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Navigation from "./components/Navigation";
import CartDrawer from "@/components/CartDrawer";
import AgeVerification from "@/components/AgeVerification";
import DeliveryNotice from "@/components/DeliveryNotice";
import { MiniCartDrawerProvider, useMiniCartDrawer } from "@/contexts/CartContext";

// Lazy load all pages for optimal performance
const Index = lazy(() => import("./pages/Index"));
const Events = lazy(() => import("./pages/Events"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Help = lazy(() => import("./pages/Help"));
const Cart = lazy(() => import("./pages/Cart"));
const OrderPlaced = lazy(() => import("./pages/OrderPlaced"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
                <DeliveryNotice />
                <div className="pt-16 lg:pt-20 min-h-screen bg-background flex flex-col safe-top safe-bottom">
                  <MiniCartDrawerWrapper />
                  <Suspense fallback={
                    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barrush-pink"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/recipes" element={<Recipes />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/order-placed" element={<OrderPlaced />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
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
