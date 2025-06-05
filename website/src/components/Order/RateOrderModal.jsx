import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { COLORS } from "../../styles/theme";
import axios from "axios";
import { toast } from "react-toastify";
import { getUser } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const RateOrderModal = ({ open, onClose, order }) => {
  const user = getUser();
  const navigation = useNavigate();
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRating = async () => {
    setLoading(true);
    if (rating === 0) {
      setLoading(false);
      setRatingError(true);
      return;
    } else {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          await axios.post(
            `https://halalexpress.onrender.com/api/orders/rate`,
            { orderId: order?._id, stars: rating, feedback },
            config
          );

          toast.success(
            "Thank you for your feedback! Your rating has been submitted."
          );
          setLoading(false);
          navigation(`/order-page/${user?._id}`);
        } else {
          toast.error("You need to be logged in to rate an order.");
          setLoading(false);
        }
      } catch (error) {
        navigation(`/order-page/${user?._id}`);
        // toast.error(error.message);
        setLoading(false);
      }
    }
  };

  console.log(rating);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setRating(0);
        setRatingError(false);
        setFeedback("");
      }}
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontFamily: "bold", fontSize: 24 }}>
            Rate this Order
          </Typography>

          <Rating
            value={rating}
            onChange={(_, value) => {
              setRating(value);
              if (value > 0) setRatingError(false);
            }}
            sx={{
              "& .MuiRating-iconFilled": {
                color: COLORS.primary,
              },
              "& .MuiRating-iconEmpty": {
                color: COLORS.gray2,
              },
            }}
          />
        </Box>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 16,
            color: COLORS.gray,
            my: 2,
          }}
        >
          Please rate your order and leave a review. Your feedback is important
          to us. Thank you!
        </Typography>

        <TextField
          multiline
          fullWidth
          rows={3}
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: COLORS.offwhite,
              borderRadius: 3,
              "& fieldset": {
                borderColor: COLORS.gray2,
              },
              "&:hover fieldset": {
                borderColor: COLORS.secondary,
              },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.secondary,
              },
              "& input, & textarea": {
                fontFamily: "regular",
                fontSize: 16,
              },
              "& input::placeholder, & textarea::placeholder": {
                fontFamily: "regular",
                fontSize: 16,
              },
            },
            "& .MuiInputLabel-root": {
              fontFamily: "regular",
              fontSize: 16,
            },
          }}
        />

        {ratingError && (
          <Typography
            sx={{
              color: "red",
              fontFamily: "regular",
              fontSize: 14,
              mt: 1,
            }}
          >
            *Please rate your order before submitting.
          </Typography>
        )}

        <Button
          fullWidth
          onClick={() => {
            submitRating();
          }}
          sx={{
            mt: 2,
            bgcolor: COLORS.primary,
            color: "white",
            fontFamily: "bold",
            borderRadius: 3,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="white" />
          ) : (
            "S U B M I T"
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default RateOrderModal;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 8,
  p: 4,
};
