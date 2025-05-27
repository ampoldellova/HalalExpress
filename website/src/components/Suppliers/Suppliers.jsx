import { Box, Card, CardActionArea, CardMedia, Container, Grid2, Rating, Typography } from '@mui/material'
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const Suppliers = ({ suppliers }) => {
    const navigate = useNavigate();
    return (
        <>
            <Grid2 container sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 5 }}>
                <Typography sx={{ color: COLORS.black, fontSize: 24, fontFamily: 'bold' }}>
                    Suppliers
                </Typography>
                <RestaurantMenuOutlinedIcon sx={{ fontSize: 24, color: COLORS.secondary }} />
            </Grid2>

            <Grid2 container spacing={3} sx={{ mt: 2, justifyContent: 'space-between' }}>
                {suppliers.map((supplier) => (
                    <Grid2 xs={12} sm={6} md={4} >
                        <Card sx={{ maxWidth: 365, boxShadow: 'none', cursor: 'pointer' }}>
                            <CardActionArea onClick={() => navigate(`/supplier/${supplier._id}`, { state: { supplier } })}>
                                <CardMedia
                                    sx={{ height: 140, borderRadius: 5, width: 365, objectFit: 'cover' }}
                                    image={supplier.imageUrl.url}
                                />
                                <Grid2 container sx={{ alignItems: 'center' }}>
                                    <Box component="img" src={supplier.logoUrl.url} sx={{ height: 30, width: 30, borderRadius: 2 }} />
                                    <Box >
                                        <Typography sx={{ fontFamily: 'medium', fontSize: 18, ml: 1, mt: 1 }}>
                                            {supplier.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: 'auto', borderRadius: 3, bgcolor: supplier.isAvailable ? COLORS.primary : COLORS.red, px: 1 }}>
                                        <Typography sx={{ color: COLORS.white, fontFamily: 'regular', fontSize: 12 }}>
                                            {supplier.isAvailable ? 'Open' : 'Closed'}
                                        </Typography>
                                    </Box>
                                </Grid2>

                                <Grid2 container sx={{ justifyContent: 'space-between', mt: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: COLORS.gray, fontFamily: 'regular' }}>
                                        Delivery Under
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: COLORS.gray, fontFamily: 'regular' }}>
                                        {supplier.time}
                                    </Typography>
                                </Grid2>

                                <Grid2 container sx={{ justifyContent: 'space-between', mt: 0.5 }}>
                                    <Rating
                                        name="simple-controlled"
                                        value={supplier.rating}
                                        precision={0.2}
                                        readOnly
                                        size='small'
                                        sx={{ color: COLORS.primary }}
                                    />
                                    <Typography variant="body2" sx={{ color: COLORS.gray, fontFamily: 'regular' }}>
                                        {supplier.ratingCount} + ratings
                                    </Typography>
                                </Grid2>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </>
    )
}

export default Suppliers
