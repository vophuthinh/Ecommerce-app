import React, { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../redux/actions/product';
import { categoriesData } from '../../static/data';
import { toast } from 'react-toastify';

const CreateProduct = () => {
    const { seller } = useSelector((state) => state.seller);
    const { success, error } = useSelector((state) => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [originalPrice, setOriginalPrice] = useState();
    const [discountPrice, setDiscountPrice] = useState();
    const [stock, setStock] = useState();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (success) {
            toast.success('Product created successfully!');
            navigate('/dashboard');
            window.location.reload();
        }
    }, [dispatch, error, success]);

    const handleImageChange = (e) => {
        e.preventDefault();

        let files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = [];
        if (!name.trim()) errors.push('Product Name is required.');
        if (!description.trim()) errors.push('Description is required.');
        if (!category) errors.push('Category is required.');
        if (!discountPrice) errors.push('Discounted Price is required.');
        if (!stock) errors.push('Stock is required.');
        if (images.length === 0) errors.push('At least one image is required.');

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return;
        }

        const newForm = new FormData();
        images.forEach((image) => {
            newForm.append('images', image);
        });
        newForm.append('name', name);
        newForm.append('description', description);
        newForm.append('category', category);
        newForm.append('tags', tags);
        newForm.append('originalPrice', originalPrice);
        newForm.append('discountPrice', discountPrice);
        newForm.append('stock', stock);
        newForm.append('shopId', seller.id);
        dispatch(createProduct(newForm));
    };

    return (
        <div className="w-[90%] 800px:w-[50%] bg-white shadow-lg rounded-lg p-6 mx-auto my-8">
            <h5 className="text-[24px] font-semibold text-center text-gray-800 mb-6">Add Product</h5>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter product name..."
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter product description..."
                    ></textarea>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Select a category</option>
                        {categoriesData.map((category) => (
                            <option value={category.title} key={category.title}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter product tags..."
                    />
                </div>

                {/* Other Fields */}
                <div className="grid grid-cols-1 800px:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Original Price</label>
                        <input
                            type="number"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Original price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Discounted Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Discounted price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter product stock..."
                        />
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Images <span className="text-red-500">*</span>
                    </label>
                    <input type="file" multiple onChange={handleImageChange} className="mt-1" />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded-md shadow-md"
                                />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(idx)}
                                >
                                    <MdDelete size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r text-white font-semibold rounded-md from-[#232f3e] to-[#232f3e] hover:from-[#febd69] hover:to-[#febd69] hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:text-[#232f3e]"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
