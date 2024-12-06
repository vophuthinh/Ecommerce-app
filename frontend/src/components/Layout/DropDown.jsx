import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DropDown = ({ categoriesData }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All Products'); // Mặc định chọn "All Products"

    const submitHandle = (category) => {
        setSelectedCategory(category.title); // Cập nhật danh mục đã chọn
        navigate(`/products?category=${encodeURIComponent(category.title)}`);
    };

    const submitAllProduct = () => {
        setSelectedCategory('All Products'); // Cập nhật danh mục đã chọn
        navigate(`/products`);
    };

    return (
        <div className="w-full bg-[#232f3e] shadow-lg rounded-lg p-6 border border-[#3b4149]">
            <h2 className="text-2xl font-semibold text-[#f5f5f7] mb-6">Product Categories</h2>
            <div className="space-y-4">
                {/* Tất cả sản phẩm */}
                <div
                    className={`flex items-center cursor-pointer p-4 rounded-lg ${
                        selectedCategory === 'All Products'
                            ? 'bg-gradient-to-r from-[#febd69] to-[#bf4800] text-[#1c1c1b] shadow-xl scale-105'
                            : 'bg-[#3b4149] text-[#f5f5f7] hover:bg-[#1c1c1b] hover:border-[#febd69]'
                    } transition transform duration-300`}
                    onClick={submitAllProduct}
                >
                    <h3 className="text-xl font-semibold">All Products</h3>
                </div>
                {/* Danh mục sản phẩm */}
                {categoriesData &&
                    categoriesData.map((category, index) => (
                        <div
                            key={index}
                            className={`flex items-center cursor-pointer p-4 rounded-lg ${
                                selectedCategory === category.title
                                    ? 'bg-gradient-to-r from-[#febd69] to-[#bf4800] text-[#1c1c1b] shadow-xl scale-105'
                                    : 'bg-[#3b4149] text-[#f5f5f7] hover:bg-[#1c1c1b] hover:border-[#febd69]'
                            } transition transform duration-300`}
                            onClick={() => submitHandle(category)}
                        >
                            <img
                                src={category.image_Url}
                                alt={category.title}
                                className="w-14 h-14 object-cover rounded-lg mr-4 border border-[#131921]"
                            />
                            <h3 className="text-lg font-medium">{category.title}</h3>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default DropDown;
