import { Box, Grid2, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

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

const ProductCategories = ({ setSelectedCategory, setSelectedSection, setSelectedValue }) => {
    const [productCategories, setProductCategories] = useState([]);
    const [selected, setSelected] = useState(null);

    const getProductCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:6002/api/supplyCategory/`);
            setProductCategories(response.data)
        } catch (error) {
            console.log("Error fetching restaurants:", error);
        }
    }

    useEffect(() => {
        getProductCategories();
    }, []);

    const handleSelectedCategory = (item) => {
        if (selected == item.value) {
            setSelectedCategory(null);
            setSelected(null);
            setSelectedSection(null);
            setSelectedValue(null);
        } else {
            setSelectedCategory(item._id);
            setSelected(item.value);
            setSelectedSection('category');
            setSelectedValue(item.title);
        }
    }

    return (
        <>
            <Grid2 container spacing={3} sx={{ mt: 2, justifyContent: 'space-between', mt: 5, alignItems: 'center' }} >
                {productCategories.map((productCategory) => (
                    <Grid2 xs={12} sm={6} md={4} >
                        <Box
                            component="img"
                            onClick={() => handleSelectedCategory(productCategory)}
                            sx={{
                                height: 60,
                                width: 60,
                                display: 'flex',
                                margin: '0 auto',
                                borderColor: productCategory.value == selected ? COLORS.secondary : 'transparent',
                                cursor: 'pointer'
                            }}
                            src={productCategory.imageUrl.url}
                        />
                        <Typography sx={{ color: COLORS.black, fontSize: 14, fontFamily: 'regular', textAlign: 'center', mt: 1 }}>
                            {productCategory.title}
                        </Typography>
                    </Grid2>
                ))}
            </Grid2>
        </>
    )
}

export default ProductCategories
