import React from 'react';
import ChatList from './ChatList';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2>Chat Box</h2>
      </div>
      <ChatList />
    </div>
  );
}

export default Sidebar;
