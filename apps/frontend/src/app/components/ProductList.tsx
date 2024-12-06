'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  store: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Explore Our Products</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
            <p className="text-md text-gray-600 mb-2">Store: {product.store}</p>
            <p className="text-lg font-semibold text-blue-600">Price: ¥{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
