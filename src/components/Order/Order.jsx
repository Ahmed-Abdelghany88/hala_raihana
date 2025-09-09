import React, { useState } from "react";
import "./Order.css";
import { useTranslation } from "react-i18next";

export default function Order() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState("");
  const [flavor, setFlavor] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  // Example pricing
  const flavors = [
    { name: "Chocolate", basePrice: 10 },
    { name: "Vanilla", basePrice: 12 },
    { name: "Strawberry", basePrice: 14 },
  ];
  const sizeMultipliers = { "18": 1, "20": 1.2, "24": 1.5, "26": 1.8 };

  const selectedFlavor = flavors.find((f) => f.name === flavor);
  const totalPrice =
    selectedFlavor && size
      ? selectedFlavor.basePrice * sizeMultipliers[size]
      : null;

  // 📌 Date restriction (max 3 days ahead)
  
  const getMinDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 3);
    return max.toISOString().split("T")[0];
  };

  // 📌 Upload image to Vercel Blob
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: reader.result }),
        });

        const data = await res.json();
        if (data.success) {
          setImageUrl(data.imageUrl);
        } else {
          console.error("Upload failed:", data.error);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    };
  };

  // 📌 Submit WhatsApp message
  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
      Name: ${name}
      Phone: ${phone}
      Size: ${size} cm
      Flavor: ${flavor}
      Date: ${deliveryDate}
      Price: ${totalPrice ? `$${totalPrice}` : "N/A"}
      ${imageUrl ? `Image: ${imageUrl}` : ""}
    `;

    const whatsappUrl = `https://wa.me/201234567890?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="order-layout">
      <form
        onSubmit={handleSubmit}
        className="order-form space-y-4 p-4 border rounded-md"
      >
        <h2 className="text-xl font-bold">{t("Order-title")}</h2>

        {/* Name */}
        <div>
          <label className="block">{t("Order-name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block">{t("Order-phone")}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block">{t("Order-size")}</label>
          <div className="flex gap-4">
            {["18", "20", "24", "26"].map((s) => (
              <label key={s} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={s}
                  checked={size === s}
                  onChange={(e) => setSize(e.target.value)}
                />
                {s} cm
              </label>
            ))}
          </div>
        </div>

        {/* Flavor */}
        <div>
          <label className="block">{t("Order-flavor")}</label>
          <div className="flex gap-4">
            {flavors.map((f) => (
              <label key={f.name} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={f.name}
                  checked={flavor === f.name}
                  onChange={(e) => setFlavor(e.target.value)}
                />
                {f.name}
              </label>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div>
          <label className="block">{t("Order-image")}</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && (
            <p className="text-green-600 text-sm mt-1">✅ Image uploaded</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block">{t("Order-date")}</label>
          <input
            type="date"
            value={deliveryDate}
            min={getMinDate()}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        {/* Price */}
        {size && (
          <h3 className="text-lg font-semibold mt-2">
            Price: {totalPrice ? `$${totalPrice}` : "Choose flavor"}
          </h3>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded w-full"
        >
          Submit Your Order
        </button>
      </form>
    </div>
  );
}
