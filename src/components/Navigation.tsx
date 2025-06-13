
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './MobileMenu';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-barrush-midnight/90 backdrop-blur-md border-b border-barrush-steel/30">
        <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4 bg-slate-950">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/817c7ccd-c1cf-4844-8188-1b0d231cd0b9.png" alt="Barrushke Delivery" className="h-10 lg:h-12 w-auto" />
            </Link>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone")}>
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/products" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone")}>
                        Products
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/recipes" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone")}>
                        Recipes
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/help" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 font-iphone")}>
                        Help
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/cart" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20 flex items-center gap-2 font-iphone")}>
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="text-barrush-platinum hover:bg-barrush-steel/20 h-touch w-touch"
              >
                <Menu className="h-5 w-5" />
              </Button>
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
