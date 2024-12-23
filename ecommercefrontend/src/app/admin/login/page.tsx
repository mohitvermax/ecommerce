"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sellerId, setSellerId] = useState("");
  const router = useRouter();

  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://ecommerce-86ao.onrender.com//admin/login", {
        sellerId,
        emailOrPhone,
        password,
      });

      if (response.data.success) {
        // Store seller ID in localStorage or session
        localStorage.setItem("sellerId", response.data.sellerId);
        router.push("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      setError("Invalid credentials or server error");
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
        <div className="mb-4">
            <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700">
              SellerId
            </label>
            <input
              type="text"
              id="sellerId"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
              Email or Phone
            </label>
            <input
              type="text"
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mb-4 bg-rose-700 text-white py-2 rounded-md hover:bg-black"
          >
            Login
          </button>
          <Link href="/admin/signup" className="w-full">
            Don&apos;t have an account? <span className="text-rose-700">Sign up</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;