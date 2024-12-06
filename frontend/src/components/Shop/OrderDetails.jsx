import React, { useEffect, useState } from 'react';
import styles from '../../styles/styles';
import { BsFillBagFill } from 'react-icons/bs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { backend_url, server } from '../../server';
import axios from 'axios';
import { toast } from 'react-toastify';
import currency from 'currency-formatter';

const OrderDetails = () => {
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    console.log(orders,'ordersordersorders')
    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller.id));
    }, [dispatch,seller.id]);

    const data = orders && orders.find((item) => item.id == id);
    console.log(data,'datadatadata')

    const orderUpdateHandler = async (e) => {
        await axios
            .put(
                `${server}/order/update-order-status/${id}`,
                {
                    status,
                },
                { withCredentials: true },
            )
            .then((res) => {
                toast.success('Order updated!');
                navigate('/dashboard-orders');
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const refundOrderUpdateHandler = async (e) => {
        await axios
            .put(
                `${server}/order/order-refund-success/${id}`,
                {
                    status,
                },
                { withCredentials: true },
            )
            .then((res) => {
                toast.success('Order updated!');
                dispatch(getAllOrdersOfShop(seller.id));
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className={`py-4 min-h-screen ${styles.section}`}>
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                    <BsFillBagFill size={30} color="crimson" />
                    <h1 className="pl-2 text-[25px]">Order Details</h1>
                </div>
                <Link to="/dashboard-orders">
                    <div
                        className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
                    >
                        Go Back
                    </div>
                </Link>
            </div>

            <div className="w-full flex items-center justify-between pt-6">
                <h5 className="text-[#00000084]">
                    Order ID: <span># {data?.id}</span>
                </h5>
                <h5 className="text-[#00000084]">
                    Date: <span>{data?.createdAt?.slice(0, 10)}</span>
                </h5>
            </div>

            {/* order items */}
            <br />
            <br />
            {data &&
                data?.cart.map((item, index) => (
                    <div className="w-full flex items-start mb-5">
                        <img src={`${backend_url}/${item.images[0]}`} alt="" className="w-[80x] h-[80px]" />
                        <div className="w-full">
                            <h5 className="pl-3 text-[20px]">{item.name}</h5>
                            <h5 className="pl-3 text-[20px] text-[#00000091]">
                                {currency.format(item.discountPrice, { code: 'VND' })} x {item.qty}
                            </h5>
                        </div>
                    </div>
                ))}

            <div className="border-t w-full text-right">
                <h5 className="pt-3 text-[18px]">
                    Total: <strong>{data ? `${currency.format(data.totalPrice, { code: 'VND' })}` : null}</strong>
                </h5>
            </div>
            <br />
            <br />
            <div className="w-full 800px:flex items-center">
                <div className="w-full 800px:w-[60%]">
                    <h4 className="pt-3 text-[20px] font-[600]">Shipping Information:</h4>
                    <h4 className="pt-3 text-[20px]">Customer Name: {data?.user?.name}</h4>
                    <h4 className="pt-3 text-[20px]">
                        Address: {data?.shippingAddress.address1}, {data?.shippingAddress.city}
                    </h4>
                    <h4 className="text-[20px]">Phone: +(84) {data?.user?.phoneNumber}</h4>
                </div>
                <div className="w-full 800px:w-[40%]">
                    <h4 className="pt-3 text-[20px]">Payment Information:</h4>
                    <h4>Status: {data?.paymentInfo?.status ? data?.paymentInfo?.status : 'Unpaid'}</h4>
                </div>
            </div>
            <br />
            <br />
            <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
            {data?.status !== 'Processing refund' && data?.status !== 'Refund Success' && (
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
                >
                    {[
                        'Processing',
                        'Transferred to delivery partner',
                        'Shipping',
                        'Received',
                        'On the way',
                        'Delivered',
                    ]
                        .slice(
                            [
                                'Processing',
                                'Transferred to delivery partner',
                                'Shipping',
                                'Received',
                                'On the way',
                                'Delivered',
                            ].indexOf(data?.status),
                        )
                        .map((option, index) => (
                            <option value={option} key={index}>
                                {option}
                            </option>
                        ))}
                </select>
            )}
            {data?.status === 'Processing refund' || data?.status === 'Refund Success' ? (
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
                >
                    {['Processing refund', 'Refund Success']
                        .slice(['Processing refund', 'Refund Success'].indexOf(data?.status))
                        .map((option, index) => (
                            <option value={option} key={index}>
                                {option}
                            </option>
                        ))}
                </select>
            ) : null}

            <div
                className={`${styles.button} mt-5 !bg-[#0454ffee] !rounded-[4px] text-[#ffffff] font-[600] !h-[45px] text-[18px]`}
                onClick={data?.status !== 'Processing refund' ? orderUpdateHandler : refundOrderUpdateHandler}
            >
                Update
            </div>
        </div>
    );
};

export default OrderDetails;
