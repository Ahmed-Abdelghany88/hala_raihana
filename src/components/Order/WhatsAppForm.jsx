import React, { useState } from "react";

const WhatsAppForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cakeSize, setCakeSize] = useState("");
  const [file, setFile] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [error, setError] = useState("");

  // Helper: convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validate delivery date ---
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
  try {
    const base64 = await fileToBase64(file);

    console.log("🔍 Base64 length:", base64.length); // Debug

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64 }),
    });

    const data = await uploadRes.json();
    console.log("🔍 Upload response:", data); // Debug

    if (data.imageUrl) {
      imageUrl = data.imageUrl;
    } else {
      console.error("❌ No imageUrl returned:", data);
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
  }
}

    // --- Build WhatsApp message ---
    const whatsappText = `
Hello, my name is ${name}.
Phone: ${phone}
Cake size: ${cakeSize} cm
Delivery date: ${deliveryDate}
${imageUrl ? "Image: " + imageUrl : ""}
    `;

    // Replace with your business WhatsApp number (international format, no +, no 00)
    const businessNumber = "201065155248";

    window.open(
      `https://wa.me/${businessNumber}?text=${encodeURIComponent(
        whatsappText
      )}`,
      "_blank"
    );
  };

  // --- Set min delivery date (2 days from today) ---
  const today = new Date();
  const minDeliveryDate = new Date();
  minDeliveryDate.setDate(today.getDate() + 2);
  const minDateStr = minDeliveryDate.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Cake Size</label>
        <div className="flex gap-4">
          {["18", "20", "24", "26"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="radio"
                value={size}
                checked={cakeSize === size}
                onChange={(e) => setCakeSize(e.target.value)}
                required
              />
              {size} cm
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1">Upload Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Delivery Date</label>
        <input
          type="date"
          value={deliveryDate}
          required
          min={minDateStr}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="border p-2 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send on WhatsApp
      </button>
    </form>
  );
};

export default WhatsAppForm;
