import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "./i18n"; // initialize i18next
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./Pages/HomePage.jsx";
import OrderPage from "./Pages/OrderPage.jsx";

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
