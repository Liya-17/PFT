import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";


const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes & clear error messages
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(""); // Clear error when user starts typing
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Email and Password are required");
            return;
        }

        setLoading(true);
        try {
            // Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);

            // Send login request to backend API for JWT token
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token); // ✅ Store JWT token
            navigate("/dashboard"); // ✅ Redirect to dashboard
        } catch (error) {
            setError(error.message || "Something went wrong");
        }
        setLoading(false);
    };

    const handleRegister = async () => {
        if (!email || !password) {
            setError("Email and Password are required");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            alert("Registration successful! You can now log in.");
        } catch (error) {
            setError(error.message || "Registration failed");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={handleInputChange(setEmail)} 
                style={inputStyle}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={handleInputChange(setPassword)} 
                style={inputStyle}
            />

            <button onClick={handleLogin} style={buttonStyle} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
            <button onClick={handleRegister} style={{ ...buttonStyle, background: "#4CAF50" }} disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    );
};

// Inline styles for cleaner design
const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "none",
    background: "#007BFF",
    color: "white",
    cursor: "pointer",
};

export default Login;
