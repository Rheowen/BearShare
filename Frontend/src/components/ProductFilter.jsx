import React from 'react';

function ProductFilter({ selectedCategory, setSelectedCategory }) {
  // สมมติมี categories แบบ hardcode (หรือดึง API ก็ได้)
  const categories = [
    { category_id: '', name: '-- ทุกหมวดหมู่ --' },
    { category_id: 1, name: 'อิเล็กทรอนิกส์' },
    { category_id: 2, name: 'เฟอร์นิเจอร์' },
    // ...เติมตามต้องการ
  ];

  return (
    <select
      value={selectedCategory}
      onChange={e => setSelectedCategory(e.target.value)}
      className="border p-2 rounded mb-4"
    >
      {categories.map(cat => (
        <option key={cat.category_id} value={cat.category_id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}

export default ProductFilter;
