import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../../static/data';
import styles from '../../styles/styles';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const Navbar = ({ active }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div>
            {/* Desktop Navbar */}
            <div className={`hidden 800px:${styles.noramlFlex}`}>
                {navItems &&
                    navItems.map((i, index) => (
                        <div className="flex" key={index}>
                            <Link
                                to={i.url}
                                className={`${
                                    active === index + 1
                                        ? 'text-[#febd69] font-normal'
                                        : 'text-white hover:text-[#febd69] transition-colors duration-300'
                                } pb-[30px] 800px:pb-0 px-6 cursor-pointer`}
                            >
                                {i.title}
                            </Link>
                        </div>
                    ))}
            </div>

            {/* Mobile Navbar */}
            <div className="flex 800px:hidden items-center justify-between px-4 py-2 bg-[#131921]">
                <h1 className="text-white text-lg">ECommerce</h1>
                <button className="text-white text-2xl focus:outline-none" onClick={handleToggleMenu}>
                    {mobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                </button>
            </div>

            {/* Mobile Menu Items */}
            <div
                className={`${
                    mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                } transition-all duration-500 overflow-hidden 800px:hidden bg-[#232f3e] text-white p-4`}
            >
                {navItems &&
                    navItems.map((i, index) => (
                        <Link
                            to={i.url}
                            key={index}
                            className={`${
                                active === index + 1
                                    ? 'text-[#febd69] font-normal'
                                    : 'text-white hover:text-[#febd69] transition-colors duration-300'
                            } block cursor-pointer py-3 border-b border-gray-700 last:border-b-0`}
                            onClick={handleToggleMenu}
                        >
                            {i.title}
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default Navbar;
