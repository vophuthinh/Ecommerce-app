import React from 'react';
import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineTwitter } from 'react-icons/ai';
import { BsLinkedin, BsGithub, BsYoutube, BsInstagram } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import newsletter from '../../Assests/PhotoType/newsletter.png';

const Footer = () => {
    return (
        <>
            {/* Newsletter section */}
            <footer className="bg-[#232f3e] py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="sm:w-2/5 flex items-center gap-4">
                            <img src={newsletter} alt="newsletter" className="w-12" />
                            <h2 className="text-white text-lg sm:text-xl font-semibold">Sign Up for Newsletter</h2>
                        </div>
                        <div className="sm:w-3/5 w-full">
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    className="w-full py-3 px-4 rounded-l-full focus:outline-none text-gray-700"
                                    placeholder="Your Email Address"
                                    aria-label="Your Email Address"
                                />
                                <button className="bg-gradient-to-r from-[#febd69] to-[#f2a04f] text-[#131921] font-semibold text-sm px-6 py-3 rounded-r-full hover:from-[#f2a04f] hover:to-[#febd69] transition-all duration-300 ease-in-out transform hover:scale-105">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Footer with contact and links */}
            <footer className="bg-[#232f3e] py-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
                    {/* Contact Us */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <address className="not-italic text-sm mb-4">
                            Address: 80 Dinh Bo Linh, Ward 26, Binh Thanh District, Ho Chi Minh City
                        </address>
                        <a href="tel:+84 123 456 789" className="block text-sm mb-1 hover:text-gray-300">
                            +84 123 456 789
                        </a>
                        <a href="mailto:vophuthinhcm@gmail.com" className="block text-sm mb-4 hover:text-gray-300">
                            vophuthinhcm@gmail.com
                        </a>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-white hover:text-gray-300">
                                <BsLinkedin className="text-lg" />
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <BsInstagram className="text-lg" />
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <BsGithub className="text-lg" />
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <BsYoutube className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Information links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Information</h4>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link to="/#" className="hover:text-gray-300">
                                Privacy Policy
                            </Link>
                            <Link to="/#" className="hover:text-gray-300">
                                Refund Policy
                            </Link>
                            <Link to="/#" className="hover:text-gray-300">
                                Shipping Policy
                            </Link>
                            <Link to="/#" className="hover:text-gray-300">
                                Terms & Conditions
                            </Link>
                            <Link className="hover:text-gray-300">Blogs</Link>
                        </div>
                    </div>

                    {/* Account links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Account</h4>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link className="hover:text-gray-300">About Us</Link>
                            <Link className="hover:text-gray-300">Faq</Link>
                            <Link className="hover:text-gray-300">Contact</Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <div className="flex flex-col space-y-2 text-sm">
                            <Link className="hover:text-gray-300">Laptops</Link>
                            <Link className="hover:text-gray-300">Headphones</Link>
                            <Link className="hover:text-gray-300">Tablets</Link>
                            <Link className="hover:text-gray-300">Watch</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Footer copyright */}
            <footer className="bg-[#232f3e] py-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-sm text-white">
                        &copy; {new Date().getFullYear()}; Powered by Christoper Vo
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;
