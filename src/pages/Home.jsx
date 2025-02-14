import MessageForm from "../components/MessageForm";
import "./Home.css";
import logo from "../components/img/logo.png";
import Navbar from "../components/navbar/Navbar";

export default function Home() {
  return (
    <div className="home-container">
      <img src={logo} alt="SoulScript Logo" className="logo" />
      <h1 className="title">Welcome to <span className="highlight">SoulScript</span></h1>
      <p className="subtitle">Send heartfelt messages in a beautiful way.</p>
      <MessageForm />
    </div>
  );
}
