import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { backend_url } from '../../server';
import Cart from '../cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import { TbAdjustmentsHorizontal, TbArrowBarLeft } from 'react-icons/tb';

const Header = ({ activeHeading }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { isSeller } = useSelector((state) => state.seller);
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const { allProducts } = useSelector((state) => state.products);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState(null);
    const [active, setActive] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openWishlist, setOpenWishlist] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filteredProducts =
            allProducts && allProducts.filter((product) => product.name.toLowerCase().includes(term.toLowerCase()));
        setSearchData(filteredProducts);
    };

    window.addEventListener('scroll', () => {
        if (window.scrollY > 70) {
            setActive(true);
        } else {
            setActive(false);
        }
    });

    return (
        <>
            <div className={`bg-gradient-to-r from-[#131921] to-[#131921] w-full ${styles.section} px-4 `}>
                <div className="hidden 800px:h-[60px] 800px:flex items-center justify-between w-full px-6 py-2">
                    <div className="pl-3 flex items-center">
                        <Link to="/">
                            <h1 className="text-[33px] text-white hover:scale-105 transition-transform duration-300">
                                ECommerce
                            </h1>
                        </Link>
                    </div>
                    {/* search box */}
                    <div className="w-[50%] relative mx-4">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="h-[40px] w-full px-6 pl-4 pr-12 bg-white border border-gray-300 rounded-full shadow-lg focus:outline-none focus:border-[#f08d49] focus:ring-2 focus:ring-[#f08d49] transition duration-300 ease-in-out"
                        />
                        <AiOutlineSearch
                            size={24}
                            className="absolute right-3 top-2.5 text-[#232f3e] cursor-pointer hover:text-[#f8a845] transition-all duration-300"
                        />
                        {searchData && searchData.length > 0 && (
                            <div className="absolute w-full bg-white rounded-lg shadow-lg mt-2 z-10 max-h-[30vh] overflow-y-auto transition-opacity duration-300 ease-in-out">
                                <p className="px-4 py-2 text-sm text-gray-600">
                                    Showing results for "<span className="font-semibold">{searchTerm}</span>"
                                </p>
                                {searchData.map((item, index) => (
                                    <Link to={`/product/${item.id}`} key={index}>
                                        <div className="flex items-center px-4 py-2 hover:bg-gray-100 transition-all duration-200">
                                            <img
                                                src={`${backend_url}${item.images[0]}`}
                                                alt={item.name}
                                                className="w-[40px] h-[40px] mr-3 rounded-md object-cover shadow-sm"
                                            />
                                            <h1 className="text-[15px] font-medium text-gray-800">{item.name}</h1>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center pr-4 space-x-3">
                        {!isSeller && (
                            <span className="font-medium mt-1 text-white  px-4 py-2 ">Login to the store</span>
                        )}
                        <div className={`${styles.button}`}>
                            <Link to={isSeller ? '/dashboard' : '/shop-login'}>
                                <h1
                                    className="text-white flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#232f3e] to-[#232f3e] hover:from-[#febd69] hover:to-[#febd69] hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:text-[#232f3e]"
                                    style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                                >
                                    {isSeller ? 'Manage' : 'Login'} <IoIosArrowForward className="ml-1" />
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`${
                    active
                        ? 'shadow-sm fixed top-0 left-0 z-10 transition-all duration-500'
                        : 'transition-all duration-500'
                } hidden 800px:flex items-center justify-between w-full bg-[#232f3e] h-[70px]`}
            >
                <div
                    className={`bg-[#232f3e] w-full ${styles.section} relative flex justify-between items-center px-4`}
                >
                    <div className="flex items-center justify-center px-6 space-x-6">
                        <Navbar active={activeHeading} />
                    </div>
                    <div className="flex items-center space-x-4 mr-6">
                        <div className="relative cursor-pointer" onClick={() => setOpenWishlist(true)}>
                            <AiOutlineHeart size={35} color="#FF0000" />
                            <span className="absolute right-0 top-0 rounded-full bg-[#ffffff] w-4 h-4 text-black font-mono text-[12px] leading-tight text-center">
                                {wishlist && wishlist.length}
                            </span>
                        </div>
                        <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
                            <AiOutlineShoppingCart size={35} color="#febd69" />
                            <span className="absolute right-0 top-0 rounded-full bg-[#ffffff] w-4 h-4 text-black font-mono text-[12px] leading-tight text-center">
                                {cart && cart.length}
                            </span>
                        </div>
                        <div className="relative cursor-pointer">
                            {isAuthenticated ? (
                                <Link to="/profile">
                                    <img
                                        src={`${backend_url}${user?.avatar}`}
                                        className="w-[50px] h-[50px] rounded-full border-[3px] border-[#febd69]"
                                        alt=""
                                    />
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <CgProfile size={35} color="#de650a" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Header */}
            <div className="w-full h-[60px] bg-[#232f3e] flex items-center justify-between px-4 800px:hidden">
                <button onClick={() => setOpen(true)} aria-label="Open Menu">
                    <TbAdjustmentsHorizontal size={30} className="text-white" />
                </button>
                <Link to="/">
                    <h1 className="text-[25px] text-white">ECommerce</h1>
                </Link>
                <button onClick={() => setOpenCart(true)} aria-label="View Cart" className="relative">
                    <AiOutlineShoppingCart size={25} className="text-white" />
                    {cart?.length > 0 && (
                        <span className="absolute top-0 right-0 bg-[#db3f59] w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
                    <div className="fixed left-0 top-0 bg-white w-3/4 h-full p-4 overflow-y-auto">
                        <button onClick={() => setOpen(false)} className="mb-4">
                            <TbArrowBarLeft size={25} />
                        </button>
                        <Navbar active={activeHeading} />
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-[40px] w-full px-6 pl-4 pr-12 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:border-[#f08d49] focus:ring-2 focus:ring-[#f08d49] transition-all duration-300 ease-in-out"
                            />

                            {searchData && (
                                <div className="mt-2 bg-white rounded-lg shadow-md overflow-hidden">
                                    {searchData.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/product/${item.id}`}
                                            className="block p-2 hover:bg-gray-100"
                                        >
                                            <img
                                                src={item.image_Url[0]?.url}
                                                alt={item.name}
                                                className="inline-block w-8 h-8 mr-2"
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Cart and Wishlist */}
            {openCart && <Cart setOpenCart={setOpenCart} />}
            {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
        </>
    );
};

export default Header;
