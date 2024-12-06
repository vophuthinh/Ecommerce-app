import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getAllProductsShop } from '../../redux/actions/product';
import styles from '../../styles/styles';
import ProductCard from '../Route/ProductCard/ProductCard';
import { backend_url } from '../../server';
import Ratings from '../Products/Ratings';
import { getAllEventsShop } from '../../redux/actions/event';

import Lottie from 'react-lottie';
import animationData from '../../Assests/animations/searchNotFound.json';
import animationData2 from '../../Assests/animations/notHaveEvent.json';

const ShopProfileData = ({ isOwner }) => {
    const { products } = useSelector((state) => state.products);
    const { events } = useSelector((state) => state.events);
    const { id } = useParams();
    const dispatch = useDispatch();

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const notHaveEvent = {
        loop: false,
        autoplay: true,
        animationData: animationData2,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        dispatch(getAllEventsShop(id));
    }, [dispatch]);

    const [active, setActive] = useState(1);

    const allReviews = products && products.map((product) => product.reviews || []).flat();
    console.log(products, 'allReviewsallReviews');
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between bg-[#232f3e] p-3 rounded-xl">
                <div className="w-full flex">
                    <div className="flex items-center" onClick={() => setActive(1)}>
                        <h5
                            className={`font-[600] text-[20px] ${
                                active === 1 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                            } cursor-pointer pr-[20px]`}
                        >
                            Products
                        </h5>
                    </div>
                    <div className="flex items-center" onClick={() => setActive(2)}>
                        <h5
                            className={`font-[600] text-[20px] ${
                                active === 2 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                            } cursor-pointer pr-[20px]`}
                        >
                            Store Events
                        </h5>
                    </div>

                    <div className="flex items-center" onClick={() => setActive(3)}>
                        <h5
                            className={`font-[600] text-[20px] ${
                                active === 3 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                            } cursor-pointer pr-[20px]`}
                        >
                            Store Reviews
                        </h5>
                    </div>
                </div>
                <div>
                    {isOwner && (
                        <div>
                            <Link to="/dashboard">
                                <div
                                    className={`${styles.button} !rounded-[8px] h-[42px] text-[#fff] hover:!bg-[#febd69] hover:text-[#000] transition-all duration-300`}
                                >
                                    <span>Home</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <br />
            {active === 1 && (
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                    {products && products.map((i, index) => <ProductCard data={i} key={index} isShop={true} />)}
                </div>
            )}

            {active === 2 && (
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                        {events &&
                            events.map((i, index) => <ProductCard data={i} key={index} isShop={true} isEvent={true} />)}
                    </div>
                    {events && events.length === 0 && (
                        <div>
                            <Lottie options={notHaveEvent} width={300} height={300} />
                            <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
                                No events are currently happening
                            </h5>
                            <br />
                            <br />
                        </div>
                    )}
                </div>
            )}

            {active === 3 && (
                <div className="w-full bg-[#ffffff] p-6 rounded-lg shadow-md">
                    {allReviews && allReviews.length > 0 ? (
                        allReviews.map((item, index) => {
                            console.log(item, 'itemitem');
                            return (
                                <div
                                    key={index}
                                    className="flex my-4 p-4 bg-[#f5f5f5] rounded-lg shadow-sm hover:shadow-md transition-all"
                                >
                                    {/* Avatar */}
                                    <img
                                        src={`${backend_url}/${item.user.avatar}`}
                                        className="w-[60px] h-[60px] rounded-full object-cover border-2 border-[#febd69]"
                                        alt="User Avatar"
                                    />

                                    {/* Nội dung review */}
                                    <div className="pl-4 flex-1">
                                        {/* Header: Tên user và đánh giá sao */}
                                        <div className="flex items-center justify-between">
                                            <h1 className="font-semibold text-[18px] text-[#232f3e]">
                                                {item.user.name}
                                            </h1>
                                            <Ratings rating={item.rating} />
                                        </div>

                                        {/* Comment */}
                                        <p className="text-sm text-[#3b4149] mt-2">{item?.comment}</p>

                                        {/* Cảm xúc chính */}
                                        {item.sentiment && (
                                            <div className="mt-2 flex items-center space-x-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        item.sentiment.label === 'POS'
                                                            ? 'bg-green-100 text-green-700'
                                                            : item.sentiment.label === 'NEG'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {item.sentiment.label === 'POS'
                                                        ? 'Tích cực'
                                                        : item.sentiment.label === 'NEG'
                                                        ? 'Tiêu cực'
                                                        : 'Trung lập'}
                                                </span>
                                                <span className="text-xs text-[#777777]">
                                                    ({(item.sentiment.score * 100).toFixed(2)}%)
                                                </span>
                                            </div>
                                        )}

                                        {/* Thời gian */}
                                        <p className="text-xs text-[#777777] mt-1 italic">{item?.date}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 bg-[#f5f5f5] p-8 rounded-lg">
                            <Lottie options={defaultOptions} width={250} height={250} />
                            <h5 className="text-center text-xl font-medium text-[#bf4800]">
                                No reviews for this store yet
                            </h5>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopProfileData;
