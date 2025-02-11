import { useState } from "react";
import { db, collection, addDoc } from "../lib/firebase";

export default function MessageForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, "messages"), {
        name,
        email,
        recipientEmail,
        message,
        createdAt: new Date(),
      });

      await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        body: JSON.stringify({
          recipientEmail,
          senderName: name,
          messageId: docRef.id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      alert("Message sent successfully!");
      setName(""); setEmail(""); setRecipientEmail(""); setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="message-form">
      <h2>Send a Loving Message</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
      <input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Recipient's Email" required />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." required />
      <button onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
