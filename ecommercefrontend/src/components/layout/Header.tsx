"use client";
import React, { useState } from "react";
import { Menu, Search, User, ShoppingBag, Truck, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext
import { useCart } from "@/context/CartContext"; // Import CartContext

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const { userId, setUserId } = useAuth(); // Use AuthContext to get userId and setUserId
  const { cartItems } = useCart(); // Use CartContext to get cartItems
  const router = useRouter(); // Use Next.js router for navigation

  // Calculate the total number of items in the cart
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Logout function
  const handleLogout = () => {
    setUserId(null); // Clear userId in AuthContext
    localStorage.removeItem("userId"); // Clear userId from localStorage
    alert("Logged out successfully!");
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirect to search page with query
    }
  };

  // Handle "Enter" key press in the search bar
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="w-full bg-rose-700 text-white text-center text-sm py-2 px-4 overflow-hidden">
        <div className="marquee">
          <span>
            SALE - UPTO 80% OFF + EXTRA 10% OFF ON PREPAID ORDERS &nbsp;&nbsp;&nbsp; SALE - UPTO
            80% OFF + EXTRA 10% OFF ON PREPAID ORDERS &nbsp;&nbsp;&nbsp; SALE - UPTO 80% OFF + EXTRA
            10% OFF ON PREPAID ORDERS
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="text-2xl font-serif">
            <Link href="/">MYZONE</Link>
          </div>

          {/* Desktop search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress} // Add key press handler
                className="w-full px-4 py-2 border rounded-full bg-gray-50"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              >
                <Search />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden">
              <Search className="h-6 w-6" />
            </button>

            {/* Conditionally render Account and Logout based on userId */}
            {userId ? (
              <>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-600">
                  Logout
                </button>
                <Link href="/user">
                  <User className="h-6 w-6 hidden md:block" />
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <div className="flex ">
                
                  <User className="h-6 w-6 hidden md:block" />
                  <h1 className="hidden md:block">Signup</h1>
                  
                </div>
                </Link>
                <Link href="/signin">
                <div className="flex ">
                
                <User className="h-6 w-6 hidden md:block" />
                <h1 className="hidden md:block">Signin</h1>
                
              </div>
                </Link>
              </>
            )}
            <Link href="/cart">
              <div className="relative">
                <ShoppingBag className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/orders">
            <Truck className="h-6 w-6 hidden md:block" />
            </Link>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:block border-t">
  <ul className="flex justify-center space-x-8 py-4">
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=electronics`}>ELECTRONICS</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=clothing`}>CLOTHING</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=books`}>BOOKS</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=stationery`}>STATIONERY</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=home-appliances`}>HOME APPLIANCES</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=toys`}>TOYS</Link>
    </li>
  </ul>
</nav>

        {/* Mobile search overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="p-4">
              <button onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-4">
                <X className="h-6 w-6" />
              </button>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress} // Add key press handler
                className="w-full px-4 py-2 border rounded-full bg-gray-50 mt-8"
              />
              <button
                onClick={handleSearch}
                className="mt-2 w-full bg-rose-700 text-white py-2 rounded-md hover:bg-black"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="p-4">
              <button onClick={() => setIsMenuOpen(false)} className="absolute right-4 top-4">
                <X className="h-6 w-6" />
              </button>

  <ul className="mt-8 space-y-4">
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=electronics`}>ELECTRONICS</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=clothing`}>CLOTHING</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=books`}>BOOKS</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=stationery`}>STATIONERY</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=home-appliances`}>HOME APPLIANCES</Link>
    </li>
    <li className="text-sm hover:text-rose-700 cursor-pointer hover:border-b-black">
      <Link href={`/collections?category=toys`}>TOYS</Link>
    </li>
  </ul>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;