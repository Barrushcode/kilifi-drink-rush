import React from 'react';
import { Shield, Clock, Star, Users, CheckCircle, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TrustSignalsSection: React.FC = () => {
  const trustSignals = [
    {
      icon: Shield,
      title: "100% Authentic",
      description: "Genuine products from verified suppliers only",
      color: "text-green-400"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Most orders delivered within 30-60 minutes",
      color: "text-blue-400"
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "4.8/5 stars from 500+ satisfied customers",
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: "Trusted by 1000+",
      description: "Happy customers across Kilifi County",
      color: "text-purple-400"
    },
    {
      icon: CheckCircle,
      title: "Quality Guaranteed",
      description: "Full refund if you're not satisfied",
      color: "text-cyan-400"
    },
    {
      icon: Truck,
      title: "Reliable Service",
      description: "Operating 7 days a week, rain or shine",
      color: "text-orange-400"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-barrush-platinum mb-4">
            Why Choose Barrush?
          </h2>
          <p className="text-xl text-barrush-platinum/80 max-w-2xl mx-auto">
            Trusted by thousands across Kilifi County for premium alcohol delivery
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustSignals.map((signal, index) => (
            <Card key={index} className="bg-barrush-slate/20 backdrop-blur-sm border-barrush-platinum/20 p-6 hover:bg-barrush-slate/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className={`${signal.color} bg-barrush-midnight/50 p-3 rounded-lg`}>
                  <signal.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-barrush-platinum mb-2">
                    {signal.title}
                  </h3>
                  <p className="text-barrush-platinum/70 text-sm leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Customer testimonial highlight */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-barrush-slate/20 to-barrush-midnight/30 backdrop-blur-sm border-barrush-platinum/20 p-8 max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={20} />
              ))}
            </div>
            <blockquote className="text-xl text-barrush-platinum/90 mb-4 italic">
              "Barrush saved our beach party! Quick delivery, great prices, and the drinks were perfect. Highly recommended!"
            </blockquote>
            <cite className="text-barrush-platinum/70">- Sarah M., Kilifi Town</cite>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;