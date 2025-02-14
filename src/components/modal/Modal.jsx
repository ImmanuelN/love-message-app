import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Modal.css";

export default function Modal({
  isOpen,
  onClose,
  senderName,
  senderEmail,
  receipientName,
  message,
  conclusion,
  url,
  url2,
}) {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!isOpen) return null; // Don't render if modal is closed

  // Function to open email app
  const handleReply = () => {
    if (senderEmail) {
      const subject = encodeURIComponent(`Reply to your SoulScript message`);
      const body = encodeURIComponent(`Hi ${senderName},\n\n`);
      window.location.href = `mailto:${senderEmail}?subject=${subject}&body=${body}`;
    }
  };

  // Function to navigate to home page
  const handleNavigate = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <>
      <div className="blur-background"></div> {/* Blurred background */}
      <div className="popup">
        <div className="popup-card">
          {/* Image Stack for Two Images */}
          {(url || url2) && (
            <div className="image-stack">
              {url2 && <img src={url2} alt="Attached" className="polaroid" />}
              {url && <img src={url} alt="Attached2" className="polaroid2" />}
            </div>
          )}

          {/* Romantic handwritten style text */}
          <div className="text">
            <p className="salutation">Dearest {receipientName},</p>
            <p className="message">{message}</p>
            <p className="closing">
              {conclusion}
              <br />
              <strong>{senderName}</strong>
            </p>
          </div>

          {/* Buttons Container */}
          <div className="button-container">
            {senderEmail && (
              <button className="reply-button" onClick={handleReply}>
                Reply via email
              </button>
            )}
            <button className="reply-button" onClick={handleNavigate}>
              Reply via SoulScript
            </button>
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
