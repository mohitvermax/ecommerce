"use client";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, getCartTotal, fetchCart, clearCart } = useCart();
  const { userId } = useAuth();

  // State to store the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the cart when the component mounts or when the userId changes
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await fetchCart();
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {/* Clear Cart Button */}
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Clear Cart
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full md:w-2/3">
            {cartItems.map((product) => (
              <div
                key={product._id} 
                className="flex items-center border-b py-4"
              >
                <div className="w-24 h-24 mr-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                  <p className="text-sm text-gray-600">
                    Total: ₹{(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(product._id, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                      className="px-2 py-1 border rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        updateQuantity(product._id, parseInt(e.target.value))
                      }
                      className="w-12 text-center border"
                    />
                    <button
                      onClick={() => updateQuantity(product._id, product.quantity + 1)}
                      className="px-2 py-1 border rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-semibold">₹{getCartTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Shipping</p>
                <p className="font-semibold">Free</p>
              </div>
              <div className="border-t py-4">
                <div className="flex justify-between">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-lg font-bold">₹{getCartTotal().toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => alert("Order placed!")}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;