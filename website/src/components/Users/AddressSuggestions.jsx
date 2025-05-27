import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
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
const AddressSuggestions = ({ suggestions = [], onSuggestionPress }) => {
    const limitedSuggestions = suggestions.slice(0, 3)
    return (
        <>
            {limitedSuggestions.map((suggestion, index) => (
                <>
                    <Box onClick={() => onSuggestionPress(suggestion)} key={index} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 0' }}>
                        <Typography sx={{ fontFamily: 'regular', fontSize: 16 }}>{suggestion.formatted}</Typography>
                    </Box>
                    <Divider />
                </>
            ))}
        </>
    )
}

export default AddressSuggestions
