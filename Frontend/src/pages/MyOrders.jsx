import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const MyOrders = () => {
  const { user, userOrders, fetchUserOrders } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        await fetchUserOrders();
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดคำสั่งเช่าได้");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {userOrders.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีคำสั่งเช่า</p>
      ) : (
        <ul className="space-y-4">
          {userOrders.map((order) => (
            <li key={order.order_id} className="border p-4 rounded shadow-sm flex flex-col md:flex-row md:items-center gap-4">
              {order.image && (
                <img src={order.image} alt={order.title} className="w-24 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <p><strong>สินค้า:</strong> {order.title}</p>
                <p><strong>เริ่มเช่า:</strong> {new Date(order.start_date).toLocaleDateString()}</p>
                <p><strong>คืนสินค้า:</strong> {new Date(order.end_date).toLocaleDateString()}</p>
                <p><strong>สถานะ:</strong> <span className={`capitalize ${order.status === 'pending' ? 'text-yellow-500' : order.status === 'approved' ? 'text-green-500' : order.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}`}>{order.status}</span></p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
