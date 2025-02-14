import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, doc, getDoc } from "../../lib/firebase";
import Modal from "../../components/modal/Modal";
import "./Envelope.css";

export default function EnvelopeView() {
  const { id } = useParams();
  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageData, setMessageData] = useState({
    senderName: "",
    senderEmail: "",
    message: "",
    receipientName: "",
    conclusion: "",
    url: "",
    url2: "",
  });

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          setMessageData({
            senderName: "",
            senderEmail: "",
            message: "Message not found!",
            receipientName: "",
            conclusion: "",
            url: "",
            url2: "",
          });
        }
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessageData({
          senderName: "",
          senderEmail: "",
          message: "Error loading message.",
          receipientName: "",
          conclusion: "",
          url: "",
          url2: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  return (
    <div className="container">
      {loading ? (
        <p className="highlight">Mail incoming...</p>
      ) : (
        <>
          <div className={`valentines ${isOpened ? "disabled" : ""}`}>
            <div className="envelope" onClick={() => setIsOpened(true)}>
              <div className="card">
                <div className="text">
                  <p>
                    <strong>From:</strong> {messageData.senderName}
                  </p>
                  <p>
                    {messageData.message.length > 20
                      ? messageData.message.substring(0, 20) + "..."
                      : messageData.message}
                  </p>
                </div>
                <div className="heart"></div>
              </div>
            </div>
            <div className="front"></div>
          </div>

          {/* Modal component */}
          <Modal
            isOpen={isOpened}
            onClose={() => setIsOpened(false)}
            senderName={messageData.senderName}
            senderEmail={messageData.senderEmail}
            receipientName={messageData.receipientName}
            message={messageData.message}
            conclusion={messageData.conclusion}
            url={messageData.url}
            url2={messageData.url2}
          />
        </>
      )}
    </div>
  );
}
