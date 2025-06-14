
import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';

const paymentLogos = [
  {
    name: "Visa",
    svg: (
      <svg width="40" height="24" viewBox="0 0 50 32" fill="none" aria-label="Visa" className="m-1">
        <rect rx="4" width="50" height="32" fill="#183ACB"/>
        <text x="50%" y="58%" textAnchor="middle" fontWeight="bold" fontSize="15" fill="#fff" fontFamily="Arial">VISA</text>
      </svg>
    ),
  },
  {
    name: "Mastercard",
    svg: (
      <svg width="40" height="24" viewBox="0 0 50 32" fill="none" aria-label="Mastercard" className="m-1">
        <rect rx="4" width="50" height="32" fill="#fff"/>
        <circle cx="21" cy="16" r="10" fill="#EB001B"/>
        <circle cx="29" cy="16" r="10" fill="#F79E1B" style={{mixBlendMode:'multiply', opacity:0.85}}/>
        <text x="25" y="28" textAnchor="middle" fontSize="9" fill="#222" fontFamily="Arial">Mastercard</text>
      </svg>
    ),
  },
  {
    name: "M-PESA",
    svg: (
      <svg width="40" height="24" viewBox="0 0 50 32" aria-label="M-PESA" className="m-1">
        <rect rx="4" width="50" height="32" fill="#fff"/>
        <text x="50%" y="57%" textAnchor="middle" fontWeight="bold" fontSize="14" fill="#009A49" fontFamily="Arial">&nbsp;M-PESA</text>
        <rect x="14" y="8" width="6" height="16" rx="2" fill="#009A49" />
        <rect x="30" y="8" width="6" height="16" rx="2" fill="#009A49" />
        <circle cx="25" cy="16" r="4" fill="#fd0" stroke="#009A49" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: "Apple Pay",
    svg: (
      <svg width="40" height="24" viewBox="0 0 50 32" fill="none" aria-label="Apple Pay" className="m-1">
        <rect rx="4" width="50" height="32" fill="#111" />
        <text x="17" y="21" fontWeight="bold" fontSize="13" fill="#fff" fontFamily="Arial"></text>
        <text x="32" y="21" fontWeight="bold" fontSize="14" fill="#fff" fontFamily="Arial">Pay</text>
      </svg>
    ),
  }
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-barrush-charcoal border-t-2 border-barrush-gold">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-barrush-gold mb-4 text-zinc-50">BARRUSH</h3>
            <p className="text-barrush-cream/80 mb-4 text-zinc-50">
              Premium alcohol delivery in Kilifi County. Get your drink rush on!
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mb-3">
              <Instagram className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Facebook className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-barrush-gold hover:text-barrush-gold/80 cursor-pointer transition-colors" />
            </div>
            {/* Payment logos */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 mb-3" aria-label="Accepted Payments">
              {paymentLogos.map(({name, svg}) => (
                <span key={name} aria-label={name} title={name}>{svg}</span>
              ))}
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-barrush-gold mb-4 text-zinc-50">Contact Info</h4>
            <div className="space-y-2 text-barrush-cream">
              <p className="text-zinc-50"><strong>M-PESA Till:</strong> 5950470</p>
              <p className="text-zinc-50"><strong>Support:</strong> 0117808024</p>
              <p className="text-zinc-50"><strong>Email:</strong> barrushdelivery@gmail.com</p>
            </div>
          </div>
          
          {/* Business Hours & Delivery */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-bold text-barrush-gold mb-4 text-zinc-50">Service Info</h4>
            <div className="space-y-2 text-barrush-cream">
              <p className="text-zinc-50"><strong>Business Hours:</strong> 9 AM - 11 PM</p>
              <p className="text-white bg-inherit"><strong>Delivery Zones:</strong> Tezo, Mnarani, Bofa</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-barrush-burgundy">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-barrush-cream/60 text-center md:text-left mb-4 md:mb-0 text-zinc-50">
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
