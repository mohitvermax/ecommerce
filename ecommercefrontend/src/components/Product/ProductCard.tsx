import { useCart } from '@/context/CartContext';
import React from 'react';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1); // Add 1 quantity of the product to the cart
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-56 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 bg-rose-700 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-rose-700 transition-colors duration-300">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <p>
            <span className="text-rose-700 font-semibold">Price:</span> ${product.price}
          </p>
          <p>
            <span className="text-rose-700 font-semibold">Rating:</span> {product.rating} ⭐
          </p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold text-rose-700">In Stock:</span> {product.instockValue}
          </p>
          <p>
            <span className="font-semibold text-rose-700">Sold:</span> {product.soldStockValue}
          </p>
          <p className="col-span-2">
            <span className="font-semibold text-rose-700">Visibility:</span> {product.visibility}
          </p>
        </div>
      </div>
      <div className="mt-4 px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full bg-rose-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-rose-800 transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;