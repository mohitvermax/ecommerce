"use client";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  rating: number;
  productId: string;
  instockValue: number;
  soldStockValue: number;
  visibility: string;
  size: string[];
  material: string;
  color: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartItemsId {
  _id: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (_id: string, quantity: number) => void;
  removeItem: (_id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  fetchCart: () => Promise<void>; // Function to fetch the cart from the backend
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { userId } = useAuth();

  // Function to fetch the cart from the backend and product details
  const fetchCart = async () => {
    if (!userId) return;
  
    try {
      // Step 1: Fetch the cart items (product IDs and quantities)
      const cartResponse = await axios.post<{ cart: { productsInCart: CartItemsId[] } }>(
        "https://ecommerce-86ao.onrender.com//cart/get-cart",
        { userId }
      );
  
      const productsInCart = cartResponse.data.cart.productsInCart;
      console.log(productsInCart)
  
      // Step 2: Fetch product details for each product ID in the cart
      const productPromises = productsInCart.map(async (item) => {

        console.log(item._id)
        const productResponse = await axios.get(`https://ecommerce-86ao.onrender.com//product/${item._id}`);
        return {
          ...productResponse.data.product,
          quantity: item.quantity, // Add quantity from cartItems
        };
      });
  
      // Step 3: Wait for all product details to be fetched
      const fetchedProducts = await Promise.all(productPromises);
  
      // Step 4: Update the cartItems state with the fetched product details
      setCartItems(fetchedProducts);
      console.log(cartItems)
    } catch (err) {
      console.error("Error fetching cart or product details:", err);
    }
  };

  // Add a product to the cart (via backend)
  const addToCart = async (product: Product, quantity: number) => {
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.post("https://ecommerce-86ao.onrender.com//cart/addtocart", {
        userId,
        _id: product._id,
        quantity,
      });
      alert("Product added to cart!");
      fetchCart(); // Fetch the updated cart from the backend
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // Update the quantity of a product in the cart (via backend)
  const updateQuantity = async (_id: string, quantity: number) => {
    if (!userId) return;

    try {
      await axios.put("https://ecommerce-86ao.onrender.com//cart/update-quantity", {
        userId,
        _id,
        productQty: quantity,
      });
      fetchCart(); // Fetch the updated cart from the backend
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove a product from the cart (via backend)
  const removeItem = async (_id: string) => {
    if (!userId) return;

    try {
      await axios.post("https://ecommerce-86ao.onrender.com//cart/delete-items", {
        userId,
        _id,
      });
      fetchCart(); // Fetch the updated cart from the backend
      console.log("deleted");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Clear the entire cart (via backend)
  const clearCart = async () => {
    if (!userId) return;

    try {
      await axios.post("https://ecommerce-86ao.onrender.com//cart/clear-cart", { userId });
      setCartItems([]); // Clear the local state
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Calculate the total price of the cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getCartTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};