import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const RentPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    rental_days: 1,
    start_date: "",
  });

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("โหลดข้อมูลสินค้าไม่สำเร็จ");
        const data = await res.json();
        setProduct(data.product || data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("กรุณา login ก่อนทำการเช่า");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");

      alert("เช่าสินค้าสำเร็จ! รอการอนุมัติจาก Admin");
      navigate("/myorders");
    } catch (err) {
      console.error(err);
      alert("เช่าสินค้าล้มเหลว: " + err.message);
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูลสินค้า...</p>;
  if (!product) return <p>ไม่พบสินค้า</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <img
        src={product.image || "https://via.placeholder.com/400x300"}
        alt={product.title}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <p className="text-gray-700 mb-2">{product.category}</p>
      <p className="text-indigo-500 text-2xl font-semibold mb-4">${product.price}</p>
      <p className="text-gray-600 mb-4">{product.description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ชื่อผู้เช่า"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="เบอร์โทร"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="ที่อยู่สำหรับจัดส่ง/รับสินค้า"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="rental_days"
          value={form.rental_days}
          onChange={handleChange}
          min={1}
          placeholder="จำนวนวันเช่า"
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-[#FAAB78] p-2 rounded text-white font-semibold hover:bg-[#F79657] transition"
        >
          ยืนยันเช่า
        </button>
      </form>
    </div>
  );
};

export default RentPage;
