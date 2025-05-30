import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../../styles/theme";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";

const ChatButton = ({ onClick }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 3,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: 1000,
        paddingX: 2,
        height: 60,
        gap: 1,
      }}
      onClick={() => onClick()}
    >
      <Typography sx={{ color: COLORS.white, fontFamily: "bold" }}>
        Chats
      </Typography>
      <InsertCommentOutlinedIcon size={30} sx={{ color: COLORS.white }} />
    </Box>
  );
};

export default ChatButton;
