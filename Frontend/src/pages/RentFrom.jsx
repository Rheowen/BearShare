import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // ส่ง token ไปด้วย
      },
      body: JSON.stringify({ product_id: id, ...form })
    });

    if (res.ok) {
      navigate("/order-success");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-5 shadow rounded">
      <h2 className="text-xl font-bold mb-4">เช่าสินค้า: {product.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="text" 
          name="name" 
          placeholder="ชื่อผู้เช่า" 
          value={form.name} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
          required
        />
        <input 
          type="text" 
          name="phone" 
          placeholder="เบอร์โทร" 
          value={form.phone} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
          required
        />
        <textarea 
          name="address" 
          placeholder="ที่อยู่" 
          value={form.address} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
          required
        />
        <div>
          <label className="block text-sm font-medium">วันเริ่มเช่า</label>
          <input 
            type="date" 
            name="start_date" 
            value={form.start_date} 
            onChange={handleChange} 
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">วันคืนสินค้า</label>
          <input 
            type="date" 
            name="end_date" 
            value={form.end_date} 
            onChange={handleChange} 
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ยืนยันการเช่า
        </button>
      </form>
    </div>
  );
};

export default RentForm;
