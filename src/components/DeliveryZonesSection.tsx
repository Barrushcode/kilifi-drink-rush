
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
  return <section className="py-20 bg-barrush-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6">
            Delivery Zones
          </h2>
          <p className="text-xl text-barrush-platinum max-w-2xl mx-auto">
            We deliver across Kilifi County with transparent pricing
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {zones.map((zone, index) => <Card key={index} className={`${zone.special ? 'bg-barrush-gold/10 border-barrush-gold border-2' : 'bg-barrush-burgundy/20 border-barrush-burgundy border'} transition-all duration-300 hover:scale-105`}>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{zone.icon}</div>
                <h3 className="text-2xl font-bold text-barrush-gold mb-2">
                  {zone.name}
                </h3>
                <div className="text-barrush-platinum text-xl font-semibold mb-4">
                  {zone.fee}
                </div>
                <p className="text-barrush-platinum/80 mb-4">
                  {zone.description}
                </p>
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
