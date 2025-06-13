
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Help', path: '/help' },
    { name: 'Cart', path: '/cart' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-barrush-midnight border-l border-barrush-steel/30 animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-barrush-steel/30">
          <h2 className="text-lg font-iphone font-semibold text-barrush-platinum">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-barrush-platinum hover:bg-barrush-steel/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center h-touch px-4 py-3 text-barrush-platinum font-iphone rounded-lg hover:bg-barrush-steel/20 transition-colors"
                >
                  {item.name === 'Cart' && <ShoppingCart className="h-4 w-4 mr-3" />}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
