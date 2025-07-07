import { Box, Button, Modal, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

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


const DeleteAddressModal = ({ address, fetchUserAddresses }) => {
    const [deleteAddressModal, setDeleteAddressModal] = useState(false);

    const handleOpenDeleteAddressModal = () => setDeleteAddressModal(true);
    const handleCloseDeleteAddressModal = () => setDeleteAddressModal(false);

    const deleteAddress = async () => {
        try {
            const token = await sessionStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    }
                }

                await axios.delete(`https://halalexpress.onrender.com/api/users/address/${address._id}`, config);
                toast.success('Address deleted successfully');
                fetchUserAddresses();
            } else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <DeleteOutlineOutlinedIcon onClick={handleOpenDeleteAddressModal} sx={{ cursor: 'pointer' }} />
            <Modal
                open={deleteAddressModal}
                onClose={handleCloseDeleteAddressModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography sx={{ fontFamily: 'bold', fontSize: 24 }}>
                        Do you want to delete this address?
                    </Typography>
                    <Typography sx={{ fontFamily: 'regular', fontSize: 16, mt: 2, color: COLORS.gray }}>
                        Are you sure you want to delete this address: ({address.address}). This action cannot be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button onClick={handleCloseDeleteAddressModal} sx={{ cursor: 'pointer', color: COLORS.gray, textTransform: 'none', fontFamily: 'regular', fontSize: 16, mr: 2 }}>
                            Cancel
                        </Button>
                        <Button onClick={deleteAddress} sx={{ cursor: 'pointer', color: COLORS.white, bgcolor: COLORS.red, textTransform: 'none', fontFamily: 'regular', fontSize: 16 }}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default DeleteAddressModal
