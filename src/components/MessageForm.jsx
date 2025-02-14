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
    url: "",
    url2: "",
    canReply: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState();
  const [showUploadFields, setShowUploadFields] = useState(false); // Toggle upload fields

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkbox toggle for replies
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, canReply: e.target.checked });
  };

  // Handle image upload
  const handleImageUpload = (imageUrl, field) => {
    console.log(`Image uploaded for ${field}:`, imageUrl);
    setFormData((prevData) => ({ ...prevData, [field]: imageUrl }));
  };

  // Handle image removal
  const handleRemoveImage = (field) => {
    setFormData((prevData) => ({ ...prevData, [field]: "" }));
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
        body: JSON.stringify({ ...formData, id: docRef.id }),
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
          canReply: true,
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
        {/* Sender Name & Email */}
        <div className="input-group">
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
        </div>

        {/* Recipient Name & Email */}
        <div className="input-group">
          <input
            name="receipientName"
            placeholder="Recipient Name"
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
        </div>

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <input
          name="conclusion"
          placeholder="Conclusion"
          value={formData.conclusion}
          onChange={handleChange}
          required
        />

        {/* Allow Replies Checkbox */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.canReply}
            onChange={handleCheckboxChange}
          />
          Allow replies to this message
        </label>

        {/* Toggle Image Upload Fields */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showUploadFields}
            onChange={() => setShowUploadFields(!showUploadFields)}
          />
          Attach Images
        </label>

        {/* Conditionally Render Image Upload Fields */}
        {showUploadFields && (
          <div className="upload-section">
            <label>Upload Pictures</label>

            <div className="image-upload-container">
              <ImageUpload
                onUpload={(url) => handleImageUpload(url, "url")}
                reset={formData.url === ""}
              />
              {formData.url && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage("url")}
                >
                  ❌ Remove
                </button>
              )}
            </div>

            <div className="image-upload-container">
              <ImageUpload
                onUpload={(url) => handleImageUpload(url, "url2")}
                reset={formData.url2 === ""}
              />
              {formData.url2 && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage("url2")}
                >
                  ❌ Remove
                </button>
              )}
            </div>
          </div>
        )}

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
