import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const DeliveryZonesSection: React.FC = () => {
  const zones = [{
    name: "Mnarani",
    fee: "KES 150",
    icon: "🏖️",
    description: "Coastal delivery zone"
  }, {
    name: "Bofa",
    fee: "KES 200",
    icon: "🚴‍♂️",
    description: "Eco-friendly bike delivery",
    special: true
  }, {
    name: "Mtondia",
    fee: "KES 250",
    icon: "🏘️",
    description: "Standard delivery service"
  }, {
    name: "CBD",
    fee: "KES 100",
    icon: "🏢",
    description: "Central business district"
  }, {
    name: "Old Ferry",
    fee: "KES 100",
    icon: "⛴️",
    description: "Ferry terminal area"
  }];
  return <section className="py-20 bg-barrush-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6 text-zinc-100">
            Delivery Zones
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto text-zinc-100">
            We deliver across Kilifi County with transparent pricing
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {zones.map((zone, index) => <Card key={index} className="bg-slate-950">
              <CardContent className="p-8 text-center bg-slate-950">
                <div className="text-5xl mb-4">{zone.icon}</div>
                <h3 className="text-2xl font-bold text-barrush-gold mb-2 text-zinc-50">
                  {zone.name}
                </h3>
                <div className="text-white text-xl font-semibold mb-4">
                  {zone.fee}
                </div>
                
                {zone.special}
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center mt-12">
          
        </div>
      </div>
    </section>;
};
export default DeliveryZonesSection;