import "./Modal.css";

export default function Modal({ isOpen, onClose, senderName, message }) {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <>
      <div className="blur-background"></div> {/* Blurred background */}
      <div className="popup">
        <div className="card popup-card"> {/* Reusing the same card styles */}
          <div className="text">
            <p>
              <strong>From:</strong> {senderName}
            </p>
            <p>{message}</p>
          </div>
          <div className="heart"></div> {/* Keeps heart design */}
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
