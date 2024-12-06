import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { categoriesData } from "../static/data";
import DropDown from "../components/Layout/DropDown";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/searchNotFound.json";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = decodeURIComponent(searchParams.get("category") || "");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  console.log(data,'datadataxxx')
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      setData([]);
      return;
    }

    let filteredData = [...allProducts];

    if (categoryData) {
      filteredData = filteredData.filter(
        (product) =>
          product.category.trim().toLowerCase() ===
          categoryData.trim().toLowerCase()
      );
    }

    switch (sortOption) {
      case "price_asc":
        filteredData.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "price_desc":
        filteredData.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "name_asc":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setData(filteredData);
  }, [allProducts, categoryData, sortOption]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <div
            className={`${styles.section} flex flex-col lg:flex-row gap-6 mt-10 mb-20`}
          >
            {/* DropDown Section */}
            <div className="w-full lg:w-[300px] xl:w-[350px]">
              <DropDown categoriesData={categoriesData} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort By Section */}
              <div className="flex justify-between items-center p-4 bg-[#232f3e] text-[#f5f5f7] rounded-lg mb-4">
                <h2 className="text-lg font-semibold">Sort By</h2>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="p-2 bg-[#232f3e] border border-[#3b4149] text-[#f5f5f7] rounded-lg hover:border-[#febd69] focus:outline-none transition"
                >
                  <option value="default">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A-Z</option>
                  <option value="name_desc">Name: Z-A</option>
                </select>
              </div>

              {/* Products List */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data?.map((product, index) => {
                  return <ProductCard data={product} key={index} />
                })}
              </div>

              {/* No Products Found */}
              {data && data.length === 0 && (
                <div className="flex flex-col items-center mt-10">
                  <Lottie options={defaultOptions} width={250} height={250} />
                  <h5 className="text-center mt-4 text-lg text-gray-600">
                    No products found
                  </h5>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
