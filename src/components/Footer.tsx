import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';
const paymentLogos = [
// Mastercard
{
  name: "Mastercard",
  svg: <svg width="64" height="40" viewBox="0 0 64 40" aria-label="Mastercard" className="m-1 drop-shadow-card" style={{
    borderRadius: 12,
    background: "#fff"
  }}>
        <rect x="0" y="0" width="64" height="40" rx="12" fill="#fff" filter="url(#shadow1)" />
        <defs>
          <filter id="shadow1" x="-8" y="-8" width="80" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        <circle cx="27" cy="20" r="10" fill="#EA001B" />
        <circle cx="37" cy="20" r="10" fill="#FF5F00" />
        <circle cx="32" cy="20" r="10" fill="#F79E1B" fillOpacity="0.7" />
      </svg>
},
// Visa
{
  name: "Visa",
  svg: <svg width="64" height="40" viewBox="0 0 64 40" aria-label="Visa" className="m-1 drop-shadow-card" style={{
    borderRadius: 12,
    background: "#fff"
  }}>
        <rect x="0" y="0" width="64" height="40" rx="12" fill="#fff" filter="url(#shadow2)" />
        <defs>
          <filter id="shadow2" x="-8" y="-8" width="80" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        <text x="32" y="26" fontWeight="bold" fontFamily="'Arial Black', Arial, sans-serif" fontSize="21" fill="#1A1F71" letterSpacing="5" textAnchor="middle">
          VISA
        </text>
      </svg>
},
// Apple Pay
{
  name: "Apple Pay",
  svg: <svg width="64" height="40" viewBox="0 0 64 40" aria-label="Apple Pay" className="m-1 drop-shadow-card" style={{
    borderRadius: 12,
    background: "#fff"
  }}>
        <rect x="0" y="0" width="64" height="40" rx="12" fill="#fff" filter="url(#shadow3)" />
        <defs>
          <filter id="shadow3" x="-8" y="-8" width="80" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        {/* Apple logo */}
        <g transform="translate(15,11) scale(0.85)">
          <path d="M12.32 6.79c-0.041-2.115 1.736-3.131 1.817-3.174-1-1.458-2.558-1.663-3.112-1.684-1.33-0.141-2.586 0.775-3.274 0.764-0.693-0.013-1.767-0.742-2.911-0.723-1.488 0.02-2.872 0.871-3.649 2.173-1.548 2.688-0.403 6.627 1.17 8.78 0.772 1.092 1.666 2.322 2.852 2.282 1.147-0.036 1.598-0.738 2.989-0.747 1.388-0.009 1.779 0.75 3.001 0.735 1.243-0.015 2.026-1.108 2.789-2.204 0.868-1.257 1.232-2.453 1.241-2.516-0.028-0.012-2.363-0.905-2.386-3.479zM9.5 2.31c0.616-0.747 1.039-1.792 0.922-2.832-0.921 0.034-2.048 0.627-2.712 1.367-0.59 0.668-1.124 1.742-0.926 2.776 0.983 0.078 2.001-0.503 2.716-1.311z" fill="#111" />
        </g>
        {/* "Pay" text */}
        <text x="38" y="27" fontFamily="'SF Pro Text', 'Arial', sans-serif" fontWeight="700" fontSize="17" fill="#111">
          Pay
        </text>
      </svg>
},
// M-PESA
{
  name: "M-PESA",
  svg: <svg width="64" height="40" viewBox="0 0 64 40" aria-label="M-PESA" className="m-1 drop-shadow-card" style={{
    borderRadius: 12,
    background: "#fff"
  }}>
        <rect x="0" y="0" width="64" height="40" rx="12" fill="#fff" filter="url(#shadow4)" />
        <defs>
          <filter id="shadow4" x="-8" y="-8" width="80" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.09" />
          </filter>
        </defs>
        {/* M-PESA text */}
        <text x="28" y="25" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="bold" fontSize="18" fill="#009A49" textAnchor="end">
          M-PESA
        </text>
        {/* SIM card icon */}
        <rect x="34" y="15" width="10" height="14" rx="2" fill="#FFD600" stroke="#bbb" strokeWidth="0.8" />
        <rect x="38.5" y="19" width="1" height="3.5" rx="0.5" fill="#94ca4b" />
        <rect x="41" y="19" width="1" height="3.5" rx="0.5" fill="#94ca4b" />
        <rect x="43.5" y="19" width="1" height="3.5" rx="0.5" fill="#94ca4b" />
      </svg>
}];
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-barrush-charcoal border-t-2 border-barrush-gold">
      <div className="container mx-auto px-6 py-12 bg-slate-950">
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
              {paymentLogos.map(({
              name,
              svg
            }) => <span key={name} aria-label={name} title={name}>{svg}</span>)}
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
    </footer>;
};
export default Footer;