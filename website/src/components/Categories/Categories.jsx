import { Box, Grid2, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

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

const Categories = ({
  setSelectedCategory,
  setSelectedSection,
  setSelectedValue,
}) => {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  const getCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:6002/api/category`);
      setCategories(response.data);
    } catch (error) {
      console.log("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSelectedCategory = (item) => {
    if (selected == item.value) {
      setSelectedCategory(null);
      setSelected(null);
      setSelectedSection(null);
      setSelectedValue(null);
    } else {
      setSelectedCategory(item._id);
      setSelected(item.value);
      setSelectedSection("category");
      setSelectedValue(item.title);
    }
  };

  return (
    <Grid2
      container
      spacing={3}
      sx={{
        mt: 5,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {categories.map((category) => (
        <Grid2 xs={12} sm={6} md={4} key={category._id}>
          <Box
            component="img"
            onClick={() => handleSelectedCategory(category)}
            sx={{
              height: 60,
              width: 60,
              display: "flex",
              margin: "0 auto",
              borderRadius: 99,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor:
                category.value === selected ? COLORS.secondary : "transparent",
              cursor: "pointer",
            }}
            src={category.imageUrl.url}
          />
          <Typography
            sx={{
              color: COLORS.black,
              fontSize: 14,
              fontFamily: "regular",
              textAlign: "center",
              mt: 1,
            }}
          >
            {category.title}
          </Typography>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default Categories;
