
import React from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, getTotalAmount, removeItem } = useCart();

  return (
    <Drawer open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DrawerContent className="max-w-sm right-0 ml-auto h-full border-l border-neon-pink bg-barrush-charcoal p-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl mb-4 text-neon-pink font-bold text-center">Your Cart</h2>
          {items.length === 0 ? (
            <p className="text-white text-center">Your cart is empty</p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id + item.size} className="flex items-center gap-3 bg-neon-purple/30 rounded-lg p-2">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-white">{item.name} ({item.size})</p>
                    <p className="text-neon-pink text-xs">KES {item.priceFormatted}</p>
                  </div>
                  <span className="text-gray-200 text-sm mr-2">x{item.quantity}</span>
                  <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)} className="h-7 w-7 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="border-t border-neon-purple pt-3 mt-3 flex justify-between text-lg font-bold text-white">
                <span>Total:</span>
                <span className="text-neon-pink">KES {getTotalAmount().toLocaleString()}</span>
              </div>
              <Button
                className="mt-4 w-full bg-neon-pink hover:bg-neon-pink/90 text-white"
                onClick={onClose}
                asChild
              >
                <a href="/cart">Go to Checkout</a>
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
