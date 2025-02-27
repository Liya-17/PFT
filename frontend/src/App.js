import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css"; // Importing CSS file

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Personal Finance Tracker</h1>
      <button className="home-button" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
