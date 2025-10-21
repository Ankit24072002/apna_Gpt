import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const getReply = async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt) return;

    setLoading(true);
    setNewChat(false);
    setPrompt(""); // clear input immediately

    try {
      const response = await fetch("https://apna-gpt.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentPrompt, threadId: currThreadId }),
      });
      const res = await response.json();
      const assistantReply = res.reply || "❌ No response from server";

      setReply(assistantReply);

      // Append both user message and assistant reply immediately
      setPrevChats(prev => ([
        ...prev,
        { role: "user", content: currentPrompt },
        { role: "assistant", content: assistantReply },
      ]));
    } catch (err) {
      console.error(err);
      const errorMsg = "❌ Error: Could not get response from server.";
      setReply(errorMsg);
      setPrevChats(prev => ([
        ...prev,
        { role: "user", content: currentPrompt },
        { role: "assistant", content: errorMsg },
      ]));
    }

    setLoading(false);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reply]);

  const handleProfileClick = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("threadId");
    setPrevChats([]);
    setPrompt("");
    setReply("");
    setNewChat(true);
    navigate("/login");
  };

  return (
    <div className="chatWindow">
      {/* Navbar */}
      <div className="navbar">
        <span>CloneGpt <i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen &&
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      }

      {/* Chat Messages - Scrollable */}
      <div className="chatContent" style={{ overflowY: "auto", height: "calc(100vh - 160px)", padding: "10px" }}>
        <Chat />
        <div ref={chatEndRef} />
      </div>

      {/* Loading */}
      {loading && <div className="loadingOverlay"><ScaleLoader color="#fff" loading={loading} /></div>}

      {/* Input */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getReply()}
          />
          <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <p className="info">
          CloneGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
