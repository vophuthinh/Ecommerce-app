import React from 'react';
import { AiOutlineFolderAdd, AiOutlineGift } from 'react-icons/ai';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { VscNewFile } from 'react-icons/vsc';
import { CiMoneyBill, CiSettings } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { HiOutlineReceiptRefund } from 'react-icons/hi';

const DashboardSideBar = ({ active }) => {
    return (
        <div className="w-full h-screen bg-[#232f3e] shadow-sm sticky top-0 left-0 z-10">
            <div className="w-full flex items-center p-4">
                <Link to="/dashboard" className="w-full flex items-center">
                    <RxDashboard size={30} color={active === 1 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 1 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Dashboard
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-orders" className="w-full flex items-center">
                    <FiShoppingBag size={30} color={active === 2 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 2 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Orders
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-products" className="w-full flex items-center">
                    <FiPackage size={30} color={active === 3 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 3 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Products
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-create-product" className="w-full flex items-center">
                    <AiOutlineFolderAdd size={30} color={active === 4 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 4 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Add Product
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-events" className="w-full flex items-center">
                    <MdOutlineLocalOffer size={30} color={active === 5 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 5 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Promotions and Events
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-create-event" className="w-full flex items-center">
                    <VscNewFile size={30} color={active === 6 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 6 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Create Event
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-withdraw-money" className="w-full flex items-center">
                    <CiMoneyBill size={30} color={active === 7 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 7 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Withdrawals
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-messages" className="w-full flex items-center">
                    <BiMessageSquareDetail size={30} color={active === 8 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 8 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Messages
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-coupouns" className="w-full flex items-center">
                    <AiOutlineGift size={30} color={active === 9 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 9 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Discount Codes
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-refunds" className="w-full flex items-center">
                    <HiOutlineReceiptRefund size={30} color={active === 10 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 10 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Refunds
                    </h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/settings" className="w-full flex items-center">
                    <CiSettings size={30} color={active === 11 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 11 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Edit Information
                    </h5>
                </Link>
            </div>
        </div>
    );
};

export default DashboardSideBar;
