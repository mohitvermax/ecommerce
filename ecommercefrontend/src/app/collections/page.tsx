"use client";
import React, { useState, useEffect, Suspense } from 'react';
import SidebarFilter from '@/components/SidebarFilter';
import ProductCard from '@/components/Product/ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

interface FilterState {
  [key: string]: string[];
}

interface FilterSections {
  [key: string]: { label: string; count?: number; min?: number; max?: number | null }[];
}

// Separate component for the main content that uses useSearchParams
const CollectionsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    PRICE: [],
    RATING: [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const filterSections: FilterSections = {
    PRICE: [
      { label: 'Under ₹1000', min: 0, max: 999 },
      { label: '₹1000 - ₹4999', min: 1000, max: 4999 },
      { label: '₹5000 - ₹9999', min: 5000, max: 9999 },
      { label: 'Above ₹10000', min: 10000, max: null },
    ],
    RATING: [
      { label: '4 Stars & Above', min: 4, max: 5 },
      { label: '3 Stars & Above', min: 3, max: 5 },
      { label: '2 Stars & Above', min: 2, max: 5 },
      { label: '1 Star & Above', min: 1, max: 5 },
    ],
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/get-product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        const filteredProducts = category === 'all' ? data.products : data.products.filter((product: Product) => product.category.toLowerCase() === category);
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
      } else {
        console.error('API returned success: false');
      }
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedFilters.PRICE.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedFilters.PRICE.some((priceRange) => {
          const range = filterSections.PRICE.find((range) => range.label === priceRange);
          return (
            range &&
            product.price >= (range.min ?? 0) &&
            //@ts-expect-error max is not null
            (range.max === null || product.price <= range.max)
          );
        });
      });
    }

    if (selectedFilters.RATING.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedFilters.RATING.some((ratingRange) => {
          const range = filterSections.RATING.find((range) => range.label === ratingRange);
          return (
            range &&
            product.rating >= (range.min ?? 0) &&
            product.rating <= (range.max ?? 5)
          );
        });
      });
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (section: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter((item) => item !== value)
        : [...prev[section], value],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-rose-100 rounded-lg overflow-hidden mb-8">
        <div className="p-8 sm:p-12 text-center">
          <h1 className="text-4xl font-serif mb-4">Carnival Sale</h1>
          <p className="text-2xl text-rose-600 mb-2">Up to 80% OFF</p>
          <p className="text-lg">Get Extra 10% OFF on Pre-paid Orders</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <Link href="/" className="text-gray-600 hover:text-rose-600">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:hidden flex justify-between items-center bg-rose-700 text-white p-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <span className="font-medium">Filters</span>
          </button>
        </div>

        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:w-1/4`}>
          <SidebarFilter
            filters={filterSections}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{filteredProducts.length} Products</p>
            <select className="border rounded-md px-2 py-1">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Collections component wrapped in Suspense
const Collections: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionsContent />
    </Suspense>
  );
};

export default Collections;