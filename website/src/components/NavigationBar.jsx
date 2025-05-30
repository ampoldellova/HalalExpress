import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import logo from "../assets/images/icon.png";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge, Container, Drawer, Grid2, Menu, MenuItem } from "@mui/material";
import { getToken, getUser, logout } from "../utils/helpers";
import SignUpModal from "./Users/SignUpModal";
import LoginModal from "./Users/LoginModal";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useNavigate } from "react-router-dom";
import CartDrawer from "./Cart/CartDrawer";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

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

export default function NavigationBar() {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openCart, setOpenCart] = React.useState(false);
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [cart, setCart] = React.useState([]);

  const toggleCart = (newOpen) => () => {
    setOpenCart(newOpen);
  };

  const token = getToken();
  const user = getUser();

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);

  const getCartItems = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `http://localhost:6002/api/cart/`,
          config
        );
        setCart(response.data.cart);
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    navigate("/");
    toast.success("Logged out successfully!");
    logout(() => {});
  };

  const cartDrawerElement = <CartDrawer onClick={toggleCart(false)} />;

  useEffect(() => {
    getCartItems();
  }, [cart]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: COLORS.white }}>
        <Container maxWidth="xl">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => navigate("/")}
            >
              <Box component="img" src={logo} sx={{ height: 40, width: 40 }} />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: COLORS.primary,
                fontFamily: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              HalalExpress
            </Typography>
            {token && user ? (
              <>
                <Grid2 container spacing={4}>
                  <Button
                    color="inherit"
                    onClick={handleOpenUserMenu}
                    sx={{ textTransform: "none" }}
                  >
                    <Person2OutlinedIcon sx={styles.userIcon} />
                    <Typography sx={styles.userName}>
                      {user.username.split(" ").slice(0, 2).join(" ")}
                    </Typography>
                    {anchorElUser ? (
                      <ArrowDropUpOutlinedIcon sx={{ color: COLORS.black }} />
                    ) : (
                      <ArrowDropDownOutlinedIcon sx={{ color: COLORS.black }} />
                    )}
                  </Button>
                  <IconButton color="inherit" onClick={toggleCart(true)}>
                    {cart?.cartItems?.length > 0 ? (
                      <Badge
                        badgeContent={cart?.cartItems?.length}
                        color="primary"
                      >
                        <LocalMallOutlinedIcon sx={styles.cartIcon} />
                      </Badge>
                    ) : (
                      <LocalMallOutlinedIcon sx={styles.cartIcon} />
                    )}
                  </IconButton>
                </Grid2>
                <Menu
                  keepMounted
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  sx={{ mt: "45px", borderRadius: 15 }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {(user.userType === "Vendor" ||
                    user.userType === "Supplier") && (
                    <MenuItem
                      onClick={() => {
                        navigate("/admin/dashboard");
                        handleCloseUserMenu();
                      }}
                    >
                      <SupervisorAccountOutlinedIcon
                        sx={{ color: COLORS.gray }}
                      />
                      <Typography sx={styles.menuItemText}>
                        Dashboard
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      navigate(`/profile/${user._id}`);
                      handleCloseUserMenu();
                    }}
                  >
                    <Person2OutlinedIcon sx={{ color: COLORS.gray }} />
                    <Typography sx={styles.menuItemText}>Profile</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate(`/order-page/${user._id}`);
                      handleCloseUserMenu();
                    }}
                  >
                    <ReceiptLongOutlinedIcon sx={{ color: COLORS.gray }} />
                    <Typography sx={styles.menuItemText}>Orders</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ color: COLORS.gray }} />
                    <Typography sx={styles.menuItemText}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Grid2 container spacing={4}>
                  <Button
                    onClick={handleOpenLogin}
                    variant="outlined"
                    sx={styles.loginBtn}
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={handleOpenSignUp}
                    variant="contained"
                    sx={styles.signUpBtn}
                  >
                    Sign Up
                  </Button>
                  <IconButton color="inherit" onClick={toggleCart(true)}>
                    <LocalMallOutlinedIcon sx={styles.cartIcon} />
                  </IconButton>
                </Grid2>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Login Modal */}
      <LoginModal
        open={openLogin}
        onClose={handleCloseLogin}
        signUp={handleOpenSignUp}
      />

      {/* SignUp Modal */}
      <SignUpModal open={openSignUp} onClose={handleCloseSignUp} />

      <Drawer anchor="right" open={openCart} onClose={toggleCart(false)}>
        {cartDrawerElement}
      </Drawer>
    </Box>
  );
}

const styles = {
  cartIcon: {
    color: COLORS.gray,
  },
  userIcon: {
    color: COLORS.black,
    mr: 1,
  },
  userName: {
    color: COLORS.black,
    fontFamily: "light",
    mr: 0.5,
  },
  menuItemText: {
    textAlign: "left",
    fontFamily: "regular",
    color: COLORS.gray,
    ml: 1,
  },
  loginBtn: {
    borderColor: COLORS.gray,
    borderRadius: 3,
    textTransform: "none",
    fontFamily: "regular",
    color: COLORS.gray,
  },
  signUpBtn: {
    borderRadius: 3,
    textTransform: "none",
    fontFamily: "regular",
    backgroundColor: COLORS.primary,
  },
};
