import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { MdManageAccounts } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { CiMoneyBill, CiSettings } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { BsHandbag } from 'react-icons/bs';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { AiOutlineSetting } from 'react-icons/ai';

const AdminSideBar = ({ active }) => {
    return (
        <div className="w-full h-[90vh] bg-[#232f3e] shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
            {/* Dashboard */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin/dashboard" className="w-full flex items-center">
                    <RxDashboard size={30} color={active == 1 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active == 1 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Dashboard
                    </h5>
                </Link>
            </div>

            {/* Orders */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin-orders" className="w-full flex items-center">
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

            {/* Seller Management */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin-sellers" className="w-full flex items-center">
                    <MdManageAccounts size={30} color={active === 3 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 3 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Seller Management
                    </h5>
                </Link>
            </div>

            {/* Users */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin-users" className="w-full flex items-center">
                    <FaUser size={30} color={active === 4 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 4 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Users
                    </h5>
                </Link>
            </div>

            {/* Products */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin-products" className="w-full flex items-center">
                    <BsHandbag size={30} color={active === 5 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 5 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Products
                    </h5>
                </Link>
            </div>

            {/* Events */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin-events" className="w-full flex items-center">
                    <MdOutlineLocalOffer size={30} color={active === 6 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 6 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Events
                    </h5>
                </Link>
            </div>

            {/* Withdrawal Requests */}
            <div className="w-full flex items-center p-4">
                <Link to="/admin-withdraw-request" className="w-full flex items-center">
                    <CiMoneyBill size={30} color={active === 7 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 7 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Withdrawal Requests
                    </h5>
                </Link>
            </div>

            {/* Edit Information */}
            <div className="w-full flex items-center p-4">
                <Link to="/profile" className="w-full flex items-center">
                    <AiOutlineSetting size={30} color={active === 8 ? '#febd69' : '#fff'} />
                    <h5
                        className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                            active === 8 ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                        }`}
                    >
                        Edit Information
                    </h5>
                </Link>
            </div>
        </div>
    );
};

export default AdminSideBar;
