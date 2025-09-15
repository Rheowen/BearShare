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
  const plans = [3, 7, 14, 30];

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setCoinCost(data.rent_cost * form.rental_days);
      });
  }, [id]);

  const handleDaysChange = (e) => {
    const days = Number(e.target.value);
    setForm({ ...form, rental_days: days });
    setCoinCost(product.rent_cost * days);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting order:", {
      ...form,
      product_id: id,
      coins_cost: coinCost,
    });

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        product_id: id,
        name: form.name,
        phone: form.phone,
        address: form.address,
        rental_days: form.rental_days,
        coins_cost: coinCost,
      }),
    });

    const data = await res.json();
    console.log("Response from backend:", data);

    if (res.ok) {
      // ข้อมูลไปหน้า success
      navigate("/order-success", {
        state: {
          product,
          form,
          coinCost,
          due_date: data.due_date, 
        },
      });
    } else {
      alert(data.message || "เกิดข้อผิดพลาด");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="flex -mt-11 justify-between bg-white p-8">
      <div className="w-2/4 ml-3 mt-8 flex flex-col justify-center items-start p-6 mr-0">
        <h2 className="text-xl font-bold mb-6">Rent: {product.title}</h2>
        <img
          src={
            product.image ||
            "https://i.pinimg.com/1200x/76/0d/58/760d586bb7d1a571a7843580be97f8ec.jpg"
          }
          alt={product.title}
          className="w-70 h-70 object-cover border-2 border-[#FAAB78] rounded mb-4"
        />
        <p className="text-sm text-gray-500 mb-2">
          เหรียญต่อวัน: {product.rent_cost} Coins
        </p>
        <p className="text-sm text-gray-500 mb-2">
          รวมเหรียญ: {coinCost} Coins
        </p>
        <p className="text-sm text-gray-500 ">
          ระยะเวลาเช่า: {form.rental_days} วัน
        </p>
      </div>
      <div className="flex flex-col w-2/4 ml-3 mt-8 p-6 ">
        <h2 className="text-xl font-bold mb-4">ข้อมูลการเช่า</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="ชื่อผู้เช่า"
            value={form.name}
            onChange={handleChange}
            className="w-100 border p-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={handleChange}
            className="w-100 border p-2 rounded"
            required
          />
          <textarea
            name="address"
            placeholder="ที่อยู่"
            value={form.address}
            onChange={handleChange}
            className="w-100 border p-2 rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium">จำนวนวันเช่า</label>
            <select
              value={form.rental_days}
              onChange={handleDaysChange}
              className="w-100 border p-2 rounded"
            >
              {plans.map((day) => (
                <option  key={day} value={day}>
                  {day} วัน ({day * product.rent_cost} Coins)
                </option>
              ))}
            </select>
          </div>

          <p className="text-gray-700">
            รวมเหรียญที่จะใช้: {coinCost} Coins
          </p>

          <button
            type="submit"
            className="bg-[#FAAB78] text-white px-4 py-2 rounded"
          >
            ยืนยันการเช่า
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentForm;
