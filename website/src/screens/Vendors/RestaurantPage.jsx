import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  Rating,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RestaurantInfoModal from "../../components/Vendors/RestaurantInfoModal";
import RestaurantFoods from "../../components/Foods/RestaurantFoods";
import RestaurantReviews from "../../components/Vendors/RestaurantReviews";

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
  black: "#242424",
  red: "#e81e4d",
  green: " #00C135",
  lightWhite: "#FAFAFC",
};

const RestaurantPage = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [restaurant, setRestaurant] = useState({});
  const restaurantId = useParams();

  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);

  const getRestaurant = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6002/api/restaurant/byId/${restaurantId.id}`
      );
      setRestaurant(response.data.data);
    } catch (error) {
      console.log("Error fetching restaurant:", error);
    }
  };

  useEffect(() => {
    getRestaurant();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        bgColor: COLORS.offwhite,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: "100%",
        }}
      >
        <Grid2 container sx={{ alignItems: "center", mt: 5, mb: 5 }}>
          <Box
            component="img"
            src={restaurant?.logoUrl?.url}
            sx={{ height: 150, width: 150, borderRadius: 2, mr: 3 }}
          />
          <Box sx={{ width: "80%" }}>
            <Grid2 container spacing={3} sx={{ alignItems: "center" }}>
              <Typography
                sx={{ fontFamily: "bold", color: COLORS.black, fontSize: 34 }}
              >
                {restaurant?.title}
              </Typography>
              <Button
                onClick={() => setOpenInfo(true)}
                variant="outlined"
                startIcon={<InfoOutlinedIcon />}
                color={COLORS.primary}
                sx={{
                  textTransform: "none",
                  fontFamily: "regular",
                  fontSize: 14,
                  borderRadius: 3,
                  ml: "auto",
                }}
              >
                More Info
              </Button>
            </Grid2>

            <Grid2 container spacing={3} sx={{ alignItems: "center" }}>
              <Box>
                {restaurant?.delivery ? (
                  <Grid2 container sx={{ alignItems: "center" }}>
                    <DeliveryDiningOutlinedIcon
                      sx={{ fontSize: 20, color: COLORS.gray, mr: 1 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                      }}
                    >
                      Available for delivery
                    </Typography>
                  </Grid2>
                ) : (
                  <Grid2 container sx={{ alignItems: "center" }}>
                    <BlockOutlinedIcon
                      sx={{ fontSize: 20, color: COLORS.gray, mr: 1 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                      }}
                    >
                      Not available for delivery
                    </Typography>
                  </Grid2>
                )}
              </Box>

              <Box>
                {restaurant?.pickup ? (
                  <Grid2 container sx={{ alignItems: "center" }}>
                    <Inventory2OutlinedIcon
                      sx={{ fontSize: 20, color: COLORS.gray, mr: 1 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                      }}
                    >
                      Available for PickUp
                    </Typography>
                  </Grid2>
                ) : (
                  <Grid2 container sx={{ alignItems: "center" }}>
                    <Inventory2OutlinedIcon
                      sx={{ fontSize: 20, color: COLORS.gray, mr: 1 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                      }}
                    >
                      Not available for PickUp
                    </Typography>
                  </Grid2>
                )}
              </Box>
            </Grid2>

            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating
                  name="simple-controlled"
                  key={restaurant?.rating}
                  value={restaurant?.rating}
                  precision={0.2}
                  readOnly
                  size="medium"
                  sx={{ color: COLORS.secondary, mr: 1 }}
                />
                <Typography
                  sx={{
                    fontFamily: "regular",
                    color: COLORS.gray,
                    fontSize: 14,
                  }}
                >
                  {restaurant?.ratingCount} reviews
                </Typography>
              </Box>

              <Button
                onClick={() => setOpenReviews(true)}
                variant="outlined"
                color={COLORS.primary}
                sx={{
                  textTransform: "none",
                  fontFamily: "regular",
                  fontSize: 14,
                  borderRadius: 3,
                  ml: "auto",
                }}
              >
                See Reviews
              </Button>
            </Box>
          </Box>
        </Grid2>

        <Divider />

        <Box sx={{ px: 2, mb: 5 }}>
          <Typography
            sx={{
              fontFamily: "bold",
              color: COLORS.black,
              fontSize: 24,
              mt: 3,
            }}
          >
            Available Foods
          </Typography>
          <RestaurantFoods restaurantId={restaurantId.id} />
        </Box>
      </Box>

      <RestaurantInfoModal
        open={openInfo}
        onClose={handleCloseInfo}
        restaurantId={restaurantId.id}
      />

      <RestaurantReviews
        open={openReviews}
        onClose={() => setOpenReviews(false)}
        restaurantId={restaurantId.id}
      />
    </Container>
  );
};

export default RestaurantPage;
