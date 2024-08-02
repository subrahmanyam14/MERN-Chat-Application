import React from 'react';
import ChatList from './ChatList';
import './Sidebar.css';


function Sidebar() {
  const profile = localStorage.getItem("profile");
  const fullName = localStorage.getItem("fullName");
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className='profile-container'>
          <img src={profile}  alt="Profile" className="profile-pic" />
          <h2>{fullName} (me)</h2>
        </div>
      </div>
      <ChatList />
    </div>  
  );
}

export default Sidebar;
