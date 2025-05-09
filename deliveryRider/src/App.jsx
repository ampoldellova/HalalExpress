import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AcceptOrder from "./screens/AcceptOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/accept-order/:orderId" element={<AcceptOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
