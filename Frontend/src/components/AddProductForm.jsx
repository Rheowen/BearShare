import React, { useState } from 'react';

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    price: initialData.price || '',
    category: initialData.category || '',
    description: initialData.description || '',
    image: initialData.image || '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div>
        <label>ชื่อสินค้า:</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>ราคา:</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>หมวดหมู่:</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>รายละเอียด:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div>
        <label>ลิงก์รูปภาพ:</label>
        <input
          type="file"
          name="image"
          value={form.image}
          onChange={handleChange}
        />
      </div>

      <button type="submit">เพิ่มสินค้า</button>
    </form>
  );
};

export default ProductForm;
