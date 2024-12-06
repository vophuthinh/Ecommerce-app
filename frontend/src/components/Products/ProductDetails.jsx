import React, { useEffect, useState } from 'react';
import currency from 'currency-formatter';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProductsShop } from '../../redux/actions/product';
import { backend_url, server } from '../../server';
import { addToWishlist, removeFromWishlist } from '../../redux/actions/wishlist';
import { addTocart } from '../../redux/actions/cart';
import { toast } from 'react-toastify';
import Ratings from './Ratings';
import axios from 'axios';

const ProductDetails = ({ data }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { products } = useSelector((state) => state.products);
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(data, 'data?.shop 1');
    useEffect(() => {
        dispatch(getAllProductsShop(data?.shop.id));
        setClick(wishlist && wishlist.some((i) => i.id == data?.id));
    }, [data, wishlist]);

    const incrementCount = () => setCount(count + 1);
    const decrementCount = () => count > 1 && setCount(count - 1);

    const toggleWishlist = () => {
        setClick(!click);
        click ? dispatch(removeFromWishlist(data)) : dispatch(addToWishlist(data));
    };

    const addToCartHandler = () => {
        console.log(data, 'datadata');
        if (cart.some((i) => i.id === data.id)) {
            toast.error('The product is already in the cart!');
        } else if (data.stock < 1) {
            toast.error(' The product is out of stock!');
        } else {
            dispatch(addTocart({ ...data, qty: count }));
            toast.success('The product has been added to the cart!');
        }
    };
    const totalReviewsLength = products?.reduce((acc, product) => acc + (product.reviews?.length || 0), 0);
    const totalRatings = products?.reduce(
        (acc, product) => acc + (product.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) || 0),
        0,
    );
    const averageRating = (Number(totalRatings) / Number(totalReviewsLength) || 0).toFixed(2);

    const handleMessageSubmit = async () => {
        if (isAuthenticated) {
            try {
                const res = await axios.post(`${server}/conversation/create-new-conversation`, {
                    groupTitle: data.id + user.id,
                    userId: user.id,
                    sellerId: data.shop.id,
                });
                navigate(`/inbox?${res.data.conversation.id}`);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.error('Please login to send a message');
        }
    };

    // Modal toggle functions
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="bg-gray-50 py-10">
            {data && (
                <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <div className="lg:flex lg:space-x-8">
                        {/* Left Column: Image and Thumbnails */}
                        <div className="lg:w-1/2">
                            <div className="flex flex-col items-center">
                                <img
                                    src={`${backend_url}${
                                        Array.isArray(data.images) ? data.images[select] : data.images
                                    }`}
                                    alt="Product"
                                    className="w-3/4 rounded-lg shadow-lg cursor-pointer"
                                    onClick={openModal}
                                />

                                <div className="flex mt-4 space-x-2">
                                    {Array.isArray(data.images)
                                        ? data.images.map((img, index) => (
                                              <img
                                                  key={index}
                                                  src={`${backend_url}${img}`}
                                                  onClick={() => setSelect(index)}
                                                  alt=""
                                                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform duration-300 ${
                                                      select === index ? 'ring-2 ring-orange-500 scale-105' : ''
                                                  }`}
                                              />
                                          ))
                                        : // Nếu data.images không phải là mảng, chuyển nó thành mảng
                                          [data.images].map((img, index) => (
                                              <img
                                                  key={index}
                                                  src={`${backend_url}${img}`}
                                                  onClick={() => setSelect(index)}
                                                  alt=""
                                                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform duration-300 ${
                                                      select === index ? 'ring-2 ring-orange-500 scale-105' : ''
                                                  }`}
                                              />
                                          ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Product Details */}
                        <div className="lg:w-1/2 space-y-6">
                            <h1 className="text-3xl font-semibold text-gray-800">{data.name}</h1>
                            <p className="text-lg text-gray-600">
                                Tag: <span className="text-orange-600">#{data.tags}</span>
                            </p>
                            <p className="text-lg text-gray-600">
                                Category: <span className="text-red-600">{data.category}</span>
                            </p>
                            <p className="text-lg font-medium text-red-500">{data.sold_out} sold</p>

                            {/* Price Section */}
                            <div className="flex items-center space-x-4 text-2xl">
                                <span className="text-orange-600 font-bold">
                                    {currency.format(data.discountPrice, { code: 'VND' })}
                                </span>
                                {data.originalPrice && (
                                    <span className="line-through text-gray-400">
                                        {currency.format(data.originalPrice, { code: 'VND' })}
                                    </span>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center mt-4">
                                <button
                                    onClick={decrementCount}
                                    className="w-10 h-10 bg-gray-300 text-gray-700 rounded-l-lg flex items-center justify-center text-xl"
                                >
                                    -
                                </button>
                                <div className="w-12 h-10 border border-gray-300 flex items-center justify-center text-lg">
                                    {count}
                                </div>
                                <button
                                    onClick={incrementCount}
                                    className="w-10 h-10 bg-gray-300 text-gray-700 rounded-r-lg flex items-center justify-center text-xl"
                                >
                                    +
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center mt-6 space-x-4">
                                <button
                                    onClick={addToCartHandler}
                                    className="text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 flex items-center gap-2"
                                    style={{ backgroundColor: '#131921' }}
                                >
                                    Add to cart <AiOutlineShoppingCart />
                                </button>
                                <button onClick={toggleWishlist} className="text-3xl">
                                    {click ? (
                                        <AiFillHeart className="text-red-500" />
                                    ) : (
                                        <AiOutlineHeart className="text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {/* Shop and Messaging */}
                            <div className="flex items-center mt-8 space-x-4">
                                <Link to={`/shop/preview/${data.shop.id}`}>
                                    <img
                                        src={`${backend_url}${data.shop.avatar}`}
                                        alt="Shop Avatar"
                                        className="w-16 h-16 rounded-full border border-gray-200"
                                    />
                                </Link>
                                <div>
                                    <Link to={`/shop/preview/${data.shop.id}`}>
                                        <h3 className="text-xl font-semibold text-orange-600">{data.shop.name}</h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm">({averageRating}/5 ⭐) Reviews</p>
                                </div>
                                <button
                                    onClick={handleMessageSubmit}
                                    className="px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                                    style={{
                                        backgroundColor: '#febd69',
                                        color: '#232f3e',
                                        transition: 'background-color 0.3s ease, color 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#131921';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#febd69';
                                        e.target.style.color = '#232f3e';
                                    }}
                                >
                                    Send a message <AiOutlineMessage />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modal for Enlarged Image */}
                    {isModalOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                            onClick={closeModal}
                        >
                            <div className="relative">
                                <img
                                    src={`${backend_url}${
                                        Array.isArray(data.images) ? data.images[select] : data.images
                                    }`}
                                    alt="Enlarged Product"
                                    className="max-w-full max-h-full rounded-lg"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        closeModal();
                                    }}
                                    className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-90 transition ease-in-out duration-200 flex items-center justify-center"
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        fontSize: '16px',
                                        lineHeight: '1',
                                        color: 'white',
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Product Info Tabs */}
                    <ProductDetailsInfo
                        data={data}
                        products={products}
                        totalReviewsLength={totalReviewsLength}
                        averageRating={averageRating}
                    />
                </div>
            )}
        </div>
    );
};

