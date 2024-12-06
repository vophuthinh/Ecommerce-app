import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="py-5 bg-gray-100">
            <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-[85px]">
                {/* Main Banner */}
                <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
                    <img src="/images/main-banner.jpg" alt="Main Banner" className="w-full h-full object-cover block" />
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
                        <h4 className="text-xl md:text-2xl font-semibold mb-2 text-[#bf4800]">
                            SUPERCHARGED FOR PROS.
                        </h4>
                        <h5 className="text-3xl md:text-4xl font-bold mb-4">iPad S13+ Pro.</h5>
                        <p className="text-lg md:text-xl mb-4 text-[#131921]">From $999.00 or $41.62/mo.</p>
                        <Link
                            to="/products"
                            className="text-white flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#232f3e] to-[#232f3e] hover:from-[#febd69] hover:to-[#febd69] hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            BUY NOW
                        </Link>
                    </div>
                </div>

                {/* Other Banners (Only visible on desktop) */}
                <div className="grid grid-cols-2 gap-6 w-full hidden md:grid">
                    {[
                        {
                            src: '/images/main-banner-1.jpg',
                            title: 'Best Sale',
                            description: 'From $999.00 <br /> or $41.62/mo.',
                        },
                        {
                            src: '/images/catbanner-02.jpg',
                            title: 'NEW ARRIVAL',
                            description: 'From $999.00 <br /> or $41.62/mo.',
                        },
                        {
                            src: '/images/catbanner-03.jpg',
                            title: 'NEW ARRIVAL',
                            description: 'From $999.00 <br /> or $41.62/mo.',
                        },
                        {
                            src: '/images/catbanner-04.jpg',
                            title: 'NEW ARRIVAL',
                            description: 'From $999.00 <br /> or $41.62/mo.',
                        },
                    ].map((item, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg shadow-lg w-full">
                            <img src={item.src} alt={item.title} className="w-full h-full object-cover block" />
                            <div className="absolute inset-0 flex flex-col justify-center items-start p-4 bg-opacity-40">
                                <h4 className="text-lg font-semibold mb-2 text-[#bf4800]">{item.title}</h4>
                                <h5 className="text-2xl font-bold mb-3">But iPad Air</h5>
                                <p
                                    className="text-sm text-[#131921]"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                ></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
