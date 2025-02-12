import React, { useState } from "react";
import { db, collection, addDoc } from "../lib/firebase";
import "./MessageForm.css";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    recipientEmail: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      const response = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: docRef.id,
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          recipientEmail: formData.recipientEmail,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ senderName: "", senderEmail: "", recipientEmail: "", message: "" });
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
          type="email"
          name="recipientEmail"
          placeholder="Recipient Email"
          value={formData.recipientEmail}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading} className="send-button">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {success && <p className="success-message">✅ Message sent successfully!</p>}
    </div>
  );
};

export default MessageForm;
