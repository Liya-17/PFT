import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // Import Login Page
import "./App.css"; // Importing CSS file

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Personal Finance Tracker</h1>
      <button className="home-button" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </button>
      <button className="home-button" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
}

// ✅ Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check token
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token); // You can replace this with a real user authentication check
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
