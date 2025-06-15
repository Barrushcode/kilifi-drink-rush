import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';

const paymentLogos = [
  // Mastercard (2 overlapping circles, no text)
  {
    name: "Mastercard",
    svg: (
      <svg
        width="70"
        height="44"
        viewBox="0 0 70 44"
        aria-label="Mastercard"
        className="m-1"
      >
        <rect x="0" y="0" width="70" height="44" rx="10" fill="#F5F5F5" />
        <circle cx="30" cy="22" r="11" fill="#EB001B" />
        <circle cx="40" cy="22" r="11" fill="#F79E1B" fillOpacity="0.9" />
        <circle cx="35" cy="22" r="11" fill="#FF5F00" fillOpacity="0.58" />
        {/* Optional: replace with gradient at intersection if desired */}
      </svg>
    ),
  },
  // Visa (blue slanted V and logotype)
  {
    name: "Visa",
    svg: (
      <svg
        width="70"
        height="44"
        viewBox="0 0 70 44"
        aria-label="Visa"
        className="m-1"
      >
        <rect x="0" y="0" width="70" height="44" rx="10" fill="#F5F5F5" />
        <text
          x="35"
          y="30"
          textAnchor="middle"
          fontWeight="900"
          fontStyle="italic"
          fontSize="22"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fill="#1A1F71"
          letterSpacing="3"
        >
          VISA
        </text>
      </svg>
    ),
  },
  // Apple Pay (Apple logo + Pay)
  {
    name: "Apple Pay",
    svg: (
      <svg
        width="70"
        height="44"
        viewBox="0 0 70 44"
        aria-label="Apple Pay"
        className="m-1"
      >
        <rect x="0" y="0" width="70" height="44" rx="10" fill="#F5F5F5" />
        {/* Apple logo (vector for compatibility) */}
        <g transform="translate(16,14) scale(1.15)">
          <path
            d="M6.8 5.39c-.01-1.11.91-1.64.95-1.66-.52-.75-1.33-.85-1.62-.86-.69-.07-1.34.4-1.7.4-.36 0-.91-.39-1.5-.38-.77.01-1.5.45-1.9 1.15-.81 1.41-.21 3.49.57 4.63.38.55.83 1.16 1.42 1.14.57-.02.79-.37 1.48-.37.69 0 .88.37 1.49.36.62-.01 1-.56 1.37-1.11.43-.62.61-1.21.62-1.24-.01-.01-1.2-.46-1.21-1.81ZM5.24 2.27c.32-.38.54-.92.48-1.46-.47.02-1.04.32-1.38.7-.3.34-.56.88-.46 1.4.49.04 1.01-.25 1.36-.64Z"
            fill="#111"
          />
        </g>
        <text
          x="40"
          y="28"
          fontFamily="Arial,sans-serif"
          fontWeight="bold"
          fontSize="17"
          fill="#111"
        >
          Pay
        </text>
      </svg>
    ),
  },
  // M-PESA (text, but card style)
  {
    name: "M-PESA",
    svg: (
      <svg
        width="70"
        height="44"
        viewBox="0 0 70 44"
        aria-label="M-PESA"
        className="m-1"
      >
        <rect x="0" y="0" width="70" height="44" rx="10" fill="#F5F5F5" />
        <text
          x="35"
          y="28"
          textAnchor="middle"
          fontWeight="bold"
          fontSize="17"
          fontFamily="Arial,sans-serif"
          fill="#009A49"
        >
          M-PESA
        </text>
        {/* optional SIM icon */}
        <rect x="56" y="13" width="7" height="18" rx="2" fill="#FFD600" />
      </svg>
    ),
  },
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
