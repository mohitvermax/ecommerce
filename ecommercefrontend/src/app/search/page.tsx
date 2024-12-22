"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/Product/ProductCard";

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

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query"); // Get the search query from the URL
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-product`);
        if (!query) {
          setProducts([]); // Clear products if no query
          return;
        }
        // Filter products based on the query
        const filteredProducts = response.data.products.filter((product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

        setProducts(filteredProducts);
      } catch (error) {
        setError("Error fetching search results");
        console.log(error)
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]); // Clear products if no query
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for &quot;{query || "..."}&quot;</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <p className="text-gray-500">No products found for &quot;{query}&quot;.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;