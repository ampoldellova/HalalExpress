import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AcceptOrder from "./screens/AcceptOrder";
import RiderDirection from "./screens/RiderDirection";
import HomeScreen from "./screens/HomeScreen";
import ConfirmPayment from "./screens/ConfirmPayment";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/accept-order/:orderId" element={<AcceptOrder />} />
          <Route
            path="/directions/:orderId/:riderId"
            element={<RiderDirection />}
          />
          <Route
            path="/confirm-payment/:orderId"
            element={<ConfirmPayment />}
          />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
