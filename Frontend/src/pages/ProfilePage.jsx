import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const ProfilePage = () => {
  const { user, setUser } = useAppContext();
  const token = localStorage.getItem("token");

  // ===== Tabs =====
  const [activeTab, setActiveTab] = useState("profile");

  // ===== Profile Form =====
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [message, setMessage] = useState("");

  // ===== Handle Form Change =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Update Profile =====
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      setMessage("Profile updated successfully");
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  // ===== Avatar Upload =====
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setLoadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await fetch(
        `http://localhost:5000/api/users/${user.id}/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");
      setMessage("Avatar uploaded successfully");
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoadingAvatar(false);
    }
  };

  // ===== Fetch Orders =====
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch(`http://localhost:5000/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user && token) fetchOrders();
  }, [user, token]);

  if (!user) return <p>Please login to view profile.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* ===== Tabs ===== */}
      <div className="flex gap-4 mb-6 border-b">
        {["profile", "avatar", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab === "profile"
              ? "Profile Info"
              : tab === "avatar"
              ? "Avatar"
              : "Order History"}
          </button>
        ))}
      </div>

      {/* ===== Profile Tab ===== */}
      {activeTab === "profile" && (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            ></textarea>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Profile
          </button>
        </form>
      )}

      {/* ===== Avatar Tab ===== */}
      {activeTab === "avatar" && (
        <div className="space-y-4">
          <img
            src={avatar || "/assets/profile.jpg"}
            alt="avatar"
            className="w-32 h-32 object-cover rounded-full mb-2"
          />
          <input type="file" onChange={handleAvatarChange} />
          <button
            onClick={handleUploadAvatar}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loadingAvatar}
          >
            {loadingAvatar ? "Uploading..." : "Upload Avatar"}
          </button>
        </div>
      )}

      {/* ===== Order History Tab ===== */}
      {activeTab === "orders" && (
        <div>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Order ID</th>
                    <th className="border px-3 py-2">Product</th>
                    <th className="border px-3 py-2">Start Date</th>
                    <th className="border px-3 py-2">End Date</th>
                    <th className="border px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.order_id}>
                      <td className="border px-3 py-2">{o.order_id}</td>
                      <td className="border px-3 py-2">{o.title}</td>
                      <td className="border px-3 py-2">{o.start_date}</td>
                      <td className="border px-3 py-2">{o.end_date}</td>
                      <td className="border px-3 py-2">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};

export default ProfilePage;