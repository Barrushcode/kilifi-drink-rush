
import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';

const paymentLogos = [
  {
    name: "Visa",
    svg: (
      <svg width="56" height="36" viewBox="0 0 50 32" fill="none" aria-label="Visa" className="m-1">
        <rect rx="4" width="50" height="32" fill="#183ACB"/>
        <text x="50%" y="58%" textAnchor="middle" fontWeight="bold" fontSize="15" fill="#fff" fontFamily="Arial">VISA</text>
      </svg>
    ),
  },
  {
    name: "Mastercard",
    svg: (
      <svg width="56" height="36" viewBox="0 0 50 32" fill="none" aria-label="Mastercard" className="m-1">
        <rect rx="4" width="50" height="32" fill="#fff"/>
        <circle cx="21" cy="16" r="10" fill="#EB001B"/>
        <circle cx="29" cy="16" r="10" fill="#F79E1B" style={{mixBlendMode:'multiply', opacity:0.85}}/>
      </svg>
    ),
  },
  {
    name: "M-PESA",
    svg: (
      <svg width="56" height="36" viewBox="0 0 50 32" aria-label="M-PESA" className="m-1">
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
      <svg width="56" height="36" viewBox="0 0 50 32" fill="none" aria-label="Apple Pay" className="m-1">
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
    <footer className="bg-barrush-slate border-t-2 border-neon-blue">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-neon-blue mb-4">BARRUSH</h3>
            <p className="text-gray-300/80 mb-4">
              Premium alcohol delivery in Kilifi County. Get your drink rush on!
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mb-3">
              <Instagram className="h-6 w-6 text-neon-blue hover:text-neon-blue/80 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-neon-blue hover:text-neon-blue/80 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-neon-blue hover:text-neon-blue/80 cursor-pointer transition-colors" />
              <Facebook className="h-6 w-6 text-neon-blue hover:text-neon-blue/80 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-neon-blue hover:text-neon-blue/80 cursor-pointer transition-colors" />
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
            <h4 className="text-xl font-bold text-neon-blue mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p><strong>M-PESA Till:</strong> 5950470</p>
              <p><strong>Support:</strong> 0117808024</p>
              <p><strong>Email:</strong> barrushdelivery@gmail.com</p>
            </div>
          </div>
          
          {/* Business Hours & Delivery */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-bold text-neon-blue mb-4">Service Info</h4>
            <div className="space-y-2 text-gray-300">
              <p><strong>Business Hours:</strong> 9 AM - 11 PM</p>
              <p className="bg-inherit"><strong>Delivery Zones:</strong> Tezo, Mnarani, Bofa</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-neon-pink/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              © {currentYear} Barrush. All rights reserved. Drink responsibly. 18+ only.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">Age Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
