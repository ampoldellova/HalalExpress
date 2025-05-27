import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser } from "../../utils/helpers";
import { createRefund, retrieveRefund } from "../../hook/paymongoService";

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

const CancelOrderModal = ({ open, onClose, order }) => {
  const user = getUser();
  const navigate = useNavigate();
  const [notes, setNotes] = React.useState("");
  const [notesError, setNotesError] = React.useState(false);

  const cancelOrder = async () => {
    if (!notes) {
      setNotesError(true);
    } else {
      try {
        const token = await sessionStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          if (
            order.paymentStatus === "Paid" &&
            order.paymentMethod === "gcash" &&
            order.orderStatus === "Pending"
          ) {
            const amount = order.subTotal * 100;
            const paymentId = order.paymentId;
            const refundPayment = await createRefund(amount, notes, paymentId);
            console.log(refundPayment);
            if (refundPayment.data.attributes.status === "pending") {
              await axios.post(
                "http://localhost:6002/api/orders/cancel",
                { orderId: order._id },
                config
              );
              onClose();
              navigate(`/order-page/${user._id}`);
              toast.success("Order cancelled successfully");
            } else {
              throw new Error("Failed to process refund");
            }
          } else {
            toast.error(
              "You cannot cancel this order as it is not in a cancellable state"
            );
          }
        } else if (
          order.paymentStatus === "Pending" &&
          order.orderStatus === "Pending"
        ) {
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };
          await axios.post(
            "http://localhost:6002/api/orders/cancel",
            { orderId: order._id },
            config
          );
          onClose();
          navigate(`/order-page/${user._id}`);
          toast.success("Order cancelled successfully");
        } else {
          toast.error("You must be logged in to cancel your order");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setNotes("");
        setNotesError(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{ fontFamily: "bold", fontSize: 24 }}>
          Cancel this order?
        </Typography>
        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 16,
            color: COLORS.gray,
            mt: 2,
          }}
        >
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </Typography>

        <TextField
          multiline
          fullWidth
          rows={4}
          placeholder="Add your note here..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setNotesError(false);
          }}
          InputProps={{
            sx: {
              fontFamily: "regular",
              fontSize: 16,
            },
          }}
          sx={{
            marginTop: 2,
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
            },
            "& .MuiInputLabel-root": {
              fontFamily: "regular",
              fontSize: 16,
            },
          }}
        />
        {notesError && (
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 14,
              color: COLORS.red,
              mt: 1,
            }}
          >
            *Please provide a note for cancellation
          </Typography>
        )}

        <Button
          onClick={cancelOrder}
          fullWidth
          sx={{
            mt: 2,
            bgcolor: COLORS.primary,
            color: COLORS.white,
            textTransform: "none",
            fontFamily: "bold",
            borderRadius: 8,
          }}
        >
          {"C A N C E L   O R D E R".split(" ").join("\u00A0\u00A0\u00A0")}
        </Button>
      </Box>
    </Modal>
  );
};

export default CancelOrderModal;

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
