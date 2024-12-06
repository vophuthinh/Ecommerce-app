import React from 'react';
import { AiOutlineLogin, AiOutlineMessage } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from 'react-icons/md';
import { TbAddressBook } from 'react-icons/tb';
import { RxPerson } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ProfileSidebar = ({ setActive, active }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const logoutHandler = () => {
        axios
            .get(`${server}/user/logout`, { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message);
                window.location.reload(true);
                navigate('/login');
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    const menuItems = [
        { id: 1, icon: <RxPerson size={20} />, label: 'Profile' },
        { id: 2, icon: <HiOutlineShoppingBag size={20} />, label: 'Orders' },
        { id: 3, icon: <HiOutlineReceiptRefund size={20} />, label: 'Refund Requests' },
        { id: 4, icon: <AiOutlineMessage size={20} />, label: 'Messages', onClick: () => navigate('/inbox') },
        { id: 5, icon: <MdOutlineTrackChanges size={20} />, label: 'Track Order' },
        { id: 6, icon: <RiLockPasswordLine size={20} />, label: 'Change Password' },
        { id: 7, icon: <TbAddressBook size={20} />, label: 'Addresses' },
        { id: 8, icon: <MdOutlineAdminPanelSettings size={20} />, label: 'Manage', isAdmin: true, link: '/admin/dashboard' },
        { id: 9, icon: <AiOutlineLogin size={20} />, label: 'Logout', onClick: logoutHandler },
    ];

    return (
        <div className="w-full bg-[#232f3e] shadow-sm rounded-[10px] p-4 pt-8">
            {menuItems.map(({ id, icon, label, isAdmin, link, onClick }) => {
                if (isAdmin && (!user || user?.role !== 'Admin')) return null;

                const handleClick = () => {
                    if (onClick) onClick();
                    else setActive(id);
                };

                return (
                    <div
                        key={id}
                        className="flex items-center cursor-pointer w-full mb-8"
                        onClick={handleClick}
                    >
                        {link ? (
                            <Link to={link} className="flex items-center w-full">
                                {React.cloneElement(icon, { color: active === id ? '#febd69' : '#fff' })}
                                <span
                                    className={`pl-3 800px:block hidden ${
                                        active === id ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                                    }`}
                                >
                                    {label}
                                </span>
                            </Link>
                        ) : (
                            <>
                                {React.cloneElement(icon, { color: active === id ? '#febd69' : '#fff' })}
                                <span
                                    className={`pl-3 800px:block hidden ${
                                        active === id ? 'text-[#febd69] font-bold' : 'text-[#fff]'
                                    }`}
                                >
                                    {label}
                                </span>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProfileSidebar;
