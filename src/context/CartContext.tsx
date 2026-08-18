"use client";

import { createContext, useContext, useEffect, useReducer, useState, ReactNode } from "react";

// Deliberately only what's needed to render the cart UI. `price` is a
// display-only snapshot taken when the item was added — the server always
// re-fetches the real, current price/stock at checkout and never trusts this.
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.productId === action.item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId ? { ...i, quantity: i.quantity + action.quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: action.quantity }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    case "UPDATE_QUANTITY": {
      // Dropping to zero (or below) removes the item — the UI's "−" button
      // relies on this instead of needing a separate remove step.
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== action.productId) };
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Slide-out drawer visibility — UI presentation state, kept alongside the
  // cart data itself rather than in a second context, since the Header
  // icon, AddToCartButton, and the drawer all need to share it. Cart data
  // logic (add/remove/update/totals) above is untouched.
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "family-seba-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  // Starting state must match on server and first client render (both
  // empty) to avoid a hydration mismatch — localStorage is only read after
  // mount, via the effect below.
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        if (Array.isArray(items)) {
          dispatch({ type: "HYDRATE", items });
        }
      }
    } catch {
      // Corrupted localStorage value — ignore and start with an empty cart.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, isHydrated]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    itemCount,
    subtotal,
    addItem: (item, quantity = 1) => dispatch({ type: "ADD_ITEM", item, quantity }),
    removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
