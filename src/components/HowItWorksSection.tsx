
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1️⃣",
      title: "Browse Drinks",
      description: "Explore our extensive collection of premium wines, spirits, beers, and mixers"
    },
    {
      number: "2️⃣",
      title: "Add to Cart",
      description: "Select your favorites and add them to your cart with just a click"
    },
    {
      number: "3️⃣",
      title: "Checkout & Pay",
      description: "Complete your order and pay securely via M-PESA Till Number 5950470"
    },
    {
      number: "4️⃣",
      title: "Fast Delivery",
      description: "Sit back and relax while we deliver your drinks quickly and safely"
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
            How It Works
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
          <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto leading-relaxed">
            Getting your favorite drinks delivered is simple and fast
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4 text-barrush-gold">{step.number}</div>
                <h3 className="text-2xl font-bold mb-4 font-serif text-barrush-gold">
                  {step.title}
                </h3>
                <p className="text-barrush-platinum/80 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
