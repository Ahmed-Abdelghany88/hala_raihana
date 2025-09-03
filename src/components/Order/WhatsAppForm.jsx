import React, { useState } from "react";

export default function WhatsAppForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cakeSize, setCakeSize] = useState("18");
  const [file, setFile] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [error, setError] = useState("");

  // 🔑 Helper: get min delivery date (2 days from now)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split("T")[0]; // format YYYY-MM-DD
  };
  const businessNumber = "201065155248"; // Replace with actual business number
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate delivery date (must be 2+ days ahead)
    const today = new Date();
    const selectedDate = new Date(deliveryDate);
    const minDate = new Date();
    minDate.setDate(today.getDate() + 2);

    if (!deliveryDate || selectedDate < minDate) {
      setError("Delivery date must be at least 2 days from today.");
      return;
    } else {
      setError("");
    }

    let imageUrl = "";

    if (file) {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result;

        try {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64 }),
          });

          const data = await uploadRes.json();
          imageUrl = data.imageUrl || "";

          sendWhatsAppMessage(imageUrl);
        } catch (err) {
          console.error("Upload failed", err);
        }
      };
    } else {
      sendWhatsAppMessage("");
    }
  };

  const sendWhatsAppMessage = (imageUrl) => {
//     const whatsappText = `
// Hello, my name is ${name}.
// Phone: ${phone}
// Cake size: ${cakeSize} cm
// Delivery date: ${deliveryDate}
// ${imageUrl ? "Image: " + imageUrl : ""}
//     `;

   window.open(
  `https://wa.me/${businessNumber}?text='Hello, my name is ${name}. Phone: ${phone}. Cake size: ${cakeSize} cm. Delivery date: ${deliveryDate}. ${imageUrl ? "Image: " + imageUrl : ""}'`,
  "_blank"
);

  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "30%" , justifySelf: "center"}}
    >
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <div>
        <label>Cake size: </label>
        {["18", "20", "24", "26"].map((size) => (
          <label key={size} style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="cakeSize"
              value={size}
              checked={cakeSize === size}
              onChange={(e) => setCakeSize(e.target.value)}
            />
            {size} cm
          </label>
        ))}
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* 🔑 Date with min attribute */}
      <input
        type="date"
        value={deliveryDate}
        min={getMinDate()}
        onChange={(e) => setDeliveryDate(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Send to WhatsApp</button>
    </form>
  );
}
