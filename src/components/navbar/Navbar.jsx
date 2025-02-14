import { Link } from "react-router-dom";
import './Navbar.css';

export default function Navbar({ senderName, senderEmail }) {
  // Function to handle opening the default email client with pre-filled details
  const handleEmailResponse = () => {
    const subject = "Reply to your loving message";
    const body = `Dear ${senderName},\n\nThank you for your beautiful message!`;
    const mailtoLink = `mailto:${senderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Write a Message</Link>
        </li>
        <li>
          <button onClick={handleEmailResponse}>Respond via Email</button>
        </li>
      </ul>
    </nav>
  );
}
