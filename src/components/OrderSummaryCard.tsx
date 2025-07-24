import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
interface ZoneInfo {
  name: string;
  fee: number;
}
interface Item {
  id: string;
  name: string;
  image: string;
  size: string;
  priceFormatted: string;
  quantity: number;
}
interface OrderSummaryCardProps {
  items: Item[];
  getTotalItems: () => number;
  getTotalAmount: () => number;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  zoneObject: ZoneInfo | undefined;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
}
const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  getTotalItems,
  getTotalAmount,
  updateQuantity,
  removeItem,
  zoneObject,
  deliveryFee,
  subtotal,
  totalAmount
}) => <Card className="bg-barrush-charcoal/80 border-neon-pink border w-full">
    <CardHeader>
      <CardTitle className="text-neon-pink text-zinc-50">Order Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {items.map(item => <div key={item.id} className="flex items-center space-x-3 p-3 bg-neon-purple/40 rounded-lg">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
              <p className="text-gray-300 text-xs">{item.size}</p>
              <p className="text-neon-pink-light font-bold text-sm">{item.priceFormatted}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 p-0 border-gray-600">
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-white w-8 text-center">{item.quantity}</span>
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 p-0 border-gray-600">
                <Plus className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)} className="h-8 w-8 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>)}
      </div>
      <div className="border-t border-neon-purple pt-4 space-y-2">
        <div className="flex justify-between text-white">
          <span>Subtotal ({getTotalItems()} items):</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-white">
          <span>
            Express Delivery ({zoneObject ? zoneObject.name : "Zone"}):
          </span>
          <span>KES {deliveryFee}</span>
        </div>
        <div className="border-t border-neon-purple pt-2">
          <div className="flex justify-between text-xl font-bold text-white">
            <span>Total:</span>
            <span className="text-neon-pink">KES {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
    </CardContent>
  </Card>;
export default OrderSummaryCard;