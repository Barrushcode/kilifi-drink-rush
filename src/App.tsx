import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Recipes from "./pages/Recipes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Help from "./pages/Help";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import OrderPlaced from "./pages/OrderPlaced";
import CartDrawer from "@/components/CartDrawer";
import { MiniCartDrawerProvider, useMiniCartDrawer } from "@/contexts/CartContext";

const MiniCartDrawerWrapper = () => {
  const { open, closeDrawer } = useMiniCartDrawer();
  return <CartDrawer open={open} onClose={closeDrawer} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MiniCartDrawerProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            {/* Flexible content wrapper for desktop */}
            <div className="pt-0 min-h-screen bg-background flex flex-col">
              <MiniCartDrawerWrapper />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/help" element={<Help />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/order-placed" element={<OrderPlaced />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </MiniCartDrawerProvider>
  </QueryClientProvider>
);

export default App;
