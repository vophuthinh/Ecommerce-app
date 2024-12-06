import React from 'react';
import { backend_url } from '../../server';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addTocart } from '../../redux/actions/cart';
import { toast } from 'react-toastify';
import currency from 'currency-formatter';
import CountDown from './CountDown';

const EventCard = ({ active, data }) => {
    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addToCartHandler = (data) => {
        const isItemExists = cart && cart.find((i) => i.id == data.id);
        if (isItemExists) {
            toast.error('Item already in cart!');
        } else {
            if (data.stock < 1) {
                toast.error('Product stock limited!');
            } else {
                const cartData = { ...data, qty: 1 };
                dispatch(addTocart(cartData));
                toast.success('Item added to cart successfully!');
            }
        }
    };

    return (
        <div
            className={`w-full bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition duration-300 ${
                active ? 'unset' : 'mb-10'
            } lg:flex p-6 text-gray-800`}
        >
            {/* Hình ảnh */}
            <div className="w-full lg:w-[40%] flex justify-center items-center">
                <img
                    src={`${backend_url}${data.images[0]}`}
                    alt={data.name}
                    className="rounded-lg w-full max-h-64 object-contain"
                />
            </div>
            {/* Thông tin sản phẩm */}
            <div className="w-full lg:w-[60%] flex flex-col justify-center mt-4 lg:mt-0 lg:ml-6">
                {/* Tên sản phẩm */}
                <h2 className="text-2xl font-semibold text-gray-900">{data.name}</h2>
                {/* Mô tả sản phẩm */}
                <p className="text-gray-600 mt-3 text-sm">{data.description}</p>
                {/* Giá và số lượng đã bán */}
                <div className="flex items-center justify-between py-3 mt-3">
                    <div className="flex items-center">
                        <h5 className="text-gray-400 line-through text-lg mr-2">
                            {`${currency.format(data.originalPrice, { code: 'VND' })}`}
                        </h5>
                        <h5 className="text-red-500 font-bold text-xl">
                            {`${currency.format(data.discountPrice, { code: 'VND' })}`}
                        </h5>
                    </div>
                    <span className="text-gray-500 text-sm">{data.sold_out} Sold</span>
                </div>
                {/* Đồng hồ đếm ngược */}
                <CountDown data={data} />
                {/* Nút hành động */}
                <div className="flex items-center space-x-4 mt-6">
                    <Link to={`/product/${data.id}?isEvent=true`}>
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
                            See Details
                        </button>
                    </Link>
                    <button
                        className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition"
                        onClick={() => addToCartHandler(data)}
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
