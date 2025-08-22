import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { category_id: 1, name: "ของเล่นเด็ก" },
  { category_id: 2, name: "เสื้อผ้าเด็ก" },
  { category_id: 3, name: "อุปกรณ์ให้นม/อาหาร" },
  { category_id: 4, name: "เปล/เตียงเด็ก" },
  { category_id: 5, name: "รถเข็น / คาร์ซีท" },
  { category_id: 6, name: "สุขอนามัย / การอาบน้ำ" },
  { category_id: 7, name: "หนังสือสำหรับเด็ก" },
  { category_id: 8, name: "อุปกรณ์เสริมพัฒนาการ" },
  { category_id: 9, name: "เฟอร์นิเจอร์เด็ก" },
];

const ageGroups = [
  { age_group_id: 2, name: "แรกเกิด - 3 เดือน" },
  { age_group_id: 3, name: "3 - 6 เดือน" },
  { age_group_id: 4, name: "6 - 12 เดือน" },
  { age_group_id: 5, name: "1 - 2 ขวบ" },
  { age_group_id: 6, name: "2 - 3 ขวบ" },
  { age_group_id: 7, name: "3 - 5 ขวบ" },
  { age_group_id: 8, name: "5 ขวบขึ้นไป" },
];

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const category = categories.find(c => c.category_id === product.category_id)?.name || "ไม่ระบุหมวดหมู่";
  const ageGroup = ageGroups.find(a => a.age_group_id === product.age_group_id)?.name || "ไม่ระบุช่วงอายุ";

  return (
    <div
      onClick={() => navigate(`/products/${product.product_id}`)}
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full shadow-สเ"
    >
      <div className="group cursor-pointer flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.image}
          alt={product.title}
        />
      </div>
      <div className="text-gray-500/60 text-sm">
        <p className="text-indigo-500">{category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">{product.title}</p>
        <p className="text-gray-500 text-xs">{ageGroup}</p>

        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-indigo-500">
            <span className="text-gray-500/60 md:text-sm text-xs">
              ${product.price}/mount
            </span>
          </p>
                <button 
                  className="bg-[#FAAB78] w-20 mt-4 rounded-md p-2 border-2 border-[#E8F3D6] text-[#E8F3D6] 
                  hover:bg-[#E8F3D6] hover:text-[#FAAB78]  transition-all ease-in-out cursor-pointer"
                >
                 Details
                </button>             
             


          <div className="text-indigo-500 flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:underline ml-4"
                  title="Edit Product"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:underline ml-2"
                  title="Delete Product"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
