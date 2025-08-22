import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ProductForm = ({ onSubmit, initialData = {}, isEditing, onCancel }) => {
  const { user } = useContext(AppContext);  // ดึง user จาก context
  const userId = user?.id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    status: 'available',
    is_rentable: true,
    category_id: '',
    age_group_id: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in to add a product.");
      return;
    }
    const formWithUser = { ...form, user_id: userId };
    onSubmit(formWithUser);  // ส่ง formWithUser แทน form
  };

  return (
      <form onSubmit={handleSubmit} className="border p-4 rounded mb-4">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input mb-2" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input mb-2" />
      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="input mb-2" />
      <select name="status" value={form.status} onChange={handleChange} className="input mb-2">
        <option value="available">Available</option>
        <option value="rented">Rented</option>
        <option value="sold">Sold</option>
        <option value="reserved">Reserved</option>
      </select>
      <label>
        <input type="checkbox" name="is_rentable" checked={form.is_rentable} onChange={handleChange} />
        Rentable
      </label>
      <input type="number" name="category_id" value={form.category_id} onChange={handleChange} placeholder="Category ID" className="input mb-2" />
      <input type="number" name="age_group_id" value={form.age_group_id} onChange={handleChange} placeholder="Age Group ID" className="input mb-2" />
      <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="input mb-2" />
      
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded mr-2">
        {isEditing ? 'Update' : 'Add'}
      </button>
      {isEditing && <button onClick={onCancel} type="button" className="text-red-600">Cancel</button>}
    </form>
  );
};

export default ProductForm;
