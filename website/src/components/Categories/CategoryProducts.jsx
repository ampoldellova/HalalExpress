import { Box, Card, CardActionArea, CardContent, CardMedia, Grid2, Rating, Typography } from '@mui/material'
import React from 'react'
import empty from '../../assets/images/empty.png'

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
const CategoryProducts = ({ products }) => {
    return (
        <Grid2 container spacing={3} sx={{ flexDirection: 'row', justifyContent: 'center', mt: 2, }}>
            {products.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box component='img' src={empty} sx={{ height: 200, width: 200 }} />
                    <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 18, mt: 2 }}>
                        No products found.
                    </Typography>
                </Box>
            ) : (
                <>
                    {products.map((product) => (
                        <Card sx={{ boxShadow: 'none', cursor: 'pointer', mb: 2, borderRadius: 5, width: 563, bgcolor: COLORS.offwhite }}>
                            <Grid2 container sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: 5 }}>
                                <CardMedia
                                    component="img"
                                    image={product.imageUrl.url}
                                    sx={{ height: 140, width: 140, borderRadius: 5, objectFit: 'cover' }}
                                />
                                <Grid2 sx={{ flexDirection: 'column', ml: 2, width: 380 }}>
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
                        </Card>
                    ))}
                </>
            )}
        </Grid2>
    )
}

export default CategoryProducts
