import React, { useEffect } from 'react';
import Sidebar from '../../ChatComponent/Sidebar';
import Chat from '../../ChatComponent/Chat';
import "./Home.css";
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  useEffect(() => {if(!token)navigate("/login")}, []);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile || '';
  const fullName = location.state?.fullName || '';
  const userName = location.state?.userName || '';

  return (
    <div className="app">
      <Sidebar profile={profile} fullName={fullName} userName={userName} className="chatList" />
      <Chat className="chatBox"/>
    </div>
  );
}

export default Home;
