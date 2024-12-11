import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesData } from '../../../static/data';
import styles from '../../../styles/styles';

const Categories = () => {
    const navigate = useNavigate();

    const handleSubmit = (i) => {
        // Encode the category title to handle special characters in URL
        navigate(`/products?category=${encodeURIComponent(i.title)}`);
    };

    return (
        <>
            <div className={`${styles.section} hidden sm:block`}>
                <div className="branding my-4 flex justify-between w-full p-3 rounded-md bg-gray-100">
                    {/* Optional branding data section */}
                </div>
                <div className={`${styles.heading} mb-6`}>
                    <h1 className="text-2xl font-bold">Product Categories</h1>
                </div>
            </div>

            {/* Categories section */}
            <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categoriesData &&
                        categoriesData.map((i, index) => {
                            const isLastRow = Math.floor(index / 5) === Math.floor((categoriesData.length - 1) / 5);
                            const isCustomNoRightBorder = index === 4 || index === 9;

                            return (
                                <div
                                    className={`flex flex-col items-center justify-center p-4 ${
                                        !isLastRow ? 'border-b' : ''
                                    } ${
                                        isCustomNoRightBorder ? '' : 'border-r'
                                    } cursor-pointer hover:shadow-md transition-shadow duration-300`}
                                    key={i.id}
                                    onClick={() => handleSubmit(i)}
                                >
                                    <img src={i.image_Url} className="w-16 h-16 object-contain mb-2" alt={i.title} />
                                    <h5 className="text-lg font-semibold text-gray-800 text-center">{i.title}</h5>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default Categories;
