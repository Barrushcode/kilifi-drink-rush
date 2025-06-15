
import React from 'react';
import CheckoutSection from '@/components/CheckoutSection';

const Cart = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col flex-1 min-h-screen pt-20">
        <CheckoutSection />
      </div>
    </div>
  );
};

export default Cart;
