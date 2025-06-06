import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
const HowItWorksSection: React.FC = () => {
  const steps = [{
    number: "1️⃣",
    title: "Browse Drinks",
    description: "Explore our extensive collection of premium wines, spirits, beers, and mixers"
  }, {
    number: "2️⃣",
    title: "Add to Cart",
    description: "Select your favorites and add them to your cart with just a click"
  }, {
    number: "3️⃣",
    title: "Checkout & Pay",
    description: "Complete your order and pay securely via M-PESA Till Number 5950470"
  }, {
    number: "4️⃣",
    title: "Fast Delivery",
    description: "Sit back and relax while we deliver your drinks quickly and safely"
  }];
  return <section className="py-20 bg-gradient-to-b from-barrush-charcoal to-barrush-burgundy/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6 text-zinc-50">
            How It Works
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto text-zinc-50">
            Getting your favorite drinks delivered is simple and fast
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => <Card key={index} className="bg-barrush-charcoal/80 border-barrush-gold border hover:border-barrush-gold/80 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-barrush-gold mb-4 text-zinc-50">
                  {step.title}
                </h3>
                <p className="text-barrush-cream/80 text-zinc-50">
                  {step.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-barrush-burgundy/30 border border-barrush-gold rounded-lg p-6 max-w-md mx-auto">
            <h4 className="text-lg font-bold text-barrush-gold mb-2">
              🚴‍♂️ Eco-Friendly Delivery
            </h4>
            <p className="text-barrush-cream text-zinc-50">
              Special bike delivery service available in Bofa area for faster, 
              environmentally conscious delivery
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorksSection;