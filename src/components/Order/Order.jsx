import React, { useState } from "react";

export default function Order() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cakeSize, setCakeSize] = useState("18");
  const [imageFile, setImageFile] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  // ✅ minimum delivery date (2 days from today)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    // ✅ Upload image if provided
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      await new Promise((resolve, reject) => {
        reader.onload = async () => {
          const base64 = reader.result;

          try {
            const uploadRes = await fetch(`${window.location.origin}/api/upload`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageBase64: base64 }),
            });

            const data = await uploadRes.json();
            console.log("🔍 Upload response:", data);

            if (data.imageUrl) {
              imageUrl = data.imageUrl;
            } else {
              console.error("❌ No imageUrl returned:", data);
            }
            resolve();
          } catch (err) {
            console.error("❌ Upload error:", err);
            reject(err);
          }
        };
        reader.onerror = reject;
      });
    }

    // ✅ Build WhatsApp message
    const whatsappText = `
Hello, my name is ${name}.
Phone: ${phone}
Cake size: ${cakeSize} cm
Delivery date: ${deliveryDate}
${imageUrl ? "Image: " + imageUrl : ""}
    `;

    const encodedMessage = encodeURIComponent(whatsappText.trim());

    // Replace with your business number (international format, no +, no spaces)
    const businessNumber = "201065155248";

    window.open(`https://wa.me/${businessNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold">Order Cake</h2>

      <div>
        <label className="block">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Cake Size</label>
        <div className="flex gap-4">
          {["18", "20", "24", "26"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="radio"
                value={size}
                checked={cakeSize === size}
                onChange={(e) => setCakeSize(e.target.value)}
              />
              {size} cm
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block">Upload Image (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <div>
        <label className="block">Delivery Date</label>
        <input
          type="date"
          value={deliveryDate}
          min={getMinDate()}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <button type="submit" className="bg-green-600 text-white p-2 rounded">
        Send WhatsApp Message
      </button>
    </form>
  );
}
