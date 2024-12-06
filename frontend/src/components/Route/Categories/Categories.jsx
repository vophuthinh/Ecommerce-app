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

            <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
                <div className="grid grid-cols-5 gap-0">
                    {categoriesData &&
                        categoriesData.map((i, index) => {
                            const isLastRow = Math.floor(index / 5) === Math.floor((categoriesData.length - 1) / 5);
                            const isCustomNoRightBorder = index === 4 || index === 9;

                            return (
                                <div
                                    className={`flex items-center justify-between p-4 ${!isLastRow ? 'border-b' : ''} ${
                                        isCustomNoRightBorder ? '' : 'border-r'
                                    } cursor-pointer hover:shadow-md transition-shadow duration-300`}
                                    key={i.id}
                                    onClick={() => handleSubmit(i)}
                                >
                                    <div>
                                        <h5 className="text-lg font-semibold text-gray-800">{i.title}</h5>
                                    </div>
                                    <img src={i.image_Url} className="w-16 h-auto object-contain" alt={i.title} />
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default Categories;
