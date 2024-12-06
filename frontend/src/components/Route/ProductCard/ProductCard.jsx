import React, { useState, useEffect } from "react";
import currency from "currency-formatter";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const dataShop = data.shop;
  const imageArr = data.images;
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i.id == data.id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data.id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
    toast.info("Removed from wishlist!");
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
    toast.success("Added to wishlist!");
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i.id == id);
    if (isItemExists) {
      toast.error("The product is already in the cart!");
    } else {
      if (data.stock < 1) {
        toast.error("The product is out of stock!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Added to cart!");
      }
    }
  };

  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-md p-4 relative cursor-pointer hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <Link
        to={`${
          isEvent === true
            ? `/product/${data.id}?isEvent=true`
            : `/product/${data.id}`
        }`}
      >
        <img
          src={`${backend_url}${imageArr && imageArr[0]}`}
          alt={data.name}
          className="w-auto h-[150px] object-contain mx-auto rounded-md hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Shop Name */}
      <Link to={`/shop/preview/${dataShop.id}`}>
        <h5 className={`${styles.shop_name} text-center mt-2`}>
          {dataShop?.name?.length > 20
            ? `${dataShop.name.slice(0, 20)}...`
            : dataShop?.name}
        </h5>
      </Link>

      {/* Product Name */}
      <Link
        to={`${
          isEvent === true
            ? `/product/${data.id}?isEvent=true`
            : `/product/${data.id}`
        }`}
      >
        <h4 className="font-semibold text-gray-800 text-center mt-2">
          {data.name.length > 35 ? `${data.name.slice(0, 35)}...` : data.name}
        </h4>
      </Link>

      {/* Ratings */}
      <div className="flex justify-center mt-2">
        <Ratings rating={data?.ratings} />
      </div>

      {/* Price Section */}
      <div className="flex items-center justify-between mt-4">
        <h5 className="text-red-500 font-bold text-lg">
          {`${currency.format(data.discountPrice, { code: "VND" })}`}
        </h5>
        {data.originalPrice && (
          <h4 className="text-gray-500 line-through text-sm">
            {`${currency.format(data.originalPrice, { code: "VND" })}`}
          </h4>
        )}
      </div>

      {/* Side Options */}
      <div className="absolute top-2 right-2 flex flex-col items-center space-y-4">
        {/* Wishlist */}
        {click ? (
          <AiFillHeart
            size={22}
            className="text-red-500 hover:scale-110 transition"
            onClick={() => removeFromWishlistHandler(data)}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="text-gray-600 hover:scale-110 hover:text-red-500 transition"
            onClick={() => addToWishlistHandler(data)}
            title="Add to wishlist"
          />
        )}

        {/* Quick View */}
        <AiOutlineEye
          size={22}
          className="text-gray-600 hover:scale-110 hover:text-blue-500 transition"
          onClick={() => setOpen(!open)}
          title="Quick view"
        />

        {/* Add to Cart */}
        <AiOutlineShoppingCart
          size={25}
          className="text-gray-700 hover:scale-110 hover:text-green-500 transition"
          onClick={() => addToCartHandler(data.id)}
          title="Add to cart"
        />
      </div>

      {/* Product Details Modal */}
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
};

export default ProductCard;
