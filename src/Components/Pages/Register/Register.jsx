import axios from 'axios';
import { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { position: "top-center" });
      return;
    }

    if (!fullName || !userName || !password || !gender) {
      toast.error('Please provide all fields...', { position: "top-center" });
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signUp`, { fullName, userName, password, confirmPassword, gender });
      if (res.data.error) {
        throw new Error(res.data.error);
      }
      localStorage.setItem("token", res.data.token);
      toast.success('Registration successful!', { position: "top-center" });
      setTimeout(() => {
        navigate("/", { state: { profile: res.data.profilePic, userName: res.data.userName, fullName: res.data.fullName } });
      }, 2000);
    } catch (error) {
      console.error("Error in the Registration: ", error.message);
      toast.error('Failed to register', { position: "top-center" });
    }
  };

  return (
    <div className='registration-form-main'>
      <div className="registration-main-container">
        <div className="registration-row justify-content-center">
          <div className="registration-card">
            <form className="registration-card-body" onSubmit={handleRegister}>
              <div className="registration-text-center">
                <h1>Register</h1>
              </div>
              <div className="registration-form-group">
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  className="registration-form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="registration-form-group">
                <label htmlFor="userName">User Name:</label>
                <input
                  type="text"
                  id="userName"
                  className="registration-form-control"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="registration-form-group">
                <label htmlFor="gender">Gender:</label>
                <select
                  id="gender"
                  className="registration-form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="registration-form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="registration-form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="registration-form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="registration-form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="registration-btn-submit">Register</button>
              <div className="registration-links">
                <Link to="/login" className="registration-link">Do you have a account, Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
