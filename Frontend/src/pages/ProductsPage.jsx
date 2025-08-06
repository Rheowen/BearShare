
import React, { useEffect, useState } from 'react';
import ProductCard from "../components/ProductCard"

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(true); // สมมติเป็น seller
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products || data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (productId) => {
    // ลบสินค้า เช่น call API ลบแล้วอัพเดต products state
    setProducts(prev => prev.filter(p => p.product_id !== productId));
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map(product => (
          <ProductCard
            key={product.product_id}
            product={product}
            isSeller={isSeller}
            onEdit={() => handleEdit(product)}
            onDelete={() => handleDelete(product.product_id)}
          />
        ))
      )}
    </div>
  );
};

export default ProductsPage;
