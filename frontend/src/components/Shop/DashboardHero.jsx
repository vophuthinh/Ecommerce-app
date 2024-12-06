import React, { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import { GiMoneyStack } from 'react-icons/gi';
import { RiBillLine } from 'react-icons/ri';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import styles from '../../styles/styles';
import { Link } from 'react-router-dom';
import { MdBorderClear } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { getAllProductsShop } from '../../redux/actions/product';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import currency from 'currency-formatter';

const DashboardHero = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller.id));
        dispatch(getAllProductsShop(seller.id));
    }, [dispatch]);
    console.log( seller?.availableBalance,' seller?.availableBalance')
    const availableBalance = Number(seller?.availableBalance)?.toFixed(2);

    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor';
            },
        },
        {
            field: 'itemsQty',
            headerName: 'Quantity',
            type: 'number',
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: 'total',
            headerName: 'Total',
            type: 'number',
            minWidth: 130,
            flex: 0.8,
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item.id,
                itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
                total: `${currency.format(item.totalPrice, { code: 'VND' })}`,
                status: item.status,
            });
        });

    return (
        <div className="w-full p-8">
            <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
            <div className="w-full block 800px:flex items-center justify-between">
                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <GiMoneyStack size={30} className="mr-2" fill="#00000085" />
                        <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                            Earnings (After 10% service fee) <span className="text-[16px]"></span>
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                        {currency.format(availableBalance, { code: 'VND' })}
                    </h5>
                    <Link to="/dashboard-withdraw-money">
                        <h5 className="pt-4 pl-[2] text-[#077f9c]">Request Withdrawal</h5>
                    </Link>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <RiBillLine size={30} className="mr-2" fill="#00000085" />
                        <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                            Orders
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{orders && orders.length}</h5>
                    <Link to="/dashboard-orders">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">View Order List</h5>
                    </Link>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <IoFileTrayStackedOutline size={30} className="mr-2" fill="#00000085" />
                        <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                            Products
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{products && products.length}</h5>
                    <Link to="/dashboard-products">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">View Product List</h5>
                    </Link>
                </div>
            </div>
            <br />
            <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
            <div className="w-full min-h-[45vh] bg-white rounded">
                <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
            </div>
        </div>
    );
};

export default DashboardHero;
