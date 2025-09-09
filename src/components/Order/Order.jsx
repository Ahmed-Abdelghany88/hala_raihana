import React, { useState } from "react";
import "./Order.css";
import { useTranslation } from "react-i18next";

export default function OrderForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState("");
  const [flavor, setFlavor] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  // Example pricing + demo images
  const flavors = [
    {
      name: "Chocolate",
      basePrice: 10,
      images: {
        "18": "https://via.placeholder.com/250/8B4513?text=Choco+18",
        "20": "https://via.placeholder.com/250/8B4513?text=Choco+20",
        "24": "https://via.placeholder.com/250/8B4513?text=Choco+24",
        "26": "https://via.placeholder.com/250/8B4513?text=Choco+26",
      },
    },
    {
      name: "Vanilla",
      basePrice: 12,
      images: {
        "18": "https://via.placeholder.com/250/F3E5AB?text=Vanilla+18",
        "20": "https://via.placeholder.com/250/F3E5AB?text=Vanilla+20",
        "24": "https://via.placeholder.com/250/F3E5AB?text=Vanilla+24",
        "26": "https://via.placeholder.com/250/F3E5AB?text=Vanilla+26",
      },
    },
    {
      name: "Strawberry",
      basePrice: 14,
      images: {
        "18": "https://via.placeholder.com/250/FFB6C1?text=Straw+18",
        "20": "https://via.placeholder.com/250/FFB6C1?text=Straw+20",
        "24": "https://via.placeholder.com/250/FFB6C1?text=Straw+24",
        "26": "https://via.placeholder.com/250/FFB6C1?text=Straw+26",
      },
    },
  ];

  const sizeMultipliers = { "18": 1, "20": 1.2, "24": 1.5, "26": 1.8 };

  const selectedFlavor = flavors.find((f) => f.name === flavor);
  const previewImage =
    selectedFlavor && size ? selectedFlavor.images[size] : null;

  const totalPrice =
    selectedFlavor && size
      ? selectedFlavor.basePrice * sizeMultipliers[size]
      : null;

  // 📌 Date restriction (max 3 days ahead)
  const getMinDate = () => new Date().toISOString().split("T")[0];
  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 3);
    return max.toISOString().split("T")[0];
  };

  // 📌 Upload to Vercel Blob
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        }
      } catch (err) {
        console.error("Upload failed:", err);
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
      {/* Left: Form */}
      <form onSubmit={handleSubmit} className="order-form">
        <h2 className="text-xl font-bold">{t("Order-title")}</h2>

        {/* Name */}
        <label className="block">{t("Order-name")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Phone */}
        <label className="block">{t("Order-phone")}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* Size */}
        <label className="block">{t("Order-size")}</label>
        <div className="radio-group">
          {["18", "20", "24", "26"].map((s) => (
            <label key={s}>
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

        {/* Flavor */}
        <label className="block">{t("Order-flavor")}</label>
        <div className="radio-group">
          {flavors.map((f) => (
            <label key={f.name}>
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

        {/* Upload */}
        <label className="block">{t("Order-image")}</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && <p className="uploaded">✅ Image uploaded</p>}

        {/* Date */}
        <label className="block">{t("Order-date")}</label>
        <input
          type="date"
          value={deliveryDate}
          min={getMinDate()}
          max={getMaxDate()}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />

        {/* Price */}
        {size && (
          <h3 className="price">
            Price: {totalPrice ? `$${totalPrice}` : "Choose flavor"}
          </h3>
        )}

        <button type="submit">Send WhatsApp Message</button>
      </form>

      {/* Right: Preview */}
      <div className="order-preview">
        {previewImage ? (
          <img src={previewImage} alt={`${flavor} ${size}`} />
        ) : (
          <div className="placeholder">🍰 Select options to preview cake</div>
        )}
      </div>
    </div>
  );
}
