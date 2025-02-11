import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, doc, getDoc } from "../../lib/firebase";
import "./Envelope.css";

export default function EnvelopeView() {
  const { id } = useParams();
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const docRef = doc(db, "messages", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessage(docSnap.data().message);
      } else {
        setMessage("Message not found!");
      }
    };
    fetchMessage();
  }, [id]);

  return (
    <div className="envelope-container">
      <div className={`envelope ${isOpened ? "opened" : ""}`}>
        <div className="flap"></div>
        {isOpened && <div className="message-content"><p>{message}</p></div>}
      </div>
      <button onClick={() => setIsOpened(true)}>Open Mail</button>
    </div>
  );
}
