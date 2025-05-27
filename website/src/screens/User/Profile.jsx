import { Box, Button, Container, InputAdornment, styled, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { getUser } from '../../utils/helpers';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';

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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Profile = () => {
    const user = getUser();
    const [username, setUsername] = useState(user.username);
    const [image, setImage] = useState(user.profile.url);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitForm = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                toast.error('User is not authenticated.');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            if (image) {
                const response = await fetch(image);
                const file = await response.blob();
                formData.append('profile', file, 'profile.jpg');
            }

            formData.append('username', username);
            formData.append('email', email);
            formData.append('phone', phone);

            const response = await axios.put(`http://localhost:6002/api/users/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });

            if (response.status === 201) {
                // console.log(response.data);
                await sessionStorage.removeItem('user');
                await sessionStorage.setItem('user', JSON.stringify(response.data.data));
                toast.success('Profile updated successfully');
                setLoading(false);
            } else {
                toast.error('Failed to update profile');
                setLoading(false);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ height: '100vh', bgColor: COLORS.offwhite, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '40%', width: '100%', bgcolor: COLORS.primary }} />
            <Box sx={{ height: '100%', width: '100%', mt: -5, bgcolor: COLORS.white, borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
                <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Box component='img' src={image} sx={{ height: 200, width: 200, borderRadius: 10, mt: -13, objectFit: 'cover' }} />
                    <Box onClick={() => document.getElementById('fileInput').click()} sx={{ bgcolor: 'rgba(0,0,0,0.5)', position: 'absolute', height: 98, width: 200, borderBottomLeftRadius: 45, borderBottomRightRadius: 45, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} >
                        <CameraAltIcon sx={{ color: COLORS.white, fontSize: 30 }} />
                        <Typography sx={{ fontFamily: 'regular', color: COLORS.white, fontSize: 16 }}>
                            Change Picture
                        </Typography>
                        <VisuallyHiddenInput id="fileInput" type="file" accept="image/*" onChange={handleFileChange} />
                    </Box>
                </Box>

                <Container maxWidth="sm">
                    <Typography sx={{ fontFamily: 'bold', color: COLORS.black, fontSize: 24, mt: 3 }}>
                        My Profile
                    </Typography>
                    <Box sx={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', mt: 3 }}>
                        <Typography sx={{ fontFamily: 'regular', textAlign: 'right', color: COLORS.gray, fontSize: 16 }}>
                            Username
                        </Typography>
                        <TextField
                            placeholder='Enter Username'
                            variant="outlined"
                            name="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person2OutlinedIcon />
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
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'regular',
                                    fontSize: 16,
                                },
                            }}
                        />

                        <Typography sx={{ fontFamily: 'regular', textAlign: 'right', color: COLORS.gray, fontSize: 16, mt: 3 }}>
                            Email
                        </Typography>
                        <TextField
                            placeholder='Enter Email'
                            variant="outlined"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon />
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
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'regular',
                                    fontSize: 16,
                                },
                            }}
                        />

                        <Typography sx={{ fontFamily: 'regular', textAlign: 'right', color: COLORS.gray, fontSize: 16, mt: 3 }}>
                            Phone Number
                        </Typography>
                        <TextField
                            placeholder='Enter Phone Number'
                            variant="outlined"
                            name="email"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocalPhoneOutlinedIcon />
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
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'regular',
                                    fontSize: 16,
                                },
                            }}
                        />

                        <Button onClick={handleSubmitForm} variant="contained" sx={{ bgcolor: COLORS.primary, color: COLORS.white, mt: 3, borderRadius: 8, textTransform: 'none', fontFamily: 'bold', fontSize: 18, height: 50 }}>
                            {loading ? (<CircularProgress sx={{ color: COLORS.white }} size={24} />) : (`U P D A T E`)}
                        </Button>
                    </Box>
                </Container>

            </Box>
        </Container>
    )
}

export default Profile
