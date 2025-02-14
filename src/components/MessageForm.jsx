import React, { useState } from "react";
import { db, collection, addDoc } from "../lib/firebase";
import ImageUpload from "./ImageUploader"; // Import ImageUpload component
import "./MessageForm.css";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    recipientEmail: "",
    message: "",
    conclusion: "",
    receipientName: "",
    url: "", // First image URL
    url2: "", // Second image URL
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState();

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload by updating the correct field (url or url2)
  const handleImageUpload = (imageUrl, field) => {
    console.log(`Image uploaded for ${field}:`, imageUrl);
    setFormData((prevData) => ({ ...prevData, [field]: imageUrl }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: new Date(),
      });

      console.log("Message stored with ID:", docRef.id);
      setId(docRef.id);

      // Call email function
      const response = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: docRef.id,
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          recipientEmail: formData.recipientEmail,
          receipientName: formData.receipientName,
          conclusion: formData.conclusion,
          message: formData.message,
          url: formData.url,
          url2: formData.url2,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({
          senderName: "",
          senderEmail: "",
          recipientEmail: "",
          receipientName: "",
          conclusion: "",
          message: "",
          url: "",
          url2: "",
        });
      } else {
        alert("Failed to send email: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Send a Loving Message 💌</h2>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          name="senderName"
          placeholder="Your Name"
          value={formData.senderName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="senderEmail"
          placeholder="Your Email"
          value={formData.senderEmail}
          onChange={handleChange}
          required
        />
        <input
          name="receipientName"
          placeholder="Receipient Name"
          value={formData.receipientName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="recipientEmail"
          placeholder="Recipient Email"
          value={formData.recipientEmail}
          onChange={handleChange}
          required
        />
        <input
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <input
          name="conclusion"
          placeholder="conclusion"
          value={formData.conclusion}
          onChange={handleChange}
          required
        />
        <label>Upload Pictures</label>

        {/* Image Upload Fields using ImageUpload Component */}
        <ImageUpload onUpload={(url) => handleImageUpload(url, "url")} label />
        <ImageUpload onUpload={(url) => handleImageUpload(url, "url2")} label />

        <button type="submit" disabled={loading} className="send-button">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {success && (
        <p className="success-message">
          ✅ Message sent successfully! View the Message Here:
          <a
            href={`https://crash0ut-mail-app.netlify.app/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to view
          </a>
        </p>
      )}
    </div>
  );
};

export default MessageForm;
