import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChatList.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { store } from '../../App';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import io from "socket.io-client";

function ChatList() {
  const navigate = useNavigate();
  const socket = useRef(null);
  const [conversation, setConversation, recieverId, setRecieverId, chatId, setChatId] = useContext(store);
  const token = localStorage.getItem("token");
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const userId = localStorage.getItem("userId");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { console.log(onlineUsers) }, [onlineUsers]);
  
  const fetchUsers = async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }
      //console.log(res.data);
      setChatUsers(res.data);

      // Initialize socket connection
      socket.current = io(`${import.meta.env.VITE_BACKEND_URL}`, {
        query: { userId },  // Use object notation for query
      });

      // Listen for online users
      socket.current.on("getOnlineUsers", (getOnlineUsers) => {
        setOnlineUsers(getOnlineUsers);
        //console.log(getOnlineUsers);
      });
      //console.log(onlineUsers)  
      // Listen for message deletion
      socket.current.on("messageDeleted", () => {
        setConversation([]);
      });

      return () => {
        socket.current.off("getOnlineUsers");
        socket.current.disconnect();
      };

    } catch (error) {
      console.log("Error in the fetching of users for side bar: ", error.message);
      toast.error(error.message);
    }
  }


  const handleOnClick = async (recieverId) => {
    try {
      setRecieverId(recieverId);
      setSelectedUserId(recieverId); // Update the selected user ID
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/getAllMessages/${recieverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }
      setChatId(res.data.id);
      setConversation(res.data.messages);
    } catch (error) {
      console.log("Error in the ChatList: ", error.message);
      toast.error(error.message);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  const handleDelete = async () => {
    try {
      let res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/messages/deleteCoversation/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      toast.success("Messages deleted");

      // Clear the conversation state
      setConversation([]);
      setChatId(null);
      setSelectedUserId(null);

    } catch (error) {
      console.log("Error while deleting the chat: ", error.message);
      toast.error(error.message);
    }
  }

  return (
    <div className="chatList">
      {chatUsers.map((chat, index) => (
        <div
          key={index}
          className={`chatList__item ${selectedUserId === chat._id ? 'chatList__item--selected' : ''}`}
          onClick={() => handleOnClick(chat._id)}
        >
          <div className="chatList__itemInfo">
            <div className='profile-pic-container'>
              <div className='part1'>
                <img src={chat.profilePic} alt="Profile" className="profile-pic" />
                <h2>{chat.fullName}</h2>
              </div>
              <div className='part2' onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                <DeleteOutlinedIcon />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='log-out-button'>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default ChatList;
