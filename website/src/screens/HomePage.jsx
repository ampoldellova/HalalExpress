import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import Lottie from "lottie-react";
import vegetables from "../assets/anime/vegetables.json";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Restaurants from "../components/Vendors/Restaurants";
import Foods from "../components/Foods/Foods";
import Categories from "../components/Categories/Categories";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import axios from "axios";
import CategoryFoods from "../components/Categories/CategoryFoods";
import Loader from "../components/Loader";
import { getUser } from "../utils/helpers";
import ProductCategories from "../components/Categories/ProductCategories";
import CategoryProducts from "../components/Categories/CategoryProducts";
import Products from "../components/Products/Products";
import Suppliers from "../components/Suppliers/Suppliers";
import mockup from "../assets/images/mockup.png";

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

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [foods, setFoods] = useState([]);
  const [products, setProducts] = useState([]);
  const [foodsLoaded, setFoodsLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [restaurants, setRestaurants] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [restaurantsLoaded, setRestaurantsLoaded] = React.useState(false);
  const [suppliersLoaded, setSuppliersLoaded] = React.useState(false);
  const [loader, setLoader] = React.useState(true);
  const user = getUser();

  const getSuppliers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token && user.userType === "Vendor") {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `http://localhost:6002/api/supplier/list`,
          config
        );
        setSuppliers(response.data);
        setSuppliersLoaded(true);
      } else {
        setSuppliersLoaded(true);
      }
    } catch (error) {
      console.log("Error fetching restaurants:", error);
    }
  };

  const getRestaurants = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6002/api/restaurant/list`
      );
      setRestaurants(response.data);
      setFoodsLoaded(true);
    } catch (error) {
      console.log("Error fetching restaurants:", error);
    }
  };

  const getFoods = async () => {
    try {
      const response = await axios.get(`http://localhost:6002/api/foods/list`);
      setFoods(response.data);
      setRestaurantsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token && user.userType === "Vendor") {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `http://localhost:6002/api/ingredients/list`,
          config
        );
        setProducts(response.data);
        setProductsLoaded(true);
      } else {
        setProductsLoaded(true);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (restaurantsLoaded && foodsLoaded && productsLoaded && suppliersLoaded) {
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    }
  }, [restaurantsLoaded, foodsLoaded, productsLoaded, suppliersLoaded]);

  useEffect(() => {
    getProducts();
    getFoods();
    getRestaurants();
    getSuppliers();
    if (selectedCategory) {
      const filteredFoods = foods.filter(
        (food) => food.category._id === selectedCategory
      );
      const filteredProducts = products.filter(
        (product) => product.category._id === selectedCategory
      );
      setFilteredFoods(filteredFoods);
      setFilteredProducts(filteredProducts);
    } else {
      setFilteredFoods(foods);
      setFilteredProducts(products);
    }
  }, [selectedCategory, foods, products]);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          <>
            <Box sx={styles.container}>
              <Grid2 container spacing={5} sx={styles.grid}>
                <Box>
                  <Typography sx={styles.title}>
                    Welcome to HalalExpress!
                  </Typography>
                  <Typography sx={styles.subTitle}>
                    We deliver certified halal foods and products right to your
                    doorstep. Enjoy a wide variety of halal options, ensuring
                    quality and authenticity in every order.
                  </Typography>
                  <TextField
                    sx={{ mt: 3 }}
                    fullWidth
                    placeholder="Search for food..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: COLORS.primary,
                              color: COLORS.white,
                              borderRadius: 2,
                              textTransform: "none",
                              fontFamily: "regular",
                            }}
                          >
                            Find food
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box sx={styles.vegetables}>
                  <Lottie
                    animationData={vegetables}
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              </Grid2>
            </Box>

            <Container maxWidth="lg" sx={{ height: "100vh" }}>
              {user.userType === "Vendor" ? (
                <ProductCategories
                  setSelectedCategory={setSelectedCategory}
                  setSelectedSection={setSelectedSection}
                  setSelectedValue={setSelectedValue}
                />
              ) : (
                <Categories
                  setSelectedCategory={setSelectedCategory}
                  setSelectedSection={setSelectedSection}
                  setSelectedValue={setSelectedValue}
                />
              )}

              {selectedCategory ? (
                <>
                  <Grid2
                    container
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: COLORS.black,
                        fontSize: 24,
                        fontFamily: "bold",
                      }}
                    >
                      {user.userType === "Vendor"
                        ? `Product(s) in ${selectedValue}`
                        : `Food(s) in ${selectedValue}`}
                    </Typography>
                    <FastfoodIcon
                      sx={{ fontSize: 24, color: COLORS.secondary }}
                    />
                  </Grid2>
                  {user.userType === "Vendor" ? (
                    <CategoryProducts products={filteredProducts} />
                  ) : (
                    <CategoryFoods foods={filteredFoods} />
                  )}
                </>
              ) : (
                <>
                  {user.userType === "Vendor" ? (
                    <>
                      <Suppliers suppliers={suppliers} />
                      <Divider sx={{ mt: 5 }} />
                      <Products products={products} />
                    </>
                  ) : (
                    <>
                      <Restaurants restaurants={restaurants} />
                      <Divider sx={{ mt: 5 }} />
                      <Foods foods={foods} />
                    </>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 5,
                      gap: 5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 3,
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={mockup}
                        sx={{ width: "500px", zIndex: 1 }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          height: 450,
                          width: 450,
                          backgroundColor: COLORS.primary,
                          borderRadius: 999,
                          mt: 5,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          mt: 2,
                          fontFamily: "bold",
                          color: COLORS.black,
                          fontSize: 44,
                          lineHeight: 1.2,
                        }}
                      >
                        Experience HalalExpress on your mobile device.
                      </Typography>
                      <Typography
                        sx={{
                          mt: 2,
                          fontFamily: "regular",
                          color: COLORS.gray,
                          fontSize: 18,
                        }}
                      >
                        Discover a wide variety of halal food options at your
                        fingertips. Order online and enjoy fast, reliable
                        delivery straight to your door. HalalExpress is your
                        go-to platform for all things halal.
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Container>
          </>
        </>
      )}
    </>
  );
};

export default HomePage;

const styles = {
  container: {
    bgcolor: COLORS.offwhite,
    height: 600,
  },
  grid: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: COLORS.black,
    textAlign: "left",
    fontFamily: "bold",
    fontSize: 35,
  },
  subTitle: {
    color: COLORS.gray,
    textAlign: "left",
    fontFamily: "regular",
    fontSize: 15,
    width: 500,
  },
  vegetables: {
    width: 600,
    height: 600,
  },
};
