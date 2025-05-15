import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AcceptOrder from "./screens/AcceptOrder";
import RiderDirection from "./screens/RiderDirection";

function App() {
  return (
    <Router>
      <Routes>
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
