// Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    if (strength <= 2) return { level: 'weak', text: 'Weak' };
    if (strength <= 4) return { level: 'medium', text: 'Medium' };
    return { level: 'strong', text: 'Strong' };
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      showAlert("error", "Please fill in all fields");
      return false;
    }

    if (formData.username.length < 3) {
      showAlert("error", "Username must be at least 3 characters");
      return false;
    }

    if (formData.username.length > 20) {
      showAlert("error", "Username must be less than 20 characters");
      return false;
    }

    if (formData.password.length < 6) {
      showAlert("error", "Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log(formData.username)
      console.log(formData.password)
      const res = await fetch("http://backend:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      showAlert("success", "Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  const passwordStrength = getPasswordStrength();

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
        Create Account
      </h2>

      <div className="input-group">
        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
        />
        <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
          3-20 characters
        </small>
      </div>

      <div className="input-group" style={{ position: 'relative' }}>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a password"
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

      {formData.password && (
        <>
          <div className="password-strength">
            <div 
              className={`strength-bar ${passwordStrength?.level}`}
              style={{ width: passwordStrength?.level === 'weak' ? '33.33%' : passwordStrength?.level === 'medium' ? '66.66%' : '100%' }}
            ></div>
          </div>
          <div className="strength-text">
            Password strength: <strong>{passwordStrength?.text}</strong>
          </div>
        </>
      )}

      <div className="input-group" style={{ position: 'relative', marginTop: '20px' }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <i 
          className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

      {formData.password && formData.confirmPassword && (
        <div style={{ 
          marginTop: '8px', 
          color: formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <i className={`fas fa-${formData.password === formData.confirmPassword ? 'check-circle' : 'exclamation-circle'}`}></i>
          {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
        </div>
      )}

      <button onClick={register} disabled={loading} style={{ marginTop: '24px' }}>
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Creating account...
          </>
        ) : (
          <>
            <i className="fas fa-user-plus"></i>
            Create Account
          </>
        )}
      </button>

      <p>
        Already have an account? <Link to="/">Sign in</Link>
      </p>
    </div>
  );
}

export default Register;