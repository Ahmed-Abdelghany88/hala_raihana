import React from "react";
import "./i18n"; // initialize i18next
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import WhatsAppForm from "./components/Order/WhatsAppForm.jsx";
function App() {

  return (
    <div className="p-6">
      <Navbar />
      <WhatsAppForm />
      <Header />
    </div>
  );
}

export default App;
