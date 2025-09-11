import React, { useState } from "react";
import "./Order.css";
import { useTranslation } from "react-i18next";
import imagetest from "../../assets/images/cover.webp";
import logo from "../../assets/images/logo.png";

export default function OrderForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState("");
  const [flavor, setFlavor] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [type, setType] = useState("");
  const [shape, setShape] = useState("");

  // Example pricing + demo images
  const flavors = [
    {"name":t("Order-flavor-chocolate")},
    {"name":t("Order-flavor-vanilla")},
    {"name":t("Order-flavor-strawberry")}
  ];
  const types = [
    {name:t("Order-type-fondant"),
    basePrice: 14,
      images: {
        "12": imagetest,
        "16": "https://via.placeholder.com/250/FFB6C1?text=fondant+16",
        "24": "https://via.placeholder.com/250/FFB6C1?text=fondant+24",
        "28": "https://via.placeholder.com/250/FFB6C1?text=fondant+28",
        "20x30": "https://via.placeholder.com/250/FFB6C1?text=fondant+20x30",
        "30x40": "https://via.placeholder.com/250/FFB6C1?text=fondant+30x40",
        "16+12": "https://via.placeholder.com/250/FFB6C1?text=fondant+16+12",
        "24+16": "https://via.placeholder.com/250/FFB6C1?text=fondant+24+16",
        "28+24": "https://via.placeholder.com/250/FFB6C1?text=fondant+28+24",
      }
  }, 
  {name:t("Order-type-cream"),
    basePrice: 12,
      images: {
        "12": "https://via.placeholder.com/250/FFB6C1?text=cream+12",
        "16": "https://via.placeholder.com/250/FFB6C1?text=cream+16",
        "24": "https://via.placeholder.com/250/FFB6C1?text=cream+24",
        "28": "https://via.placeholder.com/250/FFB6C1?text=cream+28",
        "20x30": "https://via.placeholder.com/250/FFB6C1?text=cream+20x30",
        "30x40": "https://via.placeholder.com/250/FFB6C1?text=cream+30x40",
        "16+12": "https://via.placeholder.com/250/FFB6C1?text=cream+16+12",
        "24+16": "https://via.placeholder.com/250/FFB6C1?text=cream+24+16",
        "28+24": "https://via.placeholder.com/250/FFB6C1?text=cream+28+24",
      }
  }];

  const sizes = [
    { name: t("Order-shape-round"), dimensions: ["12", "16", "24", "28"] },
    { name: t("Order-shape-rectangular"), dimensions: ["20x30", "30x40"] },
    { name: t("Order-shape-twoTiers"), dimensions: ["16+12", "24+16", "28+24"] },
  ];
  const selectedShape = sizes.find((s) => s.name === shape);
  const sizeMultipliers = { "12": 1, "16": 1.2, "24": 1.5, "28": 1.8 , "20x30": 1.4, "30x40": 1.7, "16+12": 2, "24+16": 2.5, "28+24": 3 };

  const selectedType = types.find((t) => t.name === type);
  const previewImage =
    selectedType && size ? selectedType.images[size] : null;

  const totalPrice =
    selectedType && size
      ? selectedType.basePrice * sizeMultipliers[size]
      : null;

  // 📌 Date restriction (max 3 days ahead)
  // const getMinDate = () => new Date().toISOString().split("T")[0];
  const getMinDate = () => {
    const min = new Date();
    min.setDate(min.getDate() + 3);
    return min.toISOString().split("T")[0];
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
    const whatsappUrl = `https://wa.me/201065155248?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="order-layout">
      {/* Left: Form */}
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-header">
          <h2 className="text-xl font-bold">{t("Order-title")}</h2>
          <img src={logo} alt="Hala Raihana Logo" className="logo" />
        </div>

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
         {/* Shape selection */}
      <label>{t("Order-shape")}</label>
      <div className="radio-group">
        {sizes.map((sh) => (
          <label key={sh.name} className="radio-option">
            <input
              type="radio"
              name="shape"
              value={sh.name}
              checked={shape === sh.name}
              onChange={(e) => {
                setShape(e.target.value);
                setSize(""); // reset size when shape changes
              }}
            />
            {sh.name}
          </label>
        ))}
      </div>

      {/* Size selection */}
      {selectedShape && (
        <>
          <h3>{t("Order-size")}</h3>
          <div className="radio-group">
            {selectedShape.dimensions.map((s) => (
              <label key={s} className="radio-option">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={(e) => setSize(e.target.value)}
                />
                {s} cm
              </label>
            ))}
          </div>
        </>
      )}

        {/* Type */}
        <label className="block">{t("Order-type")}</label>
        <div className="radio-group">
          {types.map((t) => (
            <label key={t.name}>
              <input
                type="radio"
                value={t.name}
                checked={type === t.name}
                onChange={(e) => setType(e.target.value)}
              />
              {t.name}
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
          // max={getMaxDate()}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />

        {/* Price */}
        {size && (
          <h3 className="price">
            {t("Order-price")}: {totalPrice ? `$${totalPrice}` : "Choose type"}
          </h3>
        )}

        <button type="submit">{t("Order-submit")}</button>
      </form>

      {/* Right: Preview */}
<div className="order-preview">
  <div className="preview-image-wrapper">
    {previewImage ? (
      <img src={previewImage} alt={`${type} ${size}`} />
    ) : (
      <div className="placeholder">🍰 Select options to preview cake</div>
    )}
  </div>

  <div className="preview-summary">
    <h3>✅ Order Summary</h3>
    {shape && <p><strong>Shape:</strong> {shape} Cake</p>}
    {size && <p><strong>Size:</strong> {size} cm</p>}
    {flavor && <p><strong>Flavor:</strong> {flavor}</p>}
    {totalPrice > 0 && <p><strong>Total Price Start By:</strong> ${totalPrice}</p>}
  </div>
</div>
    </div>
  );
}
