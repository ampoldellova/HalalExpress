import React from 'react'
import Lottie from 'lottie-react'
import { Box } from '@mui/material'

const Loader = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 880, backgroundColor: '#F3F4F8' }}>
            <Lottie animationData={require('../assets/anime/loading.json')} style={{ width: '30%', height: '30%' }} />
        </Box>
    )
}

export default Loader
