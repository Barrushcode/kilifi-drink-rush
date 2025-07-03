
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Utility for neon border shadows (reduced intensity)
 */
const neonShadow = '0 0 6px 1px #d946efcc, 0 0 12px 2px #6b21a899';
const neonPinkShadow = '0 0 4px 1px #d946efcc, 0 0 8px 1.5px #e879f9cc';
const neonBlueShadow = '0 0 4px 1px #6b21a8cc, 0 0 8px 1.5px #3b0764cc';

const SupportSection: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/254117808024', '_blank');
  };
  return (
    <section className="py-20 bg-slate-950">
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
          {/* Main support WhatsApp card with neon pink/blue border and glow */}
          <Card
            className="bg-barrush-charcoal/80 border-2 p-0"
            style={{
              borderImage: 'linear-gradient(90deg,#d946ef 0%,#6b21a8 100%) 1',
              boxShadow: neonShadow,
            }}
          >
            <CardContent className="p-8 text-center bg-slate-950">
              <div className="text-6xl mb-6">💬</div>
              <h3 className="text-2xl font-bold text-barrush-gold mb-4 text-zinc-50">
                Get Support on WhatsApp
              </h3>
              <p className="text-barrush-cream mb-6 text-zinc-50">
                Need help with your order? Our support team is ready to assist you.
              </p>

              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-lg mb-6 hover:shadow-lg"
                style={{
                  boxShadow: neonPinkShadow,
                }}
              >
                📱 Message Us on WhatsApp
              </Button>

              <div className="text-barrush-cream/80 space-y-2">
                {/* SUPPORT NUMBER with black background and rounded styling */}
                <p className="bg-black rounded-md py-2 px-4 inline-block text-zinc-50">
                  <strong className="text-barrush-gold">Support Number:</strong> 0117808024
                </p>
                <p className="text-sm text-zinc-100">
                  <em>Support only. Please place orders through the website.</em>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Email support card - neon pink border and glow */}
            <Card
              className="bg-barrush-burgundy/20 border border-2 p-0"
              style={{
                borderImage: 'linear-gradient(90deg,#d946ef 0%,#e879f9 100%) 1',
                boxShadow: neonPinkShadow,
              }}
            >
              <CardContent className="p-6 text-center bg-slate-950">
                <div className="text-3xl mb-3">📧</div>
                <h4 className="text-lg font-bold text-barrush-gold mb-2 text-zinc-50">
                  Email Support
                </h4>
                <p className="text-barrush-cream text-zinc-50">barrushdelivery@gmail.com</p>
              </CardContent>
            </Card>

            {/* Response time card - neon blue border and glow */}
            <Card
              className="bg-barrush-burgundy/20 border border-2 p-0"
              style={{
                borderImage: 'linear-gradient(90deg,#6b21a8 0%,#3b0764 100%) 1',
                boxShadow: neonBlueShadow,
              }}
            >
              <CardContent className="p-6 text-center bg-gray-950">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="text-lg font-bold text-barrush-gold mb-2 text-zinc-50">
                  Response Time
                </h4>
                <p className="text-barrush-cream text-zinc-50">Within 2 minutes</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Disclaimer Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card
            className="bg-red-950/30 border-2 p-0"
            style={{
              borderImage: 'linear-gradient(90deg,#dc2626 0%,#b91c1c 100%) 1',
              boxShadow: '0 0 6px 1px #dc2626cc, 0 0 12px 2px #b91c1ccc',
            }}
          >
            <CardContent className="p-8 bg-slate-950">
              <h3 className="text-2xl font-bold text-red-400 mb-6 text-center">
                Important Disclaimer – Product Availability & Refund Policy
              </h3>
              <div className="text-zinc-50 space-y-4 text-sm md:text-base leading-relaxed">
                <p>
                  Some items listed on our site may be temporarily out of stock from our distributors. We strongly recommend using the "Check Availability on WhatsApp" button before making a payment.
                </p>
                <p>
                  Once payment is made, it is non-refundable. However, if a product is unavailable after payment, you may choose a different drink of equal or lesser value as a replacement.
                </p>
                <p>
                  Our team will assist you promptly via WhatsApp to ensure you get a suitable alternative.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default SupportSection;
