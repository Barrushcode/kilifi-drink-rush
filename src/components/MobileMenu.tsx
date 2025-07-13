
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
    { name: 'Events', path: '/events' },
    { name: 'Cocktail Recipes', path: '/recipes' },
    { name: 'Help', path: '/help' },
    { name: 'Cart', path: '/cart' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Enhanced backdrop with better iOS support */}
      <div 
        className="mobile-menu-overlay"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
      />
      
      {/* Enhanced menu panel with iOS optimizations */}
      <div className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b border-barrush-steel/30">
          <h2 className="text-lg font-iphone font-semibold text-barrush-platinum">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add haptic feedback for iOS
              if ('vibrate' in navigator) {
                navigator.vibrate(10);
              }
              onClose();
            }}
            className="ios-touch-target ios-button-feedback text-barrush-platinum hover:bg-barrush-steel/20"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add haptic feedback for iOS
                    if ('vibrate' in navigator) {
                      navigator.vibrate(5);
                    }
                    // Add small delay for better iOS experience
                    setTimeout(() => {
                      onClose();
                    }, 100);
                  }}
                  className="ios-touch-target ios-button-feedback flex items-center px-4 py-4 text-barrush-platinum font-iphone rounded-lg hover:bg-barrush-steel/20 transition-all duration-200"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {item.name === 'Cart' && <ShoppingCart className="h-4 w-4 mr-3" />}
                  <span className="text-base">{item.name}</span>
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
