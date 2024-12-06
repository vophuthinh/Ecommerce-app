import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllOrdersOfUser } from '../../redux/actions/order';

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user.id));
    }, [dispatch]);

    const data = orders && orders.find((item) => item.id == id);

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            {' '}
            <>
                {data && data?.status === 'Processing' ? (
                    <h1 className="text-[20px]">Your order is being processed.</h1>
                ) : data?.status === 'Transferred to delivery partner' ? (
                    <h1 className="text-[20px]">Your order is on its way to the delivery partner.</h1>
                ) : data?.status === 'Shipping' ? (
                    <h1 className="text-[20px]">Your order is being shipped with our delivery partner.</h1>
                ) : data?.status === 'Received' ? (
                    <h1 className="text-[20px]">Your order has arrived in your area and is ready for delivery.</h1>
                ) : data?.status === 'On the way' ? (
                    <h1 className="text-[20px]">Out for delivery.</h1>
                ) : data?.status === 'Delivered' ? (
                    <h1 className="text-[20px]">Your order has been delivered!</h1>
                ) : data?.status === 'Processing refund' ? (
                    <h1 className="text-[20px]">Return and refund request is being processed</h1>
                ) : data?.status === 'Refund Success' ? (
                    <h1 className="text-[20px]">Return and refund completed successfully!</h1>
                ) : null}
            </>
        </div>
    );
};

export default TrackOrder;
