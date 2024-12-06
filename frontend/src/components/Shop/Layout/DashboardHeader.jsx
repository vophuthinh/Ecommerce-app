import React from 'react';
import { AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { backend_url } from '../../../server';

const DashboardHeader = () => {
    const { seller } = useSelector((state) => state.seller);
    return (
        <div className="w-full h-[80px] bg-[#232f3e] shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
            <div>
                <Link to="/">
                    <h1 className="text-[25px] text-white ">ECommerce</h1>
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <Link to="/dashboard-coupouns" className="800px:block hidden">
                        <AiOutlineGift color="#fff" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to="/dashboard-events" className="800px:block hidden">
                        <MdOutlineLocalOffer color="#fff" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to="/dashboard-products" className="800px:block hidden">
                        <FiShoppingBag color="#fff" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden">
                        <FiPackage color="#fff" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to="/dashboard-messages" className="800px:block hidden">
                        <BiMessageSquareDetail color="#fff" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to={`/shop/${seller.id}`}>
                        <img
                            src={`${backend_url}${seller.avatar}`}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover border-[3px] border-[#febd69]"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;