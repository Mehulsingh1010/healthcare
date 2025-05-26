"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Product } from '@/lib/data/products';
import { getCart as fetchCartFromApi, addToCart as addToCartApi, updateCartItem, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '@/services/cartService';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

interface CartItem extends Product {
  quantity: number;
  productId?: string;
  [key: string]: unknown;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface CartItemResponse {
  productId?: string;
  id?: string;
  name?: string;
  price?: number;
  image?: string;
  quantity?: number | string;
  [key: string]: any; // For any other properties that might be present
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: (forceRefresh?: boolean) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  // Add a ref to track if the initial load has been done
  const initialLoadDone = useRef(false);
  // Add a ref to track ongoing operations
  const pendingOperation = useRef(false);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Define loadCart before it's used in useEffect
  const loadCart = async (forceRefresh = false): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    // Skip if we're already loading or there's a pending operation
    if (isLoading || pendingOperation.current) return;
    
    // Use token directly without validation to prevent loops
    const token = localStorage.getItem('token');
    if (!token) {
      setItems([]);
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      const cartData = await fetchCartFromApi(forceRefresh);
      
      // Only update items if the component is still mounted and data is valid
      if (cartData && cartData.items) {
        // Process items to ensure they have the correct format
        const processedItems = cartData.items.map((item: CartItemResponse) => ({
          ...item,
          id: item.productId || item.id || '', // Ensure id is set for compatibility
          quantity: parseInt(String(item.quantity)) || 1, // Ensure quantity is a number
          // Add default values for required Product properties
          name: item.name || item.product?.name || 'Product',
          description: item.description || '',
          price: item.price || item.product?.price || 0,
          image: item.image || item.product?.image || '',
          category: item.category || '',
          featured: item.featured || false,
          rating: item.rating || 0,
          stockCount: item.stockCount || 0,
          benefits: item.benefits || [],
          ingredients: item.ingredients || [],
          weight: item.weight || '',
        })) as CartItem[];
        
        // Only update state if the items have actually changed
        const itemsChanged = JSON.stringify(processedItems) !== JSON.stringify(items);
        if (itemsChanged) {
          setItems(processedItems);
        }
      } else if (items.length > 0) {
        // Only clear items if there are items to clear
        setItems([]);
      }
    } catch (error: unknown) {
      console.error('Error loading cart:', error);
      
      // Safe type checking for error response
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        setItems([]);
        localStorage.removeItem('token');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Also define addToCart before its useEffect dependency
  const addToCart = async (product: Product) => {
    // Check token directly instead of validating
    const token = localStorage.getItem('token');
    if (!token) {
      // Store product to add after login
      try {
        // Ensure product has required fields
        const safeProduct = {
          id: product.id || '',
          name: product.name || 'Product',
          price: product.price || 0,
          image: product.image || '',
          quantity: 1
        };
        localStorage.setItem('pendingAddToCart', JSON.stringify(safeProduct));
      } catch (error) {
        console.error('Error storing pending cart item:', error);
      }
      toast.error('Please login to add items to cart');
      router.push('/auth/signin?redirect=cart');
      return;
    }
    
    // Prevent concurrent operations
    if (pendingOperation.current) {
      toast.error('Please wait, another operation is in progress');
      return;
    }
    
    // Ensure product has a valid ID
    if (!product.id) {
      toast.error('Invalid product data');
      return;
    }
    
    // Store original items for rollback if needed
    const originalItems = [...items];
    
    // Check if product already exists in cart
    const existingItemIndex = items.findIndex(item => item.id === product.id);
    
    // Apply optimistic update
    let updatedItems;
    if (existingItemIndex !== -1) {
      // If product exists, increase quantity
      updatedItems = items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // If product doesn't exist, add it
      const newItem = {
        ...product,
        quantity: 1
      };
      updatedItems = [...items, newItem];
    }
    
    // Update UI immediately
    setItems(updatedItems);
    
    pendingOperation.current = true;
    setIsLoading(true);
    
    try {
      // Pass productId, quantity and price to satisfy backend validation
      // The backend will override the price with the actual product price
      const result = await addToCartApi(product.id, 1, product.price || 0);
      if (result.success) {
        // We'll still refresh from API but UI is already updated
        await loadCart(true);
        toast.success('Item added to cart');
      } else {
        // Rollback on error
        setItems(originalItems);
        if (result.message && (result.message.includes('authentication') || result.message.includes('login'))) {
          router.push('/auth/signin?redirect=cart');
        }
        toast.error(result.message || 'Failed to add item to cart');
      }
    } catch (error: unknown) {
      // Rollback on error
      setItems(originalItems);
      console.error('Error adding to cart:', error);
      
      // Safe type checking for error response
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/signin?redirect=cart');
      }
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
      pendingOperation.current = false;
    }
  };

  // Load cart from API on mount and when authentication state changes
  useEffect(() => {
    // Only load the cart if authenticated and initial load hasn't been done
    if (isAuthenticated && !initialLoadDone.current && !isLoading && !pendingOperation.current) {
      const loadInitialCart = async () => {
        try {
          initialLoadDone.current = true;
          await loadCart(false); // Don't force refresh on initial load
        } catch (error) {
          console.error('Error in initial cart load:', error);
          initialLoadDone.current = false; // Reset if load fails
        }
      };
      loadInitialCart();
    }
    
    // Reset the flag when auth state changes to false
    if (!isAuthenticated) {
      initialLoadDone.current = false;
      setItems([]);
    }
  }, [isAuthenticated, isLoading]); // Removed loadCart from dependencies

  // Check for pending cart items after login
  useEffect(() => {
    // Track if the component is still mounted
    let isMounted = true;
    
    const checkPendingCartItems = async () => {
      if (!isMounted) return;
      
      if (isAuthenticated && !isLoading) {
        const pendingItem = localStorage.getItem('pendingAddToCart');
        if (pendingItem) {
          try {
            const product = JSON.parse(pendingItem);
            // Validate the product object
            if (!product || typeof product !== 'object' || !product.id) {
              console.error('Invalid pending cart item data');
              localStorage.removeItem('pendingAddToCart');
              return;
            }
            
            // Remove from localStorage first to prevent loops if there's an error
            localStorage.removeItem('pendingAddToCart');
            
            // Add to cart with a small delay to ensure auth is fully processed
            setTimeout(async () => {
              if (!isMounted) return;
              
              try {
                // Create minimal product object with required fields
                const minimalProduct = {
                  id: product.id,
                  name: product.name || 'Product',
                  price: product.price || 0,
                  image: product.image || '',
                  description: '',
                  category: '',
                  featured: false,
                  rating: 0,
                  stockCount: 0,
                  benefits: [],
                  ingredients: [],
                  weight: ''
                };
                
                await addToCart(minimalProduct);
                if (isMounted) {
                  toast.success('Previously selected item added to cart');
                }
              } catch (error) {
                console.error('Error adding pending item to cart:', error);
              }
            }, 500);
          } catch (error) {
            console.error('Error processing pending cart item:', error);
            localStorage.removeItem('pendingAddToCart');
          }
        }
      }
    };

    checkPendingCartItems();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading]); // Remove addToCart from dependencies
  
  const removeFromCart = async (productId: string): Promise<{ success: boolean; message: string }> => {
    // Prevent concurrent operations
    if (pendingOperation.current) {
      toast.error('Please wait, another operation is in progress');
      return { success: false, message: 'Please wait, another operation is in progress' };
    }

    // Store original items for rollback if needed
    const originalItems = [...items];
    
    // Find the item to remove - check both nested and direct ID properties
    const itemToRemove = items.find(item => 
      item.product?._id === productId || 
      item.id === productId || 
      item.productId === productId
    );
    
    if (!itemToRemove) {
      console.error(`Item with ID ${productId} not found in cart`);
      toast.error('Item not found in cart');
      return { success: false, message: 'Item not found in cart' };
    }

    // Apply optimistic update - check both nested and direct ID properties
    const updatedItems = items.filter(item => 
      item.product?._id !== productId && 
      item.id !== productId && 
      item.productId !== productId
    );
    setItems(updatedItems);
    
    pendingOperation.current = true;
    setIsLoading(true);
    
    try {
      // Use the consistent ID for the API call
      const apiId = itemToRemove.product?._id || itemToRemove.productId || itemToRemove.id;
      console.log(`Removing item with ID: ${apiId}`);
      
      const result = await removeFromCartApi(apiId);
      console.log('Remove cart result:', result);
      
      if (result.success) {
        // Don't reload the cart here, as it might cause a race condition
        // Just keep the optimistic update
        toast.success('Item removed from cart');
        return result;
      } else {
        // Rollback on error
        setItems(originalItems);
        toast.error(result.message || 'Failed to remove item from cart');
        return result;
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Rollback on error
      setItems(originalItems);
      toast.error('Failed to remove item from cart');
      return { success: false, message: 'Failed to remove item from cart' };
    } finally {
      pendingOperation.current = false;
      setIsLoading(false);
    }
  };
  
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      console.error('Invalid quantity value:', quantity);
      return;
    }
    
    // Check token directly instead of validating
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to manage your cart');
      router.push('/auth/signin');
      return;
    }
    
    // Prevent concurrent operations
    if (pendingOperation.current) {
      toast.error('Please wait, another operation is in progress');
      return;
    }
    
    // Find the item to validate it exists and get its price
    const item = items.find(item => 
      item.product?._id === productId || 
      item.id === productId || 
      item.productId === productId
    );
    
    if (!item) {
      console.error(`Item with ID ${productId} not found in cart`);
      toast.error('Item not found in cart');
      return;
    }
    
    console.log(`Updating quantity in context for item ${productId} (${item.product?.name || item.name}) from ${item.quantity} to ${quantity}`);
    
    // Store original items for rollback if needed
    const originalItems = [...items];
    
    // Apply optimistic update - check both nested and direct ID properties
    const updatedItems = items.map(cartItem => {
      if (cartItem.product?._id === productId || 
          cartItem.id === productId || 
          cartItem.productId === productId) {
        return { ...cartItem, quantity };
      }
      return cartItem;
    });
    
    // Update UI immediately
    setItems(updatedItems);
    
    pendingOperation.current = true;
    setIsLoading(true);
    
    try {
      // Use the correct ID for the API call
      const apiId = item.product?._id || item.productId || item.id;
      
      // Pass productId, quantity and price to satisfy backend validation
      // The backend will override this with the actual product price
      console.log(`Making API call to update item ${apiId} with price ${item.price} and quantity ${quantity}`);
      
      const result = await updateCartItem(apiId, quantity, item.price || 0);
      console.log('Update cart result:', result);
      
      if (result.success) {
        // Keep the optimistic update, no need to reload the cart
        toast.success(result.message || 'Cart updated');
      } else {
        // Rollback on error
        setItems(originalItems);
        console.error('Failed to update cart item:', result.message);
        if (result.message && (result.message.includes('authentication') || result.message.includes('login'))) {
          router.push('/auth/signin');
        }
        toast.error(result.message || 'Failed to update cart');
      }
    } catch (error: unknown) {
      // Rollback on error
      setItems(originalItems);
      console.error('Error updating quantity:', error);
      
      // Safe type checking for error response
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/signin');
      }
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
      pendingOperation.current = false;
    }
  };
  
  const clearCart = async () => {
    // Check token directly instead of validating
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to manage your cart');
      router.push('/auth/signin');
      return;
    }
    
    // Prevent concurrent operations
    if (pendingOperation.current) {
      toast.error('Please wait, another operation is in progress');
      return;
    }
    
    pendingOperation.current = true;
    setIsLoading(true);
    
    try {
      const result = await clearCartApi();
      if (result.success) {
        setItems([]);
        toast.success(result.message || 'Cart cleared');
      } else {
        if (result.message && (result.message.includes('authentication') || result.message.includes('login'))) {
          router.push('/auth/signin');
        }
        toast.error(result.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Check if error is due to authentication
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/signin');
      }
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
      pendingOperation.current = false;
    }
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        totalItems, 
        totalPrice, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        clearCart,
        loadCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};