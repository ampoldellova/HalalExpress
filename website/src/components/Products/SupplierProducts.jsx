import { Box, Card, CardActionArea, CardMedia, Grid2, Rating, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
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

const SupplierProducts = ({ supplierId }) => {
    const [openProductModal, setOpenProductModal] = useState(false);
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);

    const handleOpenProductModal = () => setOpenProductModal(true);
    const handleCloseProductModal = () => setOpenProductModal(false);

    const fetchSupplierProducts = async () => {
        try {
            const response = await axios.patch(`http://localhost:6002/api/ingredients/supplier/${supplierId}`, {});
            setProducts(response.data);
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchSupplierProducts();
    }, []);

    return (
        <Grid2 container spacing={3} sx={{ flexDirection: 'row', justifyContent: 'flex-start', mt: 2, }}>
            {products.map((product) => (
                <Card sx={{ boxShadow: 'none', cursor: 'pointer', borderRadius: 5, width: 470, bgcolor: COLORS.offwhite, border: 1, borderColor: COLORS.gray2, p: 1 }}>
                    <CardActionArea onClick={() => { handleOpenProductModal(); setProductId(product._id) }}>
                        <Grid2 container sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: 5 }}>
                            <CardMedia
                                component="img"
                                image={product.imageUrl.url}
                                sx={{ height: 140, width: 140, borderRadius: 5, objectFit: 'cover' }}
                            />
                            <Grid2 sx={{ flexDirection: 'column', ml: 2, width: 300 }}>
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
                                    {product.ratingCount} Reviews
                                </Typography>
                                <Grid2 container sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                    <Rating
                                        name="simple-controlled"
                                        value={product.rating}
                                        precision={0.2}
                                        readOnly
                                        size='medium'
                                        sx={{ color: COLORS.secondary }}
                                    />
                                    <Box sx={{ bgcolor: COLORS.secondary, px: 1, borderRadius: 2 }}>
                                        <Typography sx={{ fontFamily: 'regular', color: COLORS.white, fontSize: 14 }}>
                                            ₱ {product.price}
                                        </Typography>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </CardActionArea>
                </Card>
            ))}
            <SupplierProductModal open={openProductModal} onClose={handleCloseProductModal} productId={productId} />
        </Grid2>
    )
}

export default SupplierProducts
