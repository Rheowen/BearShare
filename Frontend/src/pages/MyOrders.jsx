import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const MyOrders = () => {
  const { user, userOrders, fetchUserOrders } = useAppContext();

  useEffect(() => {
    if (user) fetchUserOrders();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {userOrders.length === 0 ? (
        <p>ยังไม่มีคำสั่งเช่า</p>
      ) : (
        <ul className="space-y-4">
          {userOrders.map((order) => (
            <li key={order.order_id} className="border p-4 rounded shadow-sm">
              <p><strong>สินค้า:</strong> {order.title}</p>
              <p><strong>เริ่มเช่า:</strong> {order.start_date}</p>
              <p><strong>คืนสินค้า:</strong> {order.end_date}</p>
              <p><strong>สถานะ:</strong> {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
