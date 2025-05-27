import { Card, CardActionArea, CardMedia, Container, Grid2, Pagination, Typography } from '@mui/material'
import FastfoodIcon from '@mui/icons-material/Fastfood';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SupplierProductModal from './SupplierProductModal';

const COLORS = {
    primary: "#30b9b2",
    primary1: "#00fff53c",
    secondary: "#ffa44f",
    secondary1: "#ffe5db",
    tertiary: "#0078a6",
    gray: "#83829A",
    gray2: "#C1C0C8",
    offwhite: "#F3F4F8",
    white: "#FFFFFF",
    black: "#000000",
    red: "#e81e4d",
    green: " #00C135",
    lightWhite: "#FAFAFC",
};

const Products = ({ products }) => {

    const [openProductModal, setOpenProductModal] = useState(false);
    const [productId, setProductId] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    const handleOpenProductModal = () => setOpenProductModal(true);
    const handleCloseProductModal = () => setOpenProductModal(false);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const paginatedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <Grid2 container sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 5 }}>
                <Typography sx={{ color: COLORS.black, fontSize: 24, fontFamily: 'bold' }}>
                    Available Product(s)
                </Typography>
                <FastfoodIcon sx={{ fontSize: 24, color: COLORS.secondary }} />
            </Grid2>

            <Grid2 container spacing={3} sx={{ mt: 2, justifyContent: 'center', mb: 5 }} >
                {paginatedProducts.map((product) => (
                    <Grid2 xs={12} sm={6} md={4} >
                        <Card sx={{ maxWidth: 170, boxShadow: 'none', cursor: 'pointer' }}>
                            <CardActionArea onClick={() => { handleOpenProductModal(); setProductId(product._id) }}>
                                <CardMedia
                                    sx={{ height: 170, borderRadius: 5, width: 170, objectFit: 'cover' }}
                                    image={product.imageUrl.url}
                                />
                                <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14, mt: 1 }}>
                                    {product.supplier.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'medium',
                                        fontSize: 18,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {product.title}
                                </Typography>
                                <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14, mt: 1 }}>
                                    from ₱ {product.price}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
            <Pagination
                count={Math.ceil(products.length / itemsPerPage)}
                page={page}
                onChange={handleChange}
                sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}
            />
            <SupplierProductModal open={openProductModal} onClose={handleCloseProductModal} productId={productId} />
        </>
    )
}

export default Products
