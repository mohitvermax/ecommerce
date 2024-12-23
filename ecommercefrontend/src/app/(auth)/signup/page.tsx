"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://ecommerce-86ao.onrender.com//auth/signup", {
        name,
        email,
        password,
        phone,
      });
      if (response.data.userId) {
        // Save userId in localStorage or context
        localStorage.setItem("userId", response.data.userId);
        router.push("/"); // Redirect to home page
      }
    } catch (err) {
      setError("Error signing up. Please try again.");
      console.log(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mb-4 bg-rose-700 text-white py-2 rounded-md hover:bg-black"
          >
            Sign Up
          </button>
          <Link href="/signin" className="w-full">
            Already have an account? <span className="text-rose-700">Log in</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;