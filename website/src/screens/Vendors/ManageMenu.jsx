import { Box, Container, Grid2, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { COLORS } from "../../styles/theme";

const ManageMenu = () => {
  const [foods, setFoods] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const restaurantId = useParams().restaurantId;

  const fetchRestaurantFoods = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/foods/restaurant/${restaurantId}`,
          {},
          config
        );
        setFoods(response.data);
        setLoading(false);
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.error("Error fetching restaurant foods:", error);
      toast.error("Failed to fetch restaurant foods. Please try again later.");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRestaurantFoods();
  }, [restaurantId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ height: "100vh" }}>
          <Container maxWidth="sm">
            <Typography
              sx={{
                textAlign: "center",
                marginTop: "20px",
                fontFamily: "bold",
                fontSize: 30,
                mb: 2,
              }}
            >
              Manage Menu
            </Typography>

            <Grid2
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {foods.map((food) => (
                <Grid2 item xs={12} key={food?._id} sx={{ cursor: "pointer" }}>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: COLORS.gray2,
                      width: 200,
                      padding: 1,
                      borderRadius: 5,
                      "&&:hover": {
                        backgroundColor: COLORS.offwhite,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={food?.imageUrl?.url}
                      sx={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 3,
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily: "bold",
                        color: COLORS.black,
                        fontSize: 16,
                        mt: 1,
                      }}
                    >
                      {food?.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "regular",
                          color: COLORS.gray,
                          fontSize: 14,
                        }}
                      >
                        Availability:
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "bold",
                          color: COLORS.white,
                          backgroundColor: food?.isAvailable
                            ? COLORS.primary
                            : COLORS.secondary,
                          px: 1,
                          borderRadius: 3,
                          fontSize: 14,
                        }}
                      >
                        {food?.isAvailable ? "Available" : "Unavailable"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </Box>
      )}
    </>
  );
};

export default ManageMenu;
