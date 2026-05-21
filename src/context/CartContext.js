import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.find(i => i.id === action.product.id);
      if (exists) return state;
      return { ...state, wishlist: [...state.wishlist, action.product] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(i => i.id !== action.id) };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], wishlist: [] });

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const addToWishlist = (product) => dispatch({ type: 'ADD_TO_WISHLIST', product });
  const removeFromWishlist = (id) => dispatch({ type: 'REMOVE_FROM_WISHLIST', id });

  const isInCart = (id) => state.items.some(i => i.id === id);
  const isInWishlist = (id) => state.wishlist.some(i => i.id === id);
  const getQuantity = (id) => state.items.find(i => i.id === id)?.quantity || 0;

  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const savings = state.items.reduce((sum, i) => {
    if (i.originalPrice) return sum + (i.originalPrice - i.price) * i.quantity;
    return sum;
  }, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      wishlist: state.wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInCart,
      isInWishlist,
      getQuantity,
      cartTotal,
      cartCount,
      savings,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
