"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

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
    description: string;
  }


  useEffect(() => {
    // Check if admin is logged in on the client side
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/admin/login"); // Redirect to login if not authenticated
    } else {
      fetchProducts(); // Fetch products if authenticated
    }
  }, [router]);


  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-product");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
      setError("Error fetching products");
    }
  };

  // Fetch products from the backend

  // Add product
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/create-product", {
        name: productName,
        price: productPrice,
        category: productCategory,
        description: productDescription,
      });

      if (response.data.success) {
        alert("Product added successfully");
        setProductName("");
        setProductPrice("");
        setProductCategory("");
        setProductDescription("");
        // Refresh product list
        fetchProducts();
      } else {
        setError(response.data.message || "Failed to add product");
      }
    } catch (error) {
      setError("Error adding product");
      console.log(error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login"); // Redirect to login page after logout
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mb-4"
      >
        Logout
      </button>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAddProduct}>
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
              Product Price
            </label>
            <input
              type="number"
              id="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">
              Product Category
            </label>
            <input
              type="text"
              id="productCategory"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* List of Products */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <ul>
          {products.map((product: Product) => (
            <li key={product._id} className="border-b py-2">
              <p>Name: {product.name}</p>
              <p>Price: ₹{product.price}</p>
              <p>Category: {product.category}</p>
              <p>Description: {product.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;