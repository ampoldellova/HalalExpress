import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AcceptOrder from "./screens/AcceptOrder";
import RiderDirection from "./screens/RiderDirection";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/accept-order/:orderId" element={<AcceptOrder />} />
        <Route
          path="/directions/:orderId/:riderId"
          element={<RiderDirection />}
        />
      </Routes>
    </Router>
  );
}

export default App;
