
import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-barrush-charcoal border-t-2 border-barrush-gold">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-barrush-gold mb-4">BARRUSH</h3>
            <p className="text-barrush-cream/80 mb-4">
              Premium alcohol delivery in Kilifi County. Get your drink rush on!
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Instagram className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Facebook className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-barrush-gold mb-4">Contact Info</h4>
            <div className="space-y-2 text-barrush-cream">
              <p><strong>M-PESA Till:</strong> 5950470</p>
              <p><strong>Support:</strong> 0117808024</p>
              <p><strong>Email:</strong> barrushdelivery@gmail.com</p>
            </div>
          </div>
          
          {/* Business Hours & Delivery */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-bold text-barrush-gold mb-4">Service Info</h4>
            <div className="space-y-2 text-barrush-cream">
              <p><strong>Business Hours:</strong> 9 AM - 11 PM</p>
              <p><strong>Delivery Zones:</strong> Tezo, Mnarani, Bofa</p>
              <p className="text-green-400">🚴‍♂️ Eco-friendly bike delivery in Bofa</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-barrush-burgundy">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-barrush-cream/60 text-center md:text-left mb-4 md:mb-0">
              © {currentYear} Barrush. All rights reserved. Drink responsibly. 18+ only.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-barrush-cream/60 hover:text-barrush-gold transition-colors">Terms</a>
              <a href="#" className="text-barrush-cream/60 hover:text-barrush-gold transition-colors">Privacy</a>
              <a href="#" className="text-barrush-cream/60 hover:text-barrush-gold transition-colors">Age Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
