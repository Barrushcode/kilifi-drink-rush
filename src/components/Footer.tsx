
import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-barrush-charcoal border-t-2 border-pink-500 w-full">
      <div className="w-full px-0 py-12 bg-slate-950">
        <div className="grid md:grid-cols-3 gap-8 w-full px-4 md:px-10 lg:px-28">
          {/* Brand Section */}
          <div className="text-left md:text-center lg:text-left">
            <h3 className="text-3xl font-bold text-barrush-gold mb-4 text-zinc-50">BARRUSH</h3>
            <p className="text-barrush-cream/80 mb-4 text-zinc-50">
              Premium alcohol delivery in Kilifi County. Get your drink rush on!
            </p>
            <div className="flex justify-start md:justify-center lg:justify-start space-x-4 mb-3">
              <Instagram className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Facebook className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
            </div>
            {/* Removed payment logos here */}
          </div>
          
          {/* Contact Info */}
          <div className="text-left md:text-center lg:text-left">
            <h4 className="text-xl font-bold text-barrush-gold mb-4 text-zinc-50">Contact Info</h4>
            <div className="space-y-2 text-barrush-cream">
              <p className="text-zinc-50"><strong>M-PESA Till:</strong> 5950470</p>
              <p className="text-zinc-50"><strong>Support:</strong> 0117808024</p>
              <p className="text-zinc-50"><strong>Email:</strong> barrushdelivery@gmail.com</p>
            </div>
          </div>
          
          {/* Business Hours & Delivery */}
          <div className="text-left md:text-center lg:text-left">
            <h4 className="text-xl font-bold text-barrush-gold mb-4 text-zinc-50">Service Info</h4>
            <div className="space-y-2 text-barrush-cream">
              <p className="text-zinc-50"><strong>Business Hours:</strong> 9 AM - 11 PM</p>
              <p className="text-white bg-inherit"><strong>Delivery Zones:</strong> Tezo, Mnarani, Bofa</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-pink-500 w-full px-4 md:px-10 lg:px-28">
          <div className="flex flex-col md:flex-row justify-between items-center w-full">
            <p className="text-barrush-cream/60 text-left md:text-center lg:text-left mb-4 md:mb-0 text-zinc-50">
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
