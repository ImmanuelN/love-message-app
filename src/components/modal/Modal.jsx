import "./Modal.css";

export default function Modal({
  isOpen,
  onClose,
  senderName,
  receipientName,
  message,
  conclusion,
  url,
  url2,
}) {
  if (!isOpen) return null; // Don't render if modal is closed

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
              {conclusion}<br />
              <strong>{senderName}</strong>
            </p>
          </div>

          {/* Close button */}
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
