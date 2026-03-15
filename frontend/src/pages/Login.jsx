// Login.jsx
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const login = async () => {
    if (!formData.username || !formData.password) {
      showAlert("error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://backend:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      showAlert("success", "Login successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="auth-container">
      {alert.show && (
        <div className={`alert ${alert.type}`}>
          <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {alert.message}
        </div>
      )}

      <h1>
        <i className="fas fa-tasks"></i>
        TaskFlow
      </h1>

      <h2 style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontSize: '1.5em' }}>
        Welcome Back!
      </h2>

      <div className="input-group">
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
        />
      </div>

      <div className="input-group" style={{ position: 'relative' }}>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <i 
          className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#666',
            zIndex: 1
          }}
        ></i>
      </div>

      <button onClick={login} disabled={loading}>
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Logging in...
          </>
        ) : (
          <>
            <i className="fas fa-sign-in-alt"></i>
            Login to Dashboard
          </>
        )}
      </button>

      <p>
        Don't have an account? <Link to="/register">Create free account</Link>
      </p>
    </div>
  );
}

export default Login;