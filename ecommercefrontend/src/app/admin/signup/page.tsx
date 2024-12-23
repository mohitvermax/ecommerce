"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminSignup = () => {
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [sellerId, setSellerId] = useState(""); // State to store the seller ID
  const router = useRouter();

  const handleSignup = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://ecommerce-86ao.onrender.com/admin/seller/signup", {
        name,
        emailId,
        password,
        phoneNumber,
      });

      if (response.data.success) {
        // Store seller ID in state
        setSellerId(response.data.sellerId);
        router.push("/admin/dashboard"); // Redirect to admin dashboard

        setError(""); // Clear any previous errors
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (error) {
      setError("Invalid credentials or server error");
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Seller Signup</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Display Seller ID if available */}
        {sellerId && (
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <p className="text-green-700 font-bold">
              Seller registered successfully! Your Seller ID is:
            </p>
            <p className="text-green-700 font-bold">{sellerId}</p>
            <p className="text-green-700">Please note this ID for future reference.</p>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1  p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
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
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mb-4 bg-rose-700 text-white py-2 rounded-md hover:bg-black"
          >
            Signup
          </button>
          <Link href="/admin/login" className="w-full">
            Already have an account? <span className="text-rose-700">Log in</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;