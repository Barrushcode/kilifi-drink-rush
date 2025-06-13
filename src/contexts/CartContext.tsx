
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  size: string;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('barrush-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('🛒 Loaded cart from localStorage:', parsedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('❌ Failed to load cart from localStorage:', error);
        localStorage.removeItem('barrush-cart'); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('barrush-cart', JSON.stringify(items));
      console.log('💾 Saved cart to localStorage:', items);
    } catch (error) {
      console.error('❌ Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    console.log('➕ Adding item to cart:', newItem);
    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === newItem.id && item.size === newItem.size
      );

      if (existingItem) {
        console.log('🔄 Updating existing item quantity');
        return prevItems.map(item =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      console.log('🆕 Adding new item to cart');
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    console.log('🗑️ Removing item from cart:', id);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('📊 Updating quantity for item:', id, 'to:', quantity);
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setItems([]);
  };

  const getTotalAmount = () => {
    const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('💰 Cart total amount:', total);
    return total;
  };

  const getTotalItems = () => {
    const total = items.reduce((total, item) => total + item.quantity, 0);
    console.log('📦 Cart total items:', total);
    return total;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalAmount,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error('❌ useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
