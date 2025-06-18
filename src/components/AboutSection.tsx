
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-barrush-slate to-barrush-midnight">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-rose-600">
            About Barrushke Delivery
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="bg-glass-effect border-barrush-steel/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-barrush-platinum font-serif">
                Premium Alcohol Delivery
              </h3>
              <p className="text-barrush-platinum/80 mb-4 font-iphone">
                We bring you the finest selection of wines, spirits, and beers directly to your doorstep. 
                Our curated collection features premium brands and exceptional quality at competitive prices.
              </p>
              <p className="text-barrush-platinum/80 font-iphone">
                Experience convenient, reliable delivery service with our commitment to excellence 
                and customer satisfaction.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-glass-effect border-barrush-steel/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-barrush-platinum font-serif">
                Why Choose Us?
              </h3>
              <ul className="space-y-3 text-barrush-platinum/80 font-iphone">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-rose-600 rounded-full mr-3"></span>
                  Fast and reliable delivery
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-rose-600 rounded-full mr-3"></span>
                  Premium quality products
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-rose-600 rounded-full mr-3"></span>
                  Competitive pricing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-rose-600 rounded-full mr-3"></span>
                  Excellent customer service
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
