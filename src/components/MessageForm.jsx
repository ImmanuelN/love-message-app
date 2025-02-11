import React, { useState } from "react";
import { db, collection, addDoc } from "../lib/firebase";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    recipientEmail: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Store message in Firestore
      const docRef = await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: new Date(),
      });

      console.log("Message stored with ID:", docRef.id);

      // Step 2: Call Netlify function to send the email
      const response = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: docRef.id, // Message ID for retrieval
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          recipientEmail: formData.recipientEmail,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
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
    <form onSubmit={handleSubmit}>
      <input type="text" name="senderName" placeholder="Your Name" onChange={handleChange} required />
      <input type="email" name="senderEmail" placeholder="Your Email" onChange={handleChange} required />
      <input type="email" name="recipientEmail" placeholder="Recipient Email" onChange={handleChange} required />
      <textarea name="message" placeholder="Your message" onChange={handleChange} required />
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default MessageForm;
