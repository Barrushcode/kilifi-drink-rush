
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import MobileMenu from './MobileMenu';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      {/* Enhanced navigation with iOS optimizations */}
      <nav className="ios-navigation-fix">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 ios-safe-navigation">
          <div className="flex items-center justify-between">
            {/* Logo with consistent sizing */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/817c7ccd-c1cf-4844-8188-1b0d231cd0b9.png" 
                alt="Barrushke Delivery" 
                className="h-8 lg:h-12 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation with improved spacing */}
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-6 py-3")}>
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/products" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-6 py-3")}>
                        Products
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/events" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-6 py-3")}>
                        Events
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/recipes" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-6 py-3")}>
                        Cocktail Recipes
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/help" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-6 py-3")}>
                        Help
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/cart" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 flex items-center gap-2 font-iphone relative px-6 py-3")}>
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                        {totalItems > 0 && (
                          <Badge className="bg-pink-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full absolute -top-2 -right-2">
                            {totalItems}
                          </Badge>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <div className="flex items-center gap-3">
                <Link to="/cart" className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ios-touch-target ios-button-feedback text-barrush-platinum hover:bg-barrush-steel/20"
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="bg-pink-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full absolute -top-2 -right-2">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
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
                    setMobileMenuOpen(true);
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
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navigation;
