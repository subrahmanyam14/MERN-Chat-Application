import { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValide = () => {
    if (!userName || !password) {
      toast.error("Please provide all the fields...");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValide()) return;

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { userName, password });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("profile", res.data.profilePic);
      localStorage.setItem("fullName", res.data.fullName);
      toast.success("Login Successful...");
      navigate("/", { state: { profile: res.data.profilePic, userName: res.data.userName, fullName: res.data.fullName } });
    } catch (error) {
      console.error("Error in the Login page: ", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='form-main'>
      <div className="form-main-container">
        <div className="form-row justify-content-center">
          <div className="form-card">
            <form className="form-card-body" onSubmit={handleSubmit}>
              <div className="form-text-center">
                <h1>Login</h1>
              </div>
              <div className="form-group">
                <label htmlFor="username">UserName:</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="form-btn" disabled={loading} >
                {loading ? <span className='lds-dual-ring '></span> : <b>Login</b>}
              </button>
              <div className="form-links">
                <Link to="/register" className="form-link">
                  {"Don't"} have an account? Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
