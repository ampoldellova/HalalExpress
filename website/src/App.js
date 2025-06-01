import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./screens/HomePage";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { getUser } from "./utils/helpers";
import RestaurantPage from "./screens/Vendors/RestaurantPage";
import SupplierPage from "./screens/Suppliers/SupplierPage";
import Profile from "./screens/User/Profile";
import CheckOutPage from "./screens/CheckOutPage";
import OrderPage from "./screens/Order/OrderPage";
import OrderDetails from "./screens/Order/OrderDetails";
import PaymentConfirmation from "./screens/PaymentConfirmation";
import VerificationPage from "./screens/User/VerificationPage";
import Footer from "./components/Footer";
import { useState } from "react";
import Conversations from "./components/Chat/Conversations";
import ChatButton from "./components/Chat/ChatButton";
import Stores from "./screens/Suppliers/Stores";
import Restaurants from "./screens/Vendors/Restaurants";
import UserRestaurantPage from "./screens/Vendors/UserRestaurantPage";

function App() {
  const user = getUser();
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/restaurants/:id" element={<Restaurants />} />
          <Route
            path="/restaurants/restaurant/:restaurantId"
            element={<UserRestaurantPage />}
          />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/stores/:id" element={<Stores />} />
          <Route path="/supplier/:id" element={<SupplierPage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/checkout/:id" element={<CheckOutPage />} />
          <Route path="/order-page/:id" element={<OrderPage />} />
          <Route path="/order-detail/:id" element={<OrderDetails />} />
          <Route
            path="/payment-confirmation"
            element={<PaymentConfirmation />}
          />
        </Routes>

        {user ? (
          <>
            {openChat ? (
              <Conversations onClose={() => setOpenChat(false)} />
            ) : (
              <ChatButton onClick={() => setOpenChat(true)} />
            )}
          </>
        ) : null}
        <Footer />
      </Router>
      <ToastContainer position="top-center" stacked limit={5} />
    </div>
  );
}

export default App;
