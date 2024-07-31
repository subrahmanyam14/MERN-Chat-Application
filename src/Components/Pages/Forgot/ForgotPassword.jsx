import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [originalOtp, setOriginalOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(300);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  useEffect(() => {
    if (timer > 0 && isEmailSubmitted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isEmailSubmitted]);

  const handleEmailSubmit = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-otp/${email}`);
      setOriginalOtp(res.data.savedOtp.otp.toString());
      console.log('Original OTP from server:', res);
      setIsEmailSubmitted(true);
      toast.success('OTP sent to your email!', {position: "top-center"});
    } catch (error) {
      toast.error('User not found. Failed to send OTP', {position: "top-center"});
    }
  };

  const handleOtpVerification = () => {
    console.log('Entered OTP:', otp);
    console.log('Original OTP:', originalOtp);
    if (otp.trim() === originalOtp.trim()) {
      setIsOtpVerified(true);
      toast.success('OTP verified successfully!', {position: "top-center"});
    } else {
      toast.error('Invalid OTP', {position: "top-center"});
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {position: "top-center"});
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, { email, otp, password });
      toast.success('Password changed successfully!', {position: "top-center"});
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  // const handleBackClick = () => {
  //   navigate(-1);
  // };

  return (
    <div className="forgotPasswordmain">
      
      <div className="forget-password-main-container1">
        <ToastContainer />
        <div className="forget-password-row justify-content-center">
          <div className="forget-password-card">
            <div className="forget-password-card-body">
              <div className="forget-password-text-center">
                <h1>Forget Password</h1>
              </div>
              {!isEmailSubmitted ? (
                <>
                  <div className="forget-password-form-group">
                    <label htmlFor="email">Enter Email:</label>
                    <input
                      type="email"
                      id="email"
                      className="forget-password-form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button onClick={handleEmailSubmit} className="forget-password-btn-verify">Submit Email</button>
                </>
              ) : !isOtpVerified ? (
                <>
                  <div className="forget-password-form-group">
                    <label htmlFor="otp">Enter OTP:</label>
                    <input
                      type="text"
                      id="otp"
                      className="forget-password-form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="forget-password-timer">
                    <span>Time left: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</span>
                  </div>
                  <button onClick={handleOtpVerification} disabled={timer === 0} className="forget-password-btn-verify">Verify OTP</button>
                </>
              ) : (
                <>
                  <div className="forget-password-form-group">
                    <label htmlFor="password">New Password:</label>
                    <input
                      type="password"
                      id="password"
                      className="forget-password-form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="forget-password-form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="forget-password-form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button onClick={handleChangePassword} className="forget-password-btn-change">Change Password</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
