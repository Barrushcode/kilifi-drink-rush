import React from 'react';
import CheckoutSection from '@/components/CheckoutSection';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-barrush-midnight">
      <CheckoutSection />
    </div>
  );
};

export default Cart;
