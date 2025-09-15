// src/pages/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const TABS = [
  { key: 'pending', label: '📌 รอดำเนินการ' },
  { key: 'active', label: '✅ กำลังเช่า' },
  { key: 'completed', label: '📦 เสร็จสิ้น / คืนแล้ว' },
  { key: 'rejected', label: '❌ ไม่อนุมัติ' },
];

const MyOrders = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const requestReturn = async (orderId) => {
    if (!confirm('ต้องการขอคืนสินค้าหรือไม่?')) return;
    setActionLoading(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/return`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Request failed');
      alert('ขอคืนเรียบร้อยแล้ว');
      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Request return failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return <p>กรุณาเข้าสู่ระบบ</p>;
  if (loading) return <p>Loading orders...</p>;

  // ฟังก์ชันแยกหมวดหมู่
  const filterOrders = (tab) => {
    switch (tab) {
      case 'pending':
        return orders.filter((o) => o.status === 'pending');
      case 'active':
        return orders.filter(
          (o) =>
            o.status === 'approved' &&
            (o.return_status === 'not_returned' || o.return_status === 'requested')
        );
      case 'completed':
        return orders.filter(
          (o) =>
            o.return_status === 'returned' || o.return_status === 'completed'
        );
      case 'rejected':
        return orders.filter((o) => o.status === 'rejected');
      default:
        return orders;
    }
  };

  const filtered = filterOrders(activeTab);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">ไม่มีคำสั่งเช่าในหมวดนี้</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order) => (
            <li
              key={order.order_id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p><strong>สินค้า:</strong> {order.title}</p>
                  <p><strong>เริ่มเช่า:</strong> {order.start_date}</p>
                  <p><strong>คืนสินค้า:</strong> {order.end_date}</p>
                  <p><strong>สถานะ:</strong> {order.return_status ?? order.status}</p>
                </div>
                <div>
                  {order.return_status === 'not_returned' && (
                    <button
                      disabled={actionLoading === order.order_id}
                      onClick={() => requestReturn(order.order_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      {actionLoading === order.order_id ? 'Requesting...' : 'Request Return'}
                    </button>
                  )}
                  {order.return_status === 'requested' && (
                    <span className="text-yellow-600">Requested</span>
                  )}
                  {order.return_status === 'returned' && (
                    <span className="text-green-600">Returned</span>
                  )}
                  {order.return_status === 'completed' && (
                    <span className="text-gray-600">Completed</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
