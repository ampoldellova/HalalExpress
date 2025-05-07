import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AcceptOrder from "../screens/AcceptOrder";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/accept-order" element={<AcceptOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
