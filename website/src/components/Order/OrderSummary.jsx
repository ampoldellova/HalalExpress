import React from 'react'
import { Box, Divider, Typography } from '@mui/material';

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

const OrderSummary = ({ restaurant, cart }) => {
    return (
        <Box sx={{ borderRadius: 3, p: 2, bgcolor: COLORS.offwhite, width: 400 }}>
            <Typography sx={{ fontFamily: 'bold', fontSize: 24 }}>Your order from</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component='img' src={restaurant?.logoUrl.url} sx={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 1 }} />
                <Typography sx={{ fontFamily: 'medium', fontSize: 16, ml: 1 }}>{restaurant?.title}</Typography>
            </Box>

            <Box sx={{ my: 4 }}>
                {cart?.cartItems.map((item) => (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>{item.quantity}x {item.foodId.title}</Typography>
                            <Typography sx={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>₱ {item.totalPrice.toFixed(2)}</Typography>
                        </Box>
                        <Box>
                            {item.additives.length > 0 ? (
                                <>
                                    {item.additives.map((additive) => (
                                        < Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14, ml: 2 }}>
                                            + {additive.title}
                                        </Typography>
                                    ))}
                                </>
                            ) : (
                                <>
                                    < Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14, ml: 2 }}>
                                        - No additives
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14 }}>Subtotal:</Typography>
                <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14 }}>₱ {cart?.totalAmount.toFixed(2)}</Typography>

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14 }}>Delivery Fee:</Typography>
                <Typography sx={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 14 }}>₱ {cart?.totalAmount.toFixed(2)}</Typography>

            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography sx={{ fontFamily: 'bold', fontSize: 24 }}>Total:</Typography>
                <Typography sx={{ fontFamily: 'bold', fontSize: 24 }}>₱ 0.00</Typography>
            </Box>
        </Box>
    )
}

export default OrderSummary
