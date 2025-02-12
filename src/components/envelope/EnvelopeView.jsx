import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, doc, getDoc } from "../../lib/firebase";
import "./Envelope.css";

export default function EnvelopeView() {
  const { id } = useParams();
  const [isOpened, setIsOpened] = useState(false);
  const [messageData, setMessageData] = useState({
    senderName: "",
    senderEmail: "",
    message: "",
  });

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          setMessageData({ senderName: "", senderEmail: "", message: "Message not found!" });
        }
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessageData({ senderName: "", senderEmail: "", message: "Error loading message." });
      }
    };

    fetchMessage();
  }, [id]);

  return (
    <div className="envelope-container">
      <div className={`envelope ${isOpened ? "opened" : ""}`}>
        <div className="flap"></div>
        {isOpened && (
          <div className="message-content">
            <p><strong>From:</strong> {messageData.senderName} ({messageData.senderEmail})</p>
            <p>{messageData.message}</p>
          </div>
        )}
      </div>
      <button onClick={() => setIsOpened(true)}>Open Mail</button>
    </div>
  );
}
