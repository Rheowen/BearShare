import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const AdminDashboard = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // รีเฟรชตารางหลังอัปเดต
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Access denied: Admins only");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [user]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Order ID</th>
            <th className="border px-3 py-2">User</th>
            <th className="border px-3 py-2">Product</th>
            <th className="border px-3 py-2">Price</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td className="border px-3 py-2">{o.order_id}</td>
              <td className="border px-3 py-2">{o.name || o.username || o.email}</td>
              <td className="border px-3 py-2">{o.title}</td>
              <td className="border px-3 py-2">${o.price}</td>
              <td className="border px-3 py-2">{o.status}</td>
              <td className="border px-3 py-2 flex gap-2">
                {o.status === "pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => updateStatus(o.order_id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => updateStatus(o.order_id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {o.status !== "pending" && <span className="italic">{o.status}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
