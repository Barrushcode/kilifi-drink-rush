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
      {/* Full-width nav with max-w for content */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-barrush-steel/30 w-full">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-3 bg-black flex justify-between items-center">
          {/* Logo with consistent sizing */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/817c7ccd-c1cf-4844-8188-1b0d231cd0b9.png" 
              alt="Barrushke Delivery" 
              className="h-8 lg:h-14 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation with improved spacing */}
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-8 py-4 text-lg lg:text-xl")}>
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/products" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-8 py-4 text-lg lg:text-xl")}>
                      Products
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/recipes" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-8 py-4 text-lg lg:text-xl")}>
                      Recipes
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/help" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone px-8 py-4 text-lg lg:text-xl")}>
                      Help
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/cart" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 flex items-center gap-2 font-iphone relative px-8 py-4 text-lg lg:text-xl")}>
                      <ShoppingCart className="h-5 w-5" />
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
                  className="text-barrush-platinum hover:bg-barrush-steel/20 h-touch w-touch"
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
                onClick={() => setMobileMenuOpen(true)}
                className="text-barrush-platinum hover:bg-barrush-steel/20 h-touch w-touch"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
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
