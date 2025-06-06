import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
const SupportSection: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/254117808024', '_blank');
  };
  return <section className="py-20 bg-barrush-burgundy/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6 text-zinc-50">
            Need Help?
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto text-zinc-50">
            Our support team is here to assist you with any questions
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="bg-barrush-charcoal/80 border-barrush-gold border-2">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">💬</div>
              <h3 className="text-2xl font-bold text-barrush-gold mb-4 text-zinc-50">
                Get Support on WhatsApp
              </h3>
              <p className="text-barrush-cream mb-6 text-zinc-50">
                Need help with your order? Our support team is ready to assist you.
              </p>
              
              <Button onClick={handleWhatsAppClick} size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-lg mb-6">
                📱 Message Us on WhatsApp
              </Button>
              
              <div className="text-barrush-cream/80 space-y-2">
                <p><strong className="text-barrush-gold">Support Number:</strong> 0117808024</p>
                <p className="text-sm">
                  <em>Support only. Please place orders through the website.</em>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="bg-barrush-burgundy/20 border-barrush-burgundy border">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">📧</div>
                <h4 className="text-lg font-bold text-barrush-gold mb-2 text-zinc-50">Email Support</h4>
                <p className="text-barrush-cream text-zinc-50">barrushdelivery@gmail.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-barrush-burgundy/20 border-barrush-burgundy border">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="text-lg font-bold text-barrush-gold mb-2 text-zinc-50">Response Time</h4>
                <p className="text-barrush-cream text-zinc-50">Within 30 minutes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default SupportSection;