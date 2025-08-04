import React, { useEffect, useState } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../api/productApi';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = async (data) => {
    await addProduct(data);
    loadProducts();
  };

  const handleUpdate = async (data) => {
    await updateProduct(editingProduct.product_id, data);
    setEditingProduct(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ProductForm
        onSubmit={editingProduct ? handleUpdate : handleAdd}
        initialData={editingProduct}
        isEditing={!!editingProduct}
        onCancel={() => setEditingProduct(null)}
      />
      <ProductList
        products={products}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductsPage;
