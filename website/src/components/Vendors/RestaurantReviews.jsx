import { Box, Modal, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../styles/theme";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import empty from "../../assets/anime/emptyOrders.json";
import Lottie from "lottie-react";

const RestaurantReviews = ({ open, onClose, restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const fetchRestaurantReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:6002/api/orders/${restaurantId}/reviews`
      );

      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const getTimeDifference = (date) => {
    const now = new Date();
    const createdAt = new Date(date);

    const years = differenceInYears(now, createdAt);
    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;

    const months = differenceInMonths(now, createdAt);
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;

    const days = differenceInDays(now, createdAt);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

    return "Today";
  };

  useEffect(() => {
    if (open) {
      fetchRestaurantReviews();
    }
  }, [open, restaurantId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {reviews === undefined ? (
          <>
            <Typography
              sx={{
                fontFamily: "bold",
                position: "sticky",
                fontSize: 24,
                top: 0,
                zIndex: 1,
                p: 2,
                backgroundColor: COLORS.white,
              }}
            >
              Reviews
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Lottie
                animationData={empty}
                loop={true}
                style={{ width: 300, height: 300 }}
              />
              <Typography
                sx={{
                  fontFamily: "regular",
                  color: COLORS.gray,
                  fontSize: 16,
                }}
              >
                No reviews yet.
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography
              sx={{
                fontFamily: "bold",
                position: "sticky",
                fontSize: 24,
                top: 0,
                zIndex: 1,
                p: 2,
                backgroundColor: COLORS.white,
              }}
            >
              Reviews
            </Typography>

            <Box sx={{ px: 2 }}>
              {reviews?.map((review) => (
                <Box
                  key={review?.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 5,
                    backgroundColor: COLORS.offwhite,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      sx={{ width: 40, height: 40, borderRadius: "50%" }}
                      src={review?.userId?.profile?.url}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontFamily: "bold", fontSize: 18 }}>
                        {review?.userId?.username}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                          name="read-only"
                          value={review?.rating?.stars}
                          readOnly
                          size="small"
                        />
                        <Typography
                          sx={{
                            fontFamily: "regular",
                            color: COLORS.gray,
                            fontSize: 14,
                          }}
                        >
                          - {getTimeDifference(review?.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {review?.rating?.feedback && (
                    <Typography
                      sx={{ fontFamily: "regular", fontSize: 14, mt: 2 }}
                    >
                      {review?.rating?.feedback}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      overflow: "auto",
                      display: "flex",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    {review?.orderItems.map((item) => (
                      <Box
                        key={item?._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 2,
                          border: `1px solid ${COLORS.gray2}`,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            width: 100,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "bold",
                              fontSize: 14,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item?.foodId?.title}
                          </Typography>
                          <Typography
                            sx={{ fontFamily: "regular", fontSize: 14 }}
                          >
                            ₱ {(item?.foodId?.price).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          component="img"
                          sx={{
                            width: 60,
                            height: "100%",
                            objectFit: "cover",
                            borderTopRightRadius: 7,
                            borderBottomRightRadius: 7,
                          }}
                          src={item?.foodId?.imageUrl?.url}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default RestaurantReviews;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 5,
  width: 500,
  height: 500,
  overflowY: "auto",
};
