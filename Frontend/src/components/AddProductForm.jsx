import React, { useState } from 'react';

const AddProductForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    price: initialData.price || '',
    category: initialData.category || '',
    description: initialData.description || '',
    image: initialData.image || null, 
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ใช้ FormData สำหรับส่งไฟล์
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    onSubmit(formData);
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
        <label>อัปโหลดรูปภาพ:</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <button type="submit">เพิ่มสินค้า</button>
    </form>
  );
};

export default AddProductForm;
