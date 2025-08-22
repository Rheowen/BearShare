import React from "react";

function ProductFilter({
  selectedCategories,
  setSelectedCategories,
  selectedAgeGroups,
  setSelectedAgeGroups,
}) {
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

  const handleCategoryChange = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleAgeGroupChange = (id) => {
    if (selectedAgeGroups.includes(id)) {
      setSelectedAgeGroups(selectedAgeGroups.filter((a) => a !== id));
    } else {
      setSelectedAgeGroups([...selectedAgeGroups, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">หมวดหมู่สินค้า</h3>
        {categories.map((cat) => (
          <label key={cat.category_id} className="block">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.category_id)}
              onChange={() => handleCategoryChange(cat.category_id)}
              className="peer hidden"
                 />
              <div className="cursor-pointer px-3 py-1 rounded-md border border-gray-300 
                            bg-gray-100 text-gray-700 
                            peer-checked:bg-[#FAAB78] peer-checked:text-white
                            transition-colors duration-200">
            {cat.name}
             </div>
          </label>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-2">ช่วงอายุ</h3>
        {ageGroups.map((age) => (
          <label key={age.age_group_id} className="block">
            <input
              type="checkbox"
              checked={selectedAgeGroups.includes(age.age_group_id)}
              onChange={() => handleAgeGroupChange(age.age_group_id)}
              className="peer hidden" // ซ่อน checkbox 
            />
            <div className="cursor-pointer px-3 py-1 rounded-md border border-gray-300 
                            bg-gray-100 text-gray-700 
                            peer-checked:bg-[#FAAB78] peer-checked:text-white
                            transition-colors duration-200">
              {age.name}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
