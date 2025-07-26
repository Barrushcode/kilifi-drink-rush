import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react';
import { IngredientProduct, matchIngredientsToProducts, parseIngredients } from '@/services/ingredientMatchingService';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
interface IngredientBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  cocktailName: string;
  ingredientsText: string;
}
const IngredientBundleModal: React.FC<IngredientBundleModalProps> = ({
  isOpen,
  onClose,
  cocktailName,
  ingredientsText
}) => {
  const [ingredients, setIngredients] = useState<IngredientProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    addItem
  } = useCart();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (isOpen && ingredientsText) {
      loadIngredients();
    }
  }, [isOpen, ingredientsText]);
  const loadIngredients = async () => {
    setLoading(true);
    try {
      const parsedIngredients = parseIngredients(ingredientsText);
      const matchedProducts = await matchIngredientsToProducts(parsedIngredients);
      setIngredients(matchedProducts);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      toast({
        title: "Error",
        description: "Failed to load ingredients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setIngredients(prev => prev.map(ingredient => ingredient.id === id ? {
      ...ingredient,
      quantity: newQuantity
    } : ingredient));
  };
  const getTotalPrice = () => {
    return ingredients.filter(ingredient => ingredient.isMatched && ingredient.quantity > 0).reduce((total, ingredient) => total + ingredient.price * ingredient.quantity, 0);
  };
  const addBundleToCart = () => {
    const availableIngredients = ingredients.filter(ingredient => ingredient.isMatched && ingredient.quantity > 0);
    if (availableIngredients.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one available ingredient to add to cart.",
        variant: "destructive"
      });
      return;
    }

    // Add each ingredient to cart
    availableIngredients.forEach(ingredient => {
      for (let i = 0; i < ingredient.quantity; i++) {
        addItem({
          id: `${ingredient.name}-Standard`,
          name: ingredient.name,
          price: ingredient.price,
          priceFormatted: ingredient.priceFormatted,
          size: 'Standard',
          image: '',
          // We don't have images for individual ingredients
          category: ingredient.category
        });
      }
    });
    toast({
      title: "Bundle added to cart!",
      description: `Added ${availableIngredients.length} ingredients for ${cocktailName} to your cart.`
    });
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-barrush-midnight border border-barrush-steel/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-barrush-platinum">
            🍸 {cocktailName} - Ingredient Bundle
          </DialogTitle>
        </DialogHeader>

        {loading ? <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-pink"></div>
            <span className="ml-3 text-barrush-platinum">Finding ingredients...</span>
          </div> : <div className="space-y-4">
            <div className="bg-glass-effect border border-barrush-steel/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-neon-pink" />
                <span className="text-sm font-semibold text-neon-pink">Bundle Details</span>
              </div>
              <p className="text-sm text-barrush-platinum/80">
                We've matched your cocktail ingredients to available products. 
                Adjust quantities as needed and add to cart.
              </p>
            </div>

            <div className="grid gap-3">
              {ingredients.map(ingredient => <Card key={ingredient.id} className="bg-glass-effect border border-barrush-steel/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-barrush-platinum">
                            {ingredient.name}
                          </h4>
                          <Badge variant={ingredient.isMatched ? "default" : "secondary"} className={`text-xs ${ingredient.isMatched ? "bg-neon-pink/20 text-neon-pink border-neon-pink/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>
                            {ingredient.isMatched ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                        <p className="text-xs text-barrush-platinum/60 mb-1">
                          Original: {ingredient.originalIngredient}
                        </p>
                        <p className="text-sm text-barrush-platinum/80">
                          {ingredient.priceFormatted} • {ingredient.category}
                        </p>
                      </div>

                      {ingredient.isMatched && <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(ingredient.id, ingredient.quantity - 1)} disabled={ingredient.quantity <= 0} className="h-8 w-8 p-0 border-barrush-steel/50 text-barrush-platinum hover:border-neon-pink/50 bg-red-600 hover:bg-red-500">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-barrush-platinum font-semibold">
                            {ingredient.quantity}
                          </span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(ingredient.id, ingredient.quantity + 1)} className="h-8 w-8 p-0 border-barrush-steel/50 text-barrush-platinum hover:border-neon-pink/50 bg-green-600 hover:bg-green-500">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>}
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            <div className="border-t border-barrush-steel/30 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-barrush-platinum">
                  Total Bundle Price:
                </span>
                <span className="text-xl font-bold text-neon-pink">
                  KES {getTotalPrice().toLocaleString()}
                </span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 border-barrush-steel/50 text-barrush-platinum hover:border-neon-pink/50 bg-gray-500 hover:bg-gray-400">
                  Cancel
                </Button>
                <Button onClick={addBundleToCart} disabled={getTotalPrice() === 0} variant="green" className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          </div>}
      </DialogContent>
    </Dialog>;
};
export default IngredientBundleModal;