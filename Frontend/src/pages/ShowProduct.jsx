import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products';
        const params = [];

        if (selectedCategories.length > 0) {
          params.push(`category_id=${selectedCategories.join(',')}`);
        }
        if (selectedAgeGroups.length > 0) {
          params.push(`age_group_id=${selectedAgeGroups.join(',')}`);
        }

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');

        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(productList);
      } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, selectedAgeGroups]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    
<div className="p-2 flex flex-col md:flex-row gap-3">
 
  <div className="md:w-1/4 h-fit bg-white p-2 rounded-md shadow-sm">
    <ProductFilter
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      selectedAgeGroups={selectedAgeGroups}
      setSelectedAgeGroups={setSelectedAgeGroups}
    />   
  </div>

  
  <div className="md:w-3/4 flex flex-col ml-3">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">สินค้า</h1>

    {products.length === 0 ? (
      <p className="text-gray-500">ไม่มีสินค้า</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.product_id || product.id}
            product={product}
          />
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default ShowProduct;
