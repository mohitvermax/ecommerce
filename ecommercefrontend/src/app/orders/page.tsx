"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  orderId: string;
  date: string;
  time: string;
  address: string;
  email: string;
  name: string;
  productIds: string[];
  trackingId: string;
  price: number;
  products: Product[]; // Product details fetched for each order
}
interface Product{
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

const OrdersPage: React.FC = () => {
  const { userId } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      router.push("/signin"); // Redirect to login if not authenticated
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("https://ecommerce-86ao.onrender.com/find-my-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "No orders found");
        }
      } catch (error) {
        setError("Failed to fetch orders");
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, router]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">You have no orders yet.</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order ID: {order.orderId}</h2>
            <p className="text-gray-600">
              {order.date} at {order.time}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Tracking ID:</strong> {order.trackingId}
            </p>
            <p className="text-gray-600">
              <strong>Shipping Address:</strong> {order.address}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {order.email}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center border p-4 rounded-lg"
                >
                  <div className="w-24 h-24 mr-4">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Price: ₹{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">₹{order.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;