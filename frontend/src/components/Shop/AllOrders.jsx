import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { AiOutlineArrowRight } from 'react-icons/ai';
import currency from 'currency-formatter';

const AllOrders = () => {
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller.id));
    }, [dispatch, seller.id]);

    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

        {
            field: 'status',
            headerName: 'Status',
            minWidth: 130,
            flex: 0.7,
            renderCell: (params) => (
                <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                        params.row.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {params.row.status}
                </span>
            ),
        },
        {
            field: 'itemsQty',
            headerName: 'Quantity',
            type: 'number',
            minWidth: 130,
            flex: 0.7,
            renderCell: (params) => <span className="text-gray-800 font-medium">{params.row.itemsQty}</span>,
        },
        {
            field: 'total',
            headerName: 'Total',
            type: 'number',
            minWidth: 130,
            flex: 0.8,
            renderCell: (params) => <span className="font-semibold text-gray-800">{params.row.total}</span>,
        },
        {
            field: 'action',
            headerName: 'Details',
            flex: 1,
            minWidth: 150,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <Link to={`/order/${params.id}`} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className="transition-transform duration-300 transform hover:scale-105"
                    >
                        <AiOutlineArrowRight size={20} />
                    </Button>
                </Link>
            ),
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item.id,
                itemsQty: item.cart.length,
                total: `${currency.format(item.totalPrice, { code: 'VND' })}`,
                status: item.status,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-[90%] mx-auto pt-6 mt-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-xl font-semibold text-gray-800 mb-4 px-4">All Orders</h1>
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                        className="bg-white rounded-lg"
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-row': {
                                '&:hover': {
                                    backgroundColor: '#f9fafb',
                                },
                            },
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default AllOrders;
