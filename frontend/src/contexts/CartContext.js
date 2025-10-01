import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';

const CartContext = createContext(undefined);

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload || { items: [] };
    case 'ADD_ITEM': {
      const { item } = action;
      const existing = state.items.find((i) => i._id === item._id);
      const items = existing
        ? state.items.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i))
        : [...state.items, { ...item, quantity: item.quantity || 1 }];
      return { ...state, items };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i._id !== action.id);
      return { ...state, items };
    }
    case 'UPDATE_QTY': {
      const { id, quantity } = action;
      const items = state.items.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
      return { ...state, items };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('carvohub_cart');
      if (raw) dispatch({ type: 'INIT', payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('carvohub_cart', JSON.stringify(state));
    } catch {}
  }, [state]);

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0), [state.items]);

  const value = useMemo(() => ({
    items: state.items,
    subtotal,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  }), [state.items, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


