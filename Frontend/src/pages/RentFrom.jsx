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
    rental_days: 3, // default
  });
  const [coinCost, setCoinCost] = useState(0);
  const plans = [3, 7, 14, 30]; // ปรับเป็น dynamic ต่อสินค้า

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setCoinCost(data.coin_per_day * form.rental_days); // คำนวณเริ่มต้น
      });
  }, [id]);

  const handleDaysChange = (e) => {
    const days = Number(e.target.value);
    setForm({ ...form, rental_days: days });
    setCoinCost(product.coin_per_day * days); // คำนวณเหรียญอัตโนมัติ
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ 
        product_id: id,
        ...form,
        coins_cost: coinCost
      })
    });
    if (res.ok) navigate("/order-success");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-5 shadow rounded">
      <h2 className="text-xl font-bold mb-4">เช่าสินค้า: {product.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="ชื่อผู้เช่า" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="phone" placeholder="เบอร์โทร" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="address" placeholder="ที่อยู่" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" required />
        
        <div>
          <label className="block text-sm font-medium">จำนวนวันเช่า</label>
          <select value={form.rental_days} onChange={handleDaysChange} className="w-full border p-2 rounded">
            {plans.map(day => (
              <option key={day} value={day}>
                {day} วัน ({day * product.rent_cost} Coins)
              </option>
            ))}
          </select>
        </div>

        <p className="text-gray-700">รวมเหรียญที่จะใช้: {coinCost} Coins</p>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          ยืนยันการเช่า
        </button>
      </form>
    </div>
  );
};

export default RentForm;
