"use client";
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  emoji?: string;
  imageUrl?: string;
}

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'SET_CART':
      return { items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { user } = useAuth();
  const loadedUserIdRef = useRef<string | null>(null);

  // Fetch cart from DB on login/load
  useEffect(() => {
    if (user) {
      loadedUserIdRef.current = null;
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
          loadedUserIdRef.current = user.id;
          if (data.success && data.cart) {
            dispatch({ type: 'SET_CART', payload: data.cart.items });
          }
        })
        .catch(err => {
          console.error("Failed to fetch cart", err);
          loadedUserIdRef.current = user.id;
        });
    } else {
      // Guest user or logged out
      loadedUserIdRef.current = null;
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  // Sync cart to DB on changes
  useEffect(() => {
    if (user && loadedUserIdRef.current === user.id) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: state.items }),
      }).catch(console.error);
    }
  }, [state.items, user]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
