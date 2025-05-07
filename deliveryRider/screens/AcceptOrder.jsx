import React from "react";
import { Box, Card, Typography } from "@mui/material";

const AcceptOrder = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ minWidth: 275 }}>
        <Typography
          sx={{ fontFamily: "bold", fontSize: "24px", textAlign: "center" }}
        >
          Accept Order
        </Typography>

        {/* <p>Order ID: 12345</p>
        <p>Customer Name: John Doe</p>
        <p>Delivery Address: 123 Main St, Cityville</p>
        <button>Accept Order</button>
        <button>Reject Order</button>
        <button>Contact Customer</button>
        <button>View Order Details</button> */}
      </Card>
    </Box>
  );
};

export default AcceptOrder;
