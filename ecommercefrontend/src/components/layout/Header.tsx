"use client";
import React, { useState } from "react";
import { Menu, Search, User, ShoppingBag, Truck, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId, setUserId } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    alert("Logged out successfully!");
    setIsMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

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

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="text-2xl font-serif">
            <Link href="/">MYZONE</Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
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

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden">
              <Search className="h-6 w-6" />
            </button>

            {userId ? (
              <>
                <button onClick={handleLogout} className="hidden md:block text-sm font-medium text-gray-600">
                  Logout
                </button>
                <Link href="/user" className="hidden md:block">
                  <User className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className="hidden md:flex items-center space-x-1">
                  <User className="h-6 w-6" />
                  <span>Signup</span>
                </Link>
                <Link href="/signin" className="hidden md:flex items-center space-x-1">
                  <User className="h-6 w-6" />
                  <span>Signin</span>
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
            <Link href="/orders" className="hidden md:block">
              <Truck className="h-6 w-6" />
            </Link>
          </div>
        </div>

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
                onKeyPress={handleSearchKeyPress}
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

        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="p-4">
              <button onClick={() => setIsMenuOpen(false)} className="absolute right-4 top-4">
                <X className="h-6 w-6" />
              </button>

              {/* Authentication Section in Mobile Menu */}
              <div className="mt-8 mb-6 border-b pb-4">
                {userId ? (
                  <div className="space-y-4">
                    <Link href="/user" className="flex items-center space-x-2 text-gray-600">
                      <User className="h-5 w-5" />
                      <span>My Account</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-600"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link 
                      href="/signin" 
                      className="block w-full bg-rose-700 text-white py-2 px-4 rounded-md text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block w-full border border-rose-700 text-rose-700 py-2 px-4 rounded-md text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Orders Link in Mobile Menu */}
              <Link 
                href="/orders" 
                className="flex items-center space-x-2 text-gray-600 mb-6"
                onClick={() => setIsMenuOpen(false)}
              >
                <Truck className="h-5 w-5" />
                <span>My Orders</span>
              </Link>

              {/* Categories */}
              <ul className="space-y-4">
                <li className="text-sm hover:text-rose-700 cursor-pointer">
                  <Link href={`/collections?category=electronics`} onClick={() => setIsMenuOpen(false)}>ELECTRONICS</Link>
                </li>
                <li className="text-sm hover:text-rose-700 cursor-pointer">
                  <Link href={`/collections?category=clothing`} onClick={() => setIsMenuOpen(false)}>CLOTHING</Link>
                </li>
                <li className="text-sm hover:text-rose-700 cursor-pointer">
                  <Link href={`/collections?category=books`} onClick={() => setIsMenuOpen(false)}>BOOKS</Link>
                </li>
                <li className="text-sm hover:text-rose-700 cursor-pointer">
                  <Link href={`/collections?category=stationery`} onClick={() => setIsMenuOpen(false)}>STATIONERY</Link>
                </li>
                <li className="text-sm hover:text-rose-700 cursor-pointer">
                  <Link href={`/collections?category=home-appliances`} onClick={() => setIsMenuOpen(false)}>HOME APPLIANCES</Link>
                </li>
                <li className="text-sm hover:text-rose-700 cursor-pointer">
                  <Link href={`/collections?category=toys`} onClick={() => setIsMenuOpen(false)}>TOYS</Link>
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