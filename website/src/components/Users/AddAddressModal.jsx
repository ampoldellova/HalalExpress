import { Box, Button, CircularProgress, InputAdornment, Modal, TextField, Typography } from '@mui/material'
import location from '../../assets/images/location.png'
import React from 'react'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import AddAddressMapDisplay from './AddAddressMapDisplay';
import { useState } from 'react';
import AddressSuggestions from './AddressSuggestions';
import { toast } from 'react-toastify';
import axios from 'axios';

const containerStyle = {
    width: 'auto',
    height: '200px',
    borderRadius: 15,
}

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

const AddAddressModal = ({ open, onClose, fetchUserAddresses }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [address, setAddress] = useState('');
    const [loader, setLoader] = useState(false);
    const [region, setRegion] = useState({
        latitude: 14.509708499999999,
        longitude: 121.0359409655718,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    })

    const fetchSuggestions = async (text) => {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=7540990e27fa4d198afeb6d69d3c048e`);
        const data = await response.json();
        setSuggestions(data.results);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        fetchSuggestions(e.target.value);
    }

    const handleSuggestionPress = (suggestion) => {
        setAddress(suggestion.formatted);
        setSuggestions([]);
        setRegion({
            latitude: suggestion.lat,
            longitude: suggestion.lon,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        });
    }

    const addAddress = async () => {
        setLoader(true);
        try {
            const token = await sessionStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };

                const data = {
                    address: address,
                    latitude: region.latitude,
                    longitude: region.longitude,
                };

                await axios.post(`http://localhost:6002/api/users/address`, data, config);
                setLoader(false);
                fetchUserAddresses();
                toast.success('Address added successfully');
                onClose();
            } else {
                console.log('Authorization token not found');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component='img' src={location} sx={{ height: 30, width: 30, objectFit: 'cover', mr: 1 }} />
                    <Typography sx={{ fontFamily: 'bold', fontSize: 24 }}>
                        What's your address?
                    </Typography>
                </Box>
                <Typography sx={{ mt: 2, fontSize: 14, fontFamily: 'regular', mb: 2 }}>
                    Providing your location enables more accurate search and delivery ETA, seamless order tracking and personalised recommendations.
                </Typography>

                <TextField
                    placeholder='Enter Address'
                    onChange={(text) => handleAddressChange(text)}
                    autoComplete='off'
                    value={address}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOnOutlinedIcon className="location-icon" sx={{ color: COLORS.gray }} />
                            </InputAdornment>
                        ),
                        sx: {
                            '& input': {
                                fontFamily: 'regular',
                                fontSize: 16,
                                '&::placeholder': {
                                    fontFamily: 'regular',
                                    fontSize: 16
                                },
                            },
                        },
                    }}
                    InputLabelProps={{
                        shrink: false,
                    }}
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            bgcolor: COLORS.offwhite,
                            borderRadius: 8,
                            '& fieldset': {
                                borderColor: COLORS.offwhite,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.secondary,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.secondary,
                            },
                            '&:hover .location-icon, &.Mui-focused .location-icon': {
                                color: COLORS.secondary,
                            },
                        },
                        '& .MuiInputLabel-root': {
                            fontFamily: 'regular',
                            fontSize: 16,
                        },
                    }}
                />
                <AddressSuggestions suggestions={suggestions} onSuggestionPress={handleSuggestionPress} />
                <AddAddressMapDisplay region={region} />

                <Button onClick={addAddress} sx={{ mt: 2, width: '100%', bgcolor: COLORS.primary, color: COLORS.white, borderRadius: 8, fontFamily: 'bold', fontSize: 16, height: 50 }}>
                    {loader ? (
                        <CircularProgress sx={{ color: COLORS.white }} size={24} />
                    ) : (
                        'S U B M I T   A D D R E S S'.split(' ').join('\u00A0\u00A0\u00A0')
                    )}
                </Button>
            </Box>
        </Modal>
    )
}

export default AddAddressModal

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 8,
    p: 4,
};
