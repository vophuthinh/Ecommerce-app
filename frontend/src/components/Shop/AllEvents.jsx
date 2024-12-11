import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEye, AiOutlinePlusCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteEvent, getAllEventsShop } from '../../redux/actions/event';
import { getAllProductsShop } from '../../redux/actions/product';
import { deleteProduct } from '../../redux/actions/product';
import Loader from '../Layout/Loader';
import currency from 'currency-formatter';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { categoriesData } from '../../static/data';
import axios from 'axios';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const AllEvents = () => {
    const { events, isLoading } = useSelector((state) => state.events);
    const { seller } = useSelector((state) => state.seller);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [originalPrice, setOriginalPrice] = useState();
    const [discountPrice, setDiscountPrice] = useState();
    const [stock, setStock] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [idPro, setIdPro] = useState(null);
    useEffect(() => {
        dispatch(getAllEventsShop(seller.id));
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteEvent(id));
        window.location.reload();
    };
    const handelEdit = (id) => {
        try {
            const dataField = events?.filter((itc) => itc.id == id.id);
            console.log(dataField, 'dataField');
            setName(dataField?.[0]?.name || '');
            setDescription(dataField?.[0]?.description || ''); // Set product description or empty string
            setCategory(dataField?.[0]?.category || ''); // Set product category or default
            setTags(dataField?.[0]?.tags || ''); // Set product tags or default
            setOriginalPrice(dataField?.[0]?.originalPrice || ''); // Set original price or default
            setDiscountPrice(dataField?.[0]?.discountPrice || ''); // Set discount price or default
            setStock(dataField?.[0]?.stock || ''); // Set stock value or default
            setImages(dataField?.[0]?.images || []); // Set product images or default empty array
            setStartDate(new Date(dataField?.[0]?.start_Date) || ''); // Set product images or default empty array
            setEndDate(new Date(dataField?.[0]?.Finish_Date) || ''); // Set product images or default empty array
            setIdPro(id.id);

            handleOpen();
        } catch (error) {
            console.log(error);
        }
    };
    const columns = [
        { field: 'id', headerName: 'ID Product', minWidth: 150, flex: 0.7 },
        {
            field: 'name',
            headerName: 'Product Name',
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: 'price',
            headerName: 'Price',
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: 'Stock',
            headerName: 'Stock',
            type: 'number',
            minWidth: 80,
            flex: 0.5,
        },

        {
            field: 'sold',
            headerName: 'Sold',
            type: 'number',
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: 'View',
            flex: 0.8,
            minWidth: 100,
            headerName: '',
            type: 'number',
            sortable: false,
            renderCell: (params) => {
                console.log(params, 'paramsparams');
                const d = params.row.name;
                const product_name = d.replace(/\s+/g, '-');
                return (
                    <>
                        <Link to={`/product/${params.id}?isEvent=true`}>
                            <Button>
                                <AiOutlineEye size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
        {
            field: 'Delete',
            flex: 0.8,
            minWidth: 120,
            headerName: '',
            type: 'number',
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button className="font-bold" onClick={() => handelEdit(params)}>
                            Edit
                        </Button>
                        <Button onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </Button>
                    </>
                );
            },
        },
    ];
    const today = new Date().toISOString().slice(0, 10);
    const minEndDate = startDate
        ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        : '';
    const handleEndDateChange = (e) => {
        const endDate = new Date(e.target.value);
        setEndDate(endDate);
    };
    const handleImageChange = (e) => {
        e.preventDefault();
        let files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };
    const row = [];
    events &&
        events.forEach((item) => {
            row.push({
                id: item.id,
                name: item.name,
                price: `${currency.format(item.discountPrice, {
                    code: 'VND',
                })}`,
                Stock: item.stock,
                sold: item.sold_out,
            });
        });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newForm = new FormData();
        images.forEach((image) => {
            newForm.append('images', image);
        });
        newForm.append('name', name);
        newForm.append('description', description);
        newForm.append('category', category);
        newForm.append('tags', tags);
        newForm.append('originalPrice', originalPrice);
        newForm.append('discountPrice', discountPrice);
        newForm.append('stock', stock);
        newForm.append('shopId', seller.id);
        newForm.append('eventId', idPro);
        newForm.append('start_Date', startDate.toISOString());
        newForm.append('Finish_Date', endDate.toISOString());
        await axios.put(`http://localhost:8000/api/v2/event/update-event`, newForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(getAllEventsShop(seller.id));
        handleClose();
    };
    const handleStartDateChange = (e) => {
        const startDate = new Date(e.target.value);
        const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        setStartDate(startDate);
        setEndDate(null);
        document.getElementById('end-date').min = minEndDate.toISOString.slice(0, 10);
    };
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="max-h-[600px] overflow-y-auto">
                            <br />
                            <div>
                                <label className="pb-2">
                                    Event Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Add event name..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    cols="30"
                                    required
                                    rows="8"
                                    type="text"
                                    name="description"
                                    value={description}
                                    className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Event description, content..."
                                ></textarea>
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full mt-2 border h-[35px] rounded-[5px]"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="Choose a category">Select category</option>
                                    {categoriesData &&
                                        categoriesData.map((i) => (
                                            <option value={i.title} key={i.title}>
                                                {i.title}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={tags}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="Add tags for promotional products..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">Original Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={originalPrice}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    placeholder="Enter original price..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    Discounted Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={discountPrice}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={(e) => setDiscountPrice(e.target.value)}
                                    placeholder="Discounted price of the product in the event..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={stock}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="Number of products..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="price"
                                    id="start-date"
                                    value={startDate ? startDate.toISOString().slice(0, 10) : ''}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={handleStartDateChange}
                                    min={today}
                                    placeholder="Enter your event product stock..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="price"
                                    id="start-date"
                                    value={endDate ? endDate.toISOString().slice(0, 10) : ''}
                                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={handleEndDateChange}
                                    min={minEndDate}
                                    placeholder="Enter your event product stock..."
                                />
                            </div>
                            <br />
                            <div>
                                <label className="pb-2">
                                    Image <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    name=""
                                    id="upload"
                                    className="hidden"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <div className="w-full flex items-center flex-wrap">
                                    <label htmlFor="upload">
                                        <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
                                    </label>
                                    {images &&
                                        images.map((i) => (
                                            <img
                                                src={
                                                    i instanceof File
                                                        ? URL.createObjectURL(i)
                                                        : 'http://localhost:8000/' + i
                                                }
                                                key={i}
                                                alt=""
                                                className="h-[120px] w-[120px] object-cover m-2"
                                            />
                                        ))}
                                </div>
                                <br />
                                <div>
                                    <input
                                        type="submit"
                                        value="update Event"
                                        className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
                </div>
            )}
        </>
    );
};

export default AllEvents;
