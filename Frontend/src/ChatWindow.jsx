import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import API from '@utils/api' // your axios instance pointing to live backend

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        setPrevChats,
        setNewChat,
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatContentRef = useRef(null);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    // Ensure threadId exists (important for mobile)
    useEffect(() => {
        if (!currThreadId) {
            const newThreadId = Date.now().toString();
            setCurrThreadId(newThreadId);
            localStorage.setItem("threadId", newThreadId);
        }
    }, [currThreadId]);

    const getReply = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setNewChat(false);

        try {
            const res = await API.post("/chat", {
                message: prompt,
                threadId: currThreadId,
            });
            setReply(res.data.reply || "❌ No response from server");
        } catch (err) {
            console.error(err);
            setReply("❌ Error: Could not get response from server.");
        }

        setLoading(false);
    };

    // Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prev) => [
                ...prev,
                { role: "user", content: prompt },
                { role: "assistant", content: reply },
            ]);
        }
        setPrompt("");
    }, [reply]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [reply]);

    const handleProfileClick = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setPrevChats([]);
        setPrompt("");
        setReply("");
        setNewChat(true);
        localStorage.removeItem("threadId");
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
            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            )}

            {/* Chat messages */}
            <div
                className="chatContent"
                ref={chatContentRef}
                style={{ overflowY: "auto", height: "calc(100vh - 160px)", padding: "10px" }}
            >
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
                        onKeyDown={(e) => e.key === "Enter" && getReply()}
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
