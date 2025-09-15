// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import AddProductForm from "../components/AddProductForm";

const AdminDashboard = () => {
  const { user } = useAppContext();
  const [tab, setTab] = useState("orders"); // orders | products
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const token = localStorage.getItem("token");

  // ===================== Fetch Orders =====================
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===================== Fetch Products =====================
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===================== Orders Actions =====================
  const confirmReturn = async (orderId) => {
    if (!window.confirm("Confirm that you received returned item?")) return;
    setActionLoading(orderId + "-confirm");
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/confirm-return`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      await fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const completeReturn = async (orderId) => {
    if (!window.confirm("Mark return as COMPLETE?")) return;
    setActionLoading(orderId + "-complete");
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/complete-return`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      await fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ===================== Products Actions =====================
  const addProduct = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add product");
      await fetchProducts();
      alert("Product added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const editProduct = async (productId, formData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update product");
      await fetchProducts();
      alert("Product updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
      alert("Product deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders();
      fetchProducts();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "admin") return <p>Access denied</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded ${
            tab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📌 Orders Management
        </button>
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded ${
            tab === "products" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📦 Products Management
        </button>
      </div>

      {/* Orders Management */}
      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Order</th>
                <th className="border px-3 py-2">User</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Return Status</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_id}>
                  <td className="border px-3 py-2">{o.order_id}</td>
                  <td className="border px-3 py-2">{o.user_name || o.name}</td>
                  <td className="border px-3 py-2">{o.title}</td>
                  <td className="border px-3 py-2">{o.return_status ?? "not_returned"}</td>
                  <td className="border px-3 py-2">
                    {o.return_status === "requested" && (
                      <button
                        disabled={actionLoading === o.order_id + "-confirm"}
                        onClick={() => confirmReturn(o.order_id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        {actionLoading === o.order_id + "-confirm" ? "..." : "Confirm Return"}
                      </button>
                    )}
                    {o.return_status === "returned" && (
                      <button
                        disabled={actionLoading === o.order_id + "-complete"}
                        onClick={() => completeReturn(o.order_id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        {actionLoading === o.order_id + "-complete" ? "..." : "Complete Return"}
                      </button>
                    )}
                    {(!o.return_status || o.return_status === "not_returned") && (
                      <span className="text-sm text-gray-500">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Management */}
      {tab === "products" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>

          {/* Add Product Form */}
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h3 className="font-bold mb-2">Add Product</h3>
            <AddProductForm onSubmit={addProduct} />
          </div>

          {/* Products Table */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Title</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Price</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  <td className="border px-3 py-2">{p.product_id}</td>
                  <td className="border px-3 py-2">{p.title}</td>
                  <td className="border px-3 py-2">{p.category}</td>
                  <td className="border px-3 py-2">{p.price}</td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => editProduct(p.product_id, promptForm(p))}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.product_id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helper: Simple prompt for Edit (you can replace with a proper modal/form)
const promptForm = (product) => {
  const title = window.prompt("Title", product.title);
  const price = window.prompt("Price", product.price);
  const category = window.prompt("Category", product.category);
  const description = window.prompt("Description", product.description);
  const formData = new FormData();
  formData.append("title", title || product.title);
  formData.append("price", price || product.price);
  formData.append("category", category || product.category);
  formData.append("description", description || product.description);
  return formData;
};

export default AdminDashboard;
