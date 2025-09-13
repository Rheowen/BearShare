import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const AdminDashboard = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // ===== FETCH ORDERS ======
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
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==== UPDATE STATUS ====
  const updateStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      await fetchOrders(); // refresh after update
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ====== FILTER & SEARCH ======
  const filteredOrders = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch =
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // ====== USE EFFECT ====
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="returned">Returned</option>
        </select>

        <input
          type="text"
          placeholder="Search by product or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
      </div>

      {/* Orders Table */}
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
          {filteredOrders.map((o) => (
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
                      disabled={updatingOrderId === o.order_id}
                      className="bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
                      onClick={() => updateStatus(o.order_id, "approved")}
                    >
                      {updatingOrderId === o.order_id ? "Updating..." : "Approve"}
                    </button>
                    <button
                      disabled={updatingOrderId === o.order_id}
                      className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                      onClick={() => updateStatus(o.order_id, "rejected")}
                    >
                      {updatingOrderId === o.order_id ? "Updating..." : "Reject"}
                    </button>
                    <button
                      disabled={updatingOrderId === o.order_id}
                      className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
                      onClick={() => updateStatus(o.order_id, "returned")}
                    >
                      {updatingOrderId === o.order_id ? "Updating..." : "Mark Returned"}
                    </button>
                  </>
                )}
                {o.status !== "pending" && o.status !== "returned" && (
                  <span className="italic">{o.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <p className="mt-4 text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
