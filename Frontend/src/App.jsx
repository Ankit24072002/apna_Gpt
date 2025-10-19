import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx"; // add this file
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={providerValues}>
        {/* Top Navigation Bar */}
        <nav className="p-4 flex justify-center gap-6 bg-gray-200 shadow-md">
          {token && <Link to="/">Chat</Link>}
          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/register">Register</Link>}
          {token && (
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
              Logout
            </button>
          )}
        </nav>

        {/* Define Routes */}
        <Routes>
          {/* Protected Main Chat Page */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="app flex">
                  <Sidebar />
                  <ChatWindow />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Login and Register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
