import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';
import { getToken } from '../../utils/helpers';



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

const ManageUsers = () => {
    const [users, setUsers] = React.useState([]);
    const [userTypes, setUserTypes] = React.useState({});
    const token = getToken();

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`https://halalexpress.onrender.com/api/users/list`, config);

            const formattedData = data.map((user, index) => ({
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                createdAt: new Date(user.createdAt).toLocaleString(),
            }));

            setUsers(formattedData);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (event, id) => {
        const newValue = event.target.value;
        console.log(`User ID: ${id}, New User Type: ${newValue}`);
        setUserTypes(prevState => ({
            ...prevState,
            [id]: newValue,
        }));
        // Add your custom logic here, e.g., update the user type in the backend
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 300 },
        { field: 'username', headerName: 'Username', width: 250 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'userType',
            headerName: 'User Type',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth variant='filled'>
                        <Select
                            value={userTypes[params.id] || params.row.userType}
                            onChange={(event) => handleChange(event, params.id)}
                        >
                            <MenuItem value={'Client'}>Client</MenuItem>
                            <MenuItem value={'Vendor'}>Vendor</MenuItem>
                            <MenuItem value={'Supplier'}>Supplier</MenuItem>
                            <MenuItem value={'Admin'}>Admin</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: COLORS.primary, fontFamily: 'bold', mt: 1, textAlign: 'center', mb: 2, fontSize: 24 }}>
                Manage Users
            </Typography>
            <DataGrid
                rows={users}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}

export default ManageUsers;