const ProductDetailsInfo = ({ data, products, totalReviewsLength, averageRating }) => {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="flex justify-around border-b pb-3 mb-5 text-lg font-medium">
                {['Introduction', 'Reviews', 'Shop'].map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index + 1)}
                        className={`pb-2 ${
                            activeTab === index + 1 ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 1 && (
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{data.description}</p>
            )}
            {activeTab === 2 && (
                <div className="space-y-4">
                    {data?.reviews && data?.reviews?.length > 0 ? (
                        data.reviews.map((review, index) => (
                            <div key={index} className="flex space-x-4 bg-gray-100 p-4 rounded-lg shadow-md">
                                <img
                                    src={`${backend_url}${review.user.avatar}`}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full border"
                                />
                                <div>
                                    <h3 className="font-medium text-lg">{review.user.name}</h3>
                                    <Ratings rating={review.rating} />
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">The product has no reviews yet!</p>
                    )}
                </div>
            )}
            {activeTab === 3 && (
                <div className="lg:flex lg:space-x-8">
                    <div className="lg:w-1/2">
                        <Link to={`/shop/preview/${data.shop.id}`}>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={`${backend_url}${data.shop.avatar}`}
                                    alt="Shop Avatar"
                                    className="w-12 h-12 rounded-full border"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-600">{data.shop.name}</h3>
                                    <p className="text-gray-500">({averageRating}/5 ⭐) Reviews</p>
                                </div>
                            </div>
                        </Link>
                        <p className="mt-3 text-gray-700">{data.shop.description}</p>
                    </div>
                    <div className="lg:w-1/2 mt-4 lg:mt-0 space-y-2 text-right">
                        <p className="text-lg font-medium">
                            Joined:{' '}
                            <span className="font-normal">
                                {data.shop?.createdAt
                                    ? data.shop?.createdAt?.slice(0, 10)
                                    : data.shop?.created_at?.slice(0, 10)}
                            </span>
                        </p>
                        <p className="text-lg font-medium">
                            Number of products: <span className="font-normal">{products.length}</span>
                        </p>
                        <p className="text-lg font-medium">
                            Number of reviews: <span className="font-normal">{totalReviewsLength}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
