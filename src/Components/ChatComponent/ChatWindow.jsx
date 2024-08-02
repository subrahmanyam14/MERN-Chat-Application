import React, { useContext, useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import toast from 'react-hot-toast';
import { store } from '../../App';
import axios from 'axios';
import io from "socket.io-client";
import notificationSound from "../../assets/notification.mp3";

function extractTime(dateString) {
  const date = new Date(dateString);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, "0");
}



function ChatWindow() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation, recieverId, setRecieverId, chatId, setChatId, chatUsers, setChatUsers] = useContext(store);
  const socket = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    socket.current = io("http://localhost:5000/", {
      query: { userId },
      auth: { token },
    });

    if (!conversation) {
      setConversation([]);
    }

    socket.current.on("newMessage", (message) => {
      if (message.conversationId === chatId) {
        // Add message to current conversation
        setConversation((prevConversation) => [...prevConversation, message.newMessage]);
        const sound = new Audio(notificationSound);
        sound.play();
      } else {
        // Trigger a notification for new message in another conversation
        const sound = new Audio(notificationSound);
        sound.play();
        toast(`New message from ${findSenderName(message.newMessage.senderId)}`, {
          icon: '📩',
          // onClick: () => {
          //   // Implement logic to switch to this conversation
          //   navigateToConversation(newMessage.conversationId);
          // }
        });
      }
    });

    socket.current.on("messageDeleted", ({ chatId: deletedChatId }) => {
      if (chatId === deletedChatId) {
        setConversation([]);
      }
    });

    return () => {
      socket.current.off("newMessage");
      socket.current.off("messageDeleted");
      socket.current.disconnect();
    };
  }, [setConversation, chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (recieverId !== "" && message !== "") {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/messages/send/${recieverId}`,
          { message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.error) {
          throw new Error(res.data.error);
        }

        setConversation((prevConversation) => [...prevConversation, res.data]);
        setMessage("");
      }
    } catch (error) {
      console.log("Error in sending message:", error.message);
      toast.error(error.message);
    }
  };

  const findSenderName = (id) => {
    const sender = chatUsers.find((user) => user._id === id);
    return sender ? sender.fullName : "";
}


  return (
    <div className="chatWindow">
      {conversation?.map((msg, index) => (
        <div
          key={index}
          className={`chatWindow__message
            ${msg?.senderId === localStorage.getItem("userId") ? 'chatWindow__message--sent' : 'chatWindow__message--received'}`}
        >
          <div className="chatWindow__messageText">{msg?.message}</div>
          <div className="chatWindow__messageTime">{extractTime(msg?.createdAt)}</div>
        </div>
      ))}
      <div ref={bottomRef}></div>
      <div className="chat-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="message"
            value={message}
            style={{ border: "3px solid black" }}  // Updated the border style
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
