import { Box, Container, Rating, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import Loader from "../../components/Loader";

const Stores = () => {
  const userId = useParams().id;
  const navigate = useNavigate();
  const [stores, setStores] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getSupplierStoresByOwner = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios(
          `http://localhost:6002/api/supplier/owner/${userId}`,
          config
        );
        setStores(response.data.data);
        setLoading(false);
      } else {
        console.log("Authentication token not found");
      }
    } catch (err) {
      console.error("Error fetching user supplier stores:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getSupplierStoresByOwner();
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
              Your Stores
            </Typography>

            {stores?.length > 0 ? (
              <>
                {stores?.map((store) => (
                  <Box
                    key={store?._id}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "18px",
                      cursor: "pointer",
                      mb: 2,
                    }}
                    onClick={() => {
                      navigate(`/stores/store/${store?._id}`, {
                        state: { store },
                      });
                    }}
                  >
                    <Box
                      component="img"
                      src={store?.imageUrl?.url}
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
                        src={store?.logoUrl?.url}
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
                          {store?.title}
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
                              backgroundColor: store?.isAvailable
                                ? COLORS.primary
                                : COLORS.secondary,
                              color: COLORS.white,
                            }}
                          >
                            {store?.isAvailable ? "Open" : "Closed"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Rating value={store?.rating} readOnly />
                          <Typography
                            sx={{
                              fontFamily: "regular",
                              fontSize: 14,
                              color: COLORS.gray,
                            }}
                          >
                            {store?.ratingCount} reviews
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

export default Stores;
