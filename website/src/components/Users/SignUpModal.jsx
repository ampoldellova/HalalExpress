import { Box, Button, Fade, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import axios from 'axios';
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

const SignUpModal = ({ open, onClose }) => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');

    const signUpUser = async () => {
        try {
            const response = await axios.post(`http://localhost:6002/register`, { username, email, phone, password });
            console.log(response);
            if (response.data.status) {
                onClose();
                toast.success("Registered successfully!");
            } else {
                toast.error(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during sign-up:", error.response ? error.response.data : error.message);
            toast.error("Registration failed. Please try again.");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        signUpUser();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Fade in={open}>
                <Box sx={styles.modal}>
                    <Typography sx={styles.signUpText}>
                        Sign Up!
                    </Typography>
                    <Typography sx={styles.signUpSubText}>
                        Register your details to get started
                    </Typography>

                    <Box sx={styles.formContainer} component='form' onSubmit={handleSubmit}>
                        <TextField
                            placeholder='Enter Username'
                            variant="outlined"
                            name="username"
                            value={username}
                            autoComplete='off'
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineOutlinedIcon />
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
                        <TextField
                            placeholder='Enter Email'
                            variant="outlined"
                            name="email"
                            value={email}
                            autoComplete='off'
                            onChange={(e) => setEmail(e.target.value)}
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
                        <TextField
                            placeholder='Enter Phone Number'
                            variant="outlined"
                            name="phone"
                            value={phone}
                            autoComplete='off'
                            onChange={(e) => setPhone(e.target.value)}
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
                        <TextField
                            placeholder='Enter Password'
                            variant="outlined"
                            name="password"
                            type='password'
                            value={password}
                            autoComplete='off'
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HttpsOutlinedIcon />
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

                        <Button type="submit" variant="contained" sx={styles.modalLoginBtn} >S U B M I T</Button>
                    </Box>

                </Box>
            </Fade>
        </Modal>
    )
}

const styles = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: 5,
        width: 400,
        p: 4,
    },
    loginBtn: {
        borderColor: COLORS.gray,
        borderRadius: 3,
        textTransform: 'none',
        fontFamily: 'regular',
        color: COLORS.gray
    },
    signUpBtn: {
        borderRadius: 3,
        textTransform: 'none',
        fontFamily: 'regular',
        backgroundColor: COLORS.primary
    },
    signUpText: {
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'left',
        fontSize: 24
    },
    signUpSubText: {
        fontFamily: 'regular',
        color: COLORS.gray,
        textAlign: 'left',
        fontSize: 14,
        mt: 1
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 3
    },
    modalLoginBtn: {
        backgroundColor: COLORS.primary,
        textTransform: 'none',
        fontFamily: 'bold',
    },
    modalSignUpBtn: {
        color: COLORS.gray,
        textTransform: 'none',
        fontFamily: 'regular',
        fontSize: 14,
        textAlign: 'center'
    },
    link: {
        color: COLORS.primary,
        textTransform: 'none',
        fontFamily: 'regular'
    }
};

export default SignUpModal
