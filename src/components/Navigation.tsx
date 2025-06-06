
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-barrush-midnight/90 backdrop-blur-md border-b border-barrush-steel/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold font-serif text-rose-600">
            Barrush
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20"
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/products" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20"
                    )}
                  >
                    Products
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/recipes" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20"
                    )}
                  >
                    Recipes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/help" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-barrush-platinum hover:text-rose-600 hover:bg-barrush-steel/20"
                    )}
                  >
                    Help
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
