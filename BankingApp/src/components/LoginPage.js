// src/components/LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';
import { useAppContext } from '../context/AppContext';
import { apiRequest } from '../api';

const LoginPage = ({ setIsLoggedIn }) => {
  const { setCurrentUser, showAlert } = useAppContext();

  const [activeTab, setActiveTab] = useState('password');
  const [email, setEmail] = useState('admin@bankfinance.com');
  const [password, setPassword] = useState('admin123');
  const [userType, setUserType] = useState('admin');
  const [phone, setPhone] = useState('+91 9876543210');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const getUserNameByType = (type) => {
    switch(type) {
      case 'admin': return 'Admin User';
      case 'manager': return 'Rajesh Kumar';
      case 'staff': return 'Pooja Desai';
      case 'franchise': return 'Mumbai Franchise';
      default: return 'User';
    }
  };

  const getUserRoleByType = (type) => {
    switch(type) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Team Lead';
      case 'staff': return 'Loan Officer';
      case 'franchise': return 'Partner';
      default: return 'User';
    }
  };

  const getUserAvatarByType = (type) => {
    switch(type) {
      case 'admin': return 'A';
      case 'manager': return 'R';
      case 'staff': return 'P';
      case 'franchise': return 'M';
      default: return 'U';
    }
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) {
      if (showAlert) showAlert('Please enter email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, userType }),
      });

      // If backend is in direct-login mode (no OTP), it will return tokens
      if (data && data.token) {
        const userData = {
          id: data.id,
          name: data.name || getUserNameByType(userType),
          email: data.email || email,
          role: data.role || getUserRoleByType(userType),
          type: data.role || userType,
          avatar: data.avatar || getUserAvatarByType(userType),
          department: data.department,
          token: data.token,
          refreshToken: data.refreshToken,
        };

        localStorage.setItem('bankfinance_user', JSON.stringify(userData));
        if (setCurrentUser) setCurrentUser(userData);
        setIsLoggedIn(true);
        if (showAlert) showAlert('Logged in successfully', 'success');
      } else {
        // Fallback: OTP flow still enabled on backend
        if (showAlert) showAlert('OTP sent successfully. Please enter OTP.', 'success');
        setActiveTab('otp');
      }
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      if (!phone) {
        if (showAlert) showAlert('Please enter phone number', 'error');
        return;
      }

      setLoading(true);
      const data = await apiRequest('/auth/login-phone', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });

      if (data?.otp) {
        // Demo mode: show OTP directly for testing
        if (showAlert) showAlert(`Your OTP is: ${data.otp}`, 'success');
      } else if (showAlert) {
        showAlert('OTP sent successfully.', 'success');
      }
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.some(digit => !digit)) {
      if (showAlert) showAlert('Enter complete OTP', 'error');
      return;
    }

    try {
      setLoading(true);
      const otpCode = otp.join('');

      const data = await apiRequest('/auth/verify-otp-phone', {
        method: 'POST',
        body: JSON.stringify({ phone, otp: otpCode }),
      });

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        type: data.role,
        avatar: data.avatar || getUserAvatarByType(data.role),
        department: data.department,
        token: data.token,
        refreshToken: data.refreshToken,
      };

      localStorage.setItem('bankfinance_user', JSON.stringify(userData));
      if (setCurrentUser) setCurrentUser(userData);

      setIsLoggedIn(true);
      if (showAlert) showAlert('Logged in successfully', 'success');
    } catch (error) {
      if (showAlert) showAlert(error.message || 'OTP verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        document.getElementById(`otp${index + 2}`)?.focus();
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <h1>BankFinance CRM</h1>
          <p>Complete financial management and customer relationship platform for modern banking institutions.</p>
          <div className="badge-container">
            <span className="feature-badge">Secure Login</span>
            <span className="feature-badge">CIBIL Check</span>
            <span className="feature-badge">Loan Calculator</span>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>
          
          <div className="login-tabs">
            <button 
              className={`login-tab ${activeTab === 'password' ? 'active' : ''}`} 
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
            <button 
              className={`login-tab ${activeTab === 'otp' ? 'active' : ''}`} 
              onClick={() => setActiveTab('otp')}
            >
              OTP
            </button>
          </div>
          
          {activeTab === 'password' && (
            <div className="login-form active">
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Login As</label>
                <select 
                  className="form-control"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager/Team Lead</option>
                  <option value="staff">Staff</option>
                  <option value="franchise">Franchise</option>
                </select>
              </div>
              
              <button 
                onClick={handlePasswordLogin} 
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login to Dashboard'}
              </button>
            </div>
          )}
          
          {activeTab === 'otp' && (
            <div className="login-form active">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Enter your phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleSendOTP} 
                className="btn btn-primary login-btn"
                style={{ marginBottom: '20px' }}
              >
                Send OTP
              </button>
              
              <div className="form-group">
                <label>Enter OTP</label>
                <div className="otp-group">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="otp-input"
                      id={`otp${index + 1}`}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleVerifyOTP} 
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP & Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;