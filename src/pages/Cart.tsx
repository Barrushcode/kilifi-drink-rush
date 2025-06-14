
import React from 'react';
import CheckoutSection from '@/components/CheckoutSection';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-barrush-midnight">
      {/* DEMO BUTTON: Jump to complete order page */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => navigate("/order-placed")}
          className="px-7 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-600 text-white text-lg shadow-lg font-bold animate-scale-in hover-scale transition-all duration-200 border-2 border-white hover:border-neon-pink"
          aria-label="View Order Complete Demo"
        >
          🎉 View Order Complete Demo
        </button>
      </div>
      <CheckoutSection />
    </div>
  );
};

export default Cart;
