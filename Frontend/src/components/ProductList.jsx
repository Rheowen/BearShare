// components/ProductList.jsx
import React from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div>
      {products.map(product => (
        <div key={product.product_id} className="border p-3 mb-3 rounded shadow">
          <h3 className="font-bold">{product.title}</h3>
          <p>{product.description}</p>
          <p>฿ {product.price}</p>
          <p>Status: {product.status}</p>
          <button onClick={() => onEdit(product)} className="text-blue-600 mr-2">Edit</button>
          <button onClick={() => onDelete(product.product_id)} className="text-red-600">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
