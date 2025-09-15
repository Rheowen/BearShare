import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const { product, form, coinCost, due_date } = location.state || {};

  if (!product) return <p className="text-center mt-10">ไม่มีข้อมูลการเช่า</p>;

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-md rounded-xl p-6 w-[500px]">
        <h2 className="text-center text-2xl font-bold mb-6">Success</h2>

        {/* ชื่อสินค้า */}
        <div className="mb-4">
          <span className="font-bold text-lg">{product.title}</span>
        </div>

        {/* ข้อมูลผู้เช่า */}
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>ชื่อ:</strong> {form.name}</p>
          <p><strong>เบอร์โทร:</strong> {form.phone}</p>
          <p><strong>ที่อยู่:</strong> {form.address}</p>
        </div>

        {/* Description */}
        <h3 className="text-xl mt-6 mb-2">Description</h3>
        <div className="border-t border-b py-2 flex justify-between text-sm">
          <span>{product.title}</span>
          <span>{form.rental_days} วัน</span>
          <span>{coinCost} Coins</span>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{coinCost} Coins</span>
          </div>
          <div className="flex justify-between">
            <span>Deposit</span>
            <span>5 Coins</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{coinCost} Coins</span>
          </div>
        </div>

        {/* Due Date */}
        <p className="mt-4 text-sm">
          <strong>Due Date:</strong> {due_date || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
