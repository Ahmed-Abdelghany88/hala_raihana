import React from "react";
import "./i18n"; // initialize i18next
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Order from "./components/Order/Order.jsx";
function App() {

  return (
    <div className="p-6">
      <Navbar />
      <Order />
    </div>
  );
}

export default App;
