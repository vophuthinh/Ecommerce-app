import React, { useEffect } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import { GiMoneyStack } from 'react-icons/gi';
import { RiBillLine } from 'react-icons/ri';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { getAllProductsShop } from '../../redux/actions/product';
import { DataGrid } from '@mui/x-data-grid';
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

    const availableBalance = Number(seller?.availableBalance)?.toFixed(2);

    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === 'Delivered' ? 'text-green-500' : 'text-red-500';
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
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            <h3 className="text-2xl font-semibold pb-4">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <GiMoneyStack size={30} className="mr-3 text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-600">Earnings (After 10% service fee)</h3>
                    </div>
                    <h5 className="text-2xl font-bold text-gray-800">
                        {currency.format(availableBalance, { code: 'VND' })}
                    </h5>
                    <Link to="/dashboard-withdraw-money" className="mt-4 inline-block text-blue-600 hover:underline">
                        Request Withdrawal
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <RiBillLine size={30} className="mr-3 text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-600">Orders</h3>
                    </div>
                    <h5 className="text-2xl font-bold text-gray-800">{orders && orders.length}</h5>
                    <Link to="/dashboard-orders" className="mt-4 inline-block text-blue-600 hover:underline">
                        View Order List
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                        <IoFileTrayStackedOutline size={30} className="mr-3 text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-600">Products</h3>
                    </div>
                    <h5 className="text-2xl font-bold text-gray-800">{products && products.length}</h5>
                    <Link to="/dashboard-products" className="mt-4 inline-block text-blue-600 hover:underline">
                        View Product List
                    </Link>
                </div>
            </div>

            <h3 className="text-2xl font-semibold mt-8 pb-4">Latest Orders</h3>
            <div className="w-full bg-white shadow-md rounded-lg p-4">
                <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    autoHeight
                    className="bg-gray-50"
                />
            </div>
        </div>
    );
};

export default DashboardHero;
