import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";


// ProductGallery Component 
const ProductGallery = ({ product }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(
    product.image || "https://i.pinimg.com/1200x/76/0d/58/760d586bb7d1a571a7843580be97f8ec.jpg"
  );

  const images = [
    product.image,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  return (
    <div className="flex -mt-11 justify-between bg-white p-8">
      <div className="w-1/2 ml-3 mt-8">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer transition 
                           ${selectedImage === img ? "ring-2 ring-indigo-500" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-90 object-cover border-2 border-[#FAAB78]  rounded"
            />
          </div>
        </div>
      </div>

     <div className="flex flex-col justify-start items-start ml-3 w-1/2 mt-10 ml-16">
      <h1 className="text-3xl font-bold mb-4  mt-4">{product.title}</h1>
      <p className="text-gray-700 mb-2">{product.category}</p>
      <p className="text-indigo-500 text-2xl font-semibold mb-4">${product.price}</p>
       <p className="text-indigo-500 text-2xl font-semibold mb-4">{product.rent_cost}</p>
      <p className="text-gray-600 mb-4">{product.description}</p>
           <button
          onClick={() => navigate(`/rent/${product.product_id}`)}
          className="bg-[#FAAB78] p-2 rounded text-white font-semibold hover:bg-[#F79657] transition"
        >
          ยืนยันเช่า
        </button>
    </div>
    </div>
  );
};

// ProductDetail Component
const ProductDetail = () => {
  const { productId } = useParams();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("โหลดข้อมูลสินค้าไม่สำเร็จ");
        const data = await res.json();
        setProduct(data.product || data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <p>กำลังโหลดข้อมูลสินค้า...</p>;
  if (!product) return <p>ไม่พบสินค้า</p>;

  return <ProductGallery product={product} />;
};

export default ProductDetail;
