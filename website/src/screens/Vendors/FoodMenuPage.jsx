import { Box, Button, Container, Switch, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import { toast } from "react-toastify";
import axios from "axios";

const FoodMenuPage = () => {
  const foodId = useParams().foodId;
  const location = useLocation();
  const food = location.state?.food;
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = React.useState(
    food?.isAvailable || false
  );

  const deleteConfirmation = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item? This action cannot be undone."
    );
    if (confirmed) {
      deleteFood();
    }
  };

  const deleteFood = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
      await axios.delete(`http://localhost:6002/api/foods/${foodId}`, config);

      toast.success("Food deleted successfully!");
      navigate(`/restaurant/manage-menu/${food?.restaurant?._id}`);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="img"
          src={food?.imageUrl?.url}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: "18px",
            mt: 5,
          }}
        />

        <Typography
          sx={{
            fontFamily: "bold",
            fontSize: 24,
            mt: 1,
          }}
        >
          {food?.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            color: COLORS.gray,
            fontSize: 18,
            mt: 1,
          }}
        >
          {food?.description}
        </Typography>

        <Box sx={{ mt: 5, display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontFamily: "bold",
              fontSize: 18,
              mb: 2,
            }}
          >
            Options
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              mb: 1,
            }}
          >
            <RestaurantMenuOutlinedIcon
              sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                Food Availability
              </Typography>
              <Switch checked={isAvailable} />
            </Box>
          </Box>
        </Box>

        <Button
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: COLORS.red,
            fontFamily: "bold",
            color: COLORS.white,
            borderRadius: 3,
            fontSize: 20,
          }}
          onClick={() => deleteConfirmation()}
        >
          {"D E L E T E   F O O D".split(" ").join("\u00A0\u00A0\u00A0")}
        </Button>
      </Container>
    </Box>
  );
};

export default FoodMenuPage;
