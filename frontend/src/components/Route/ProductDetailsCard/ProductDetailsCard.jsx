import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addTocart } from '../../../redux/actions/cart';
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';
import currency from 'currency-formatter';
import { backend_url } from '../../../server';

const ProductDetailsCard = ({ setOpen, data }) => {
    const { cart } = useSelector((state) => state.cart);
    const { wishlist } = useSelector((state) => state.wishlist);
    const { products } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);

    useEffect(() => {
        setClick(wishlist.some((item) => item.id == data?.id));
    }, [wishlist, data]);

    const decrementCount = () => count > 1 && setCount(count - 1);
    const incrementCount = () => setCount(count + 1);

    const toggleWishlist = () => {
        setClick(!click);
        click ? dispatch(removeFromWishlist(data)) : dispatch(addToWishlist(data));
    };

    const totalReviewsLength = products?.reduce((acc, product) => acc + product?.reviews?.length, 0) || 0;
    const totalRatings =
        products?.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0) ||
        0;
    const averageRating = (totalRatings / totalReviewsLength || 0).toFixed(2);
    const addToCartHandler = () => {
        if (cart.some((item) => item.id == data.id)) {
            toast.error('The product is already in the cart!');
        } else if (data.stock < 1) {
            toast.error('The product is out of stock!');
        } else {
            dispatch(addTocart({ ...data, qty: count }));
            toast.success('The product has been added to the cart!');
        }
    };

    return (
        <div className="bg-gray-100">
            {data && (
                <div className="fixed w-full h-screen top-0 left-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
                    {/* Modal Container */}
                    <div className="w-[90%] 800px:w-[50%] h-auto bg-white rounded-lg shadow-lg p-4 relative">
                        {/* Close Button */}
                        <RxCross1
                            size={30}
                            className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-800"
                            onClick={() => setOpen(false)}
                        />

                        <div className="flex flex-col items-center 800px:flex-row">
                            {/* Left Section */}
                            <div className="w-full 800px:w-[40%] flex justify-center items-center bg-gray-50 rounded-lg p-4">
                                <img
                                    src={`${backend_url}${data.images?.[0]}`}
                                    alt="Product"
                                    className="rounded-lg shadow-lg w-full max-h-60 object-contain"
                                />
                            </div>

                            {/* Right Section */}
                            <div className="w-full 800px:w-[60%] space-y-4 mt-4 800px:mt-0 px-4">
                                {/* Product Name */}
                                <h1 className="text-2xl font-semibold text-gray-800">{data.name}</h1>

                                {/* Price Section */}
                                <div className="flex items-center space-x-4 text-xl">
                                    <span className="text-orange-600 font-bold">
                                        {currency.format(data.discountPrice, { code: 'VND' })}
                                    </span>
                                    {data.originalPrice && (
                                        <span className="line-through text-gray-400">
                                            {currency.format(data.originalPrice, { code: 'VND' })}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {data.description.length > 200 ? (
                                        <>
                                            {data.description.slice(0, 200)}...
                                            <Link to={`/product/${data.id}`}>
                                                <span className="text-blue-500 ml-1 cursor-pointer">
                                                    Click to see more
                                                </span>
                                            </Link>
                                        </>
                                    ) : (
                                        data.description
                                    )}
                                </p>

                                {/* Quantity Selector */}
                                <div className="flex items-center">
                                    <button
                                        onClick={decrementCount}
                                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-l-lg flex items-center justify-center text-lg hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <div className="w-10 h-8 border border-gray-300 flex items-center justify-center text-md">
                                        {count}
                                    </div>
                                    <button
                                        onClick={incrementCount}
                                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-r-lg flex items-center justify-center text-lg hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4">
                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={addToCartHandler}
                                        className="text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 flex items-center gap-2"
                                        style={{ backgroundColor: '#131921' }}
                                    >
                                        Add to cart <AiOutlineShoppingCart className="ml-2" />
                                    </button>

                                    {/* Wishlist Button */}
                                    <button onClick={toggleWishlist} className="text-2xl">
                                        {click ? (
                                            <AiFillHeart className="text-red-500 transition" />
                                        ) : (
                                            <AiOutlineHeart className="text-gray-400 hover:text-red-500 transition" />
                                        )}
                                    </button>
                                </div>

                                {/* Shop Info */}
                                <div className="flex items-center space-x-4 mt-4">
                                    <img
                                        src={`${backend_url}${data.shop.avatar}`}
                                        alt="Shop Avatar"
                                        className="w-12 h-12 rounded-full border border-gray-300"
                                    />
                                    <div>
                                        <Link to={`/shop/preview/${data.shop.id}`}>
                                            <h3 className="text-lg font-semibold text-blue-600">{data.shop.name}</h3>
                                        </Link>
                                        <p className="text-gray-500 text-sm">({averageRating}/5 ⭐) Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsCard;
