import { Box, Container, Rating, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import Loader from "../../components/Loader";

const Restaurants = () => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const userId = useParams().id;

  const getRestaurantsByOwner = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `http://localhost:6002/api/restaurant/owner/${userId}`,
          config
        );
        setRestaurants(response.data.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        console.log("Authentication token not found");
      }
    } catch (err) {
      console.error("Error fetching user restaurants:", err);
    }
  };

  React.useEffect(() => {
    getRestaurantsByOwner();
  }, [userId]);

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
              Your Restaurants
            </Typography>

            {restaurants?.length > 0 ? (
              <>
                {restaurants?.map((restaurant) => (
                  <Box
                    key={restaurant?._id}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "18px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/restaurants/restaurant/${restaurant?._id}`, {
                        state: { restaurant },
                      });
                    }}
                  >
                    <Box
                      component="img"
                      src={restaurant?.imageUrl?.url}
                      sx={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: "18px 18px 0 0",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        mt: -6,
                      }}
                    >
                      <Box
                        component="img"
                        src={restaurant?.logoUrl?.url}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 99,
                          ml: 1,
                          border: "2px solid white",
                        }}
                      />
                      <Box sx={{ width: "100%", padding: 2, mt: 5 }}>
                        <Typography sx={{ fontFamily: "bold", fontSize: 18 }}>
                          {restaurant?.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "regular",
                              fontSize: 14,
                              color: COLORS.gray,
                            }}
                          >
                            Service Availability:
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "bold",
                              fontSize: 14,
                              px: 1,
                              borderRadius: 4,
                              backgroundColor: restaurant?.isAvailable
                                ? COLORS.primary
                                : COLORS.secondary,
                              color: COLORS.white,
                            }}
                          >
                            {restaurant?.isAvailable ? "Open" : "Closed"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Rating value={restaurant?.rating} readOnly />
                          <Typography
                            sx={{
                              fontFamily: "regular",
                              fontSize: 14,
                              color: COLORS.gray,
                            }}
                          >
                            {restaurant?.ratingCount} reviews
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <Typography
                sx={{ textAlign: "center", marginTop: "20px" }}
                variant="body1"
              >
                No restaurants found.
              </Typography>
            )}
          </Container>
        </Box>
      )}
    </>
  );
};

export default Restaurants;
