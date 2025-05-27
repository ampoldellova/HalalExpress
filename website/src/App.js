import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./screens/HomePage";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./screens/Admin/Dashboard";
import { getUser } from "./utils/helpers";
import RestaurantPage from "./screens/Vendors/RestaurantPage";
import SupplierPage from "./screens/Suppliers/SupplierPage";
import Profile from "./screens/User/Profile";
import CheckOutPage from "./screens/CheckOutPage";
import OrderPage from "./screens/Order/OrderPage";
import OrderDetails from "./screens/Order/OrderDetails";
import PaymentConfirmation from "./screens/PaymentConfirmation";

function App() {
  const user = getUser();

  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
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
      </Router>
      <ToastContainer position="top-center" stacked limit={5} />
    </div>
  );
}

export default App;
