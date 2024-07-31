import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Components/Pages/Login/Login';
import Register from './Components/Pages/Register/Register';
import Home from './Components/Pages/Home/Home';
import { Toaster } from 'react-hot-toast';

export const store = createContext();
function App() {
  const [conversation, setConversation] = useState([]);
  const [recieverId, setRecieverId] = useState("");
  const [chatId, setChatId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <store.Provider value={[conversation, setConversation, recieverId, setRecieverId, chatId, setChatId, isDelete, setIsDelete]}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={ <Home /> } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </store.Provider>
  );
}

export default App;
