
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DeliveryZonesSection: React.FC = () => {
  const zones = [
    {
      name: "Tezo",
      fee: "KES 250",
      icon: "🏘️",
      description: "Standard delivery service"
    },
    {
      name: "Mnarani",
      fee: "KES 150",
      icon: "🏖️",
      description: "Coastal delivery zone"
    },
    {
      name: "Bofa",
      fee: "KES 200",
      icon: "🚴‍♂️",
      description: "Eco-friendly bike delivery",
      special: true
    }
  ];
  return (
    <section className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-charcoal relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
            Delivery Zones
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
          <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto leading-relaxed">
            We deliver across Kilifi County with transparent pricing
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {zones.map((zone, index) => (
            <Card
              key={index}
              className={`${
                zone.special
                  ? 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-barrush-gold/20 border-2 border-barrush-gold'
                  : 'bg-glass-effect border-barrush-steel/30 border'
              } transition-all duration-500 hover:scale-105 hover:border-barrush-copper/50 backdrop-blur-md group overflow-hidden`}
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{zone.icon}</div>
                <h3 className="text-2xl font-bold mb-2 font-serif text-barrush-gold">
                  {zone.name}
                </h3>
                <div className="text-rose-600 text-xl font-semibold mb-4">
                  {zone.fee}
                </div>
                <p className="text-barrush-platinum/80 leading-relaxed mb-2">
                  {zone.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryZonesSection;
