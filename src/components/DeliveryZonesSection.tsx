
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const DeliveryZonesSection: React.FC = () => {
  const zones = [{
    name: "Tezo",
    fee: "KES 250",
    icon: "🏘️",
    description: "Standard delivery service"
  }, {
    name: "Mnarani",
    fee: "KES 150",
    icon: "🏖️",
    description: "Standard delivery service"
  }, {
    name: "Bofa",
    fee: "KES 200",
    icon: "🚴‍♂️",
    description: "Standard delivery service",
    special: true
  }];
  return <section className="py-20 bg-gradient-to-l from-blue-950/60 via-pink-900/30 to-barrush-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6 text-zinc-100 bg-gradient-to-br from-pink-200 via-fuchsia-200 to-blue-300 bg-clip-text text-transparent">
            Delivery Zones
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto text-zinc-100">
            We deliver across Kilifi County with transparent pricing
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {zones.map((zone, index) => <Card key={index} className={`${zone.special ? 'bg-gradient-to-br from-pink-200/10 via-blue-600/10 to-barrush-gold/10 border-barrush-gold border-2' : 'bg-gradient-to-br from-blue-900/10 via-pink-800/5 to-barrush-burgundy/20 border-barrush-burgundy border'} transition-all duration-300 hover:scale-105 shadow-md`}>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{zone.icon}</div>
                <h3 className="text-2xl font-bold text-barrush-gold mb-2 text-zinc-50">
                  {zone.name}
                </h3>
                <div className="text-white text-xl font-semibold mb-4">
                  {zone.fee}
                </div>
                <p className="text-barrush-cream/80 mb-4 text-zinc-100">
                  {zone.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center mt-12">
          
        </div>
      </div>
    </section>;
};
export default DeliveryZonesSection;
