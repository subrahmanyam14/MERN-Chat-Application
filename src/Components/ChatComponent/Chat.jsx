import React, { useContext } from 'react';
import ChatWindow from './ChatWindow';
import './Chat.css';
import { store } from '../../App';

function Chat() {
  const [conversation, setConversation, recieverId, setRecieverId, chatId, setChatId, chatUsers, setChatUsers] = useContext(store);
  const findReciever = (id) => {
    const reciever = chatUsers.find((user) => user._id === id);
    return reciever || {}; // Return an empty object if no user is found
  }
  return (
    <div className="chat">
      {
        recieverId? (<div className='part1'>
          <img src={findReciever(recieverId)?.profilePic} alt="Profile" className="profile-pic" />
          <h2>{findReciever(recieverId)?.fullName}</h2>
          
        </div>):(<div></div>)
      }
      <ChatWindow />
    </div>
  );
}

export default Chat;
