import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EnvelopeView from "./components/envelope/EnvelopeView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/id" element={<EnvelopeView />} />
      </Routes>
    </Router>
  );
}
