import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../Styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") checkPasswordStrength(e.target.value);
  };

  const checkPasswordStrength = (password) => {
    if (!password) setPasswordStrength("");
    else if (password.length < 6) setPasswordStrength("Weak");
    else if (/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) setPasswordStrength("Medium");
    else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) setPasswordStrength("Strong");
    else setPasswordStrength("Weak");
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak": return "text-red-400";
      case "Medium": return "text-yellow-400";
      case "Strong": return "text-green-400";
      default: return "text-gray-300";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength === "Weak") {
      alert("❌ Password too weak!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://apna-gpt.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registered successfully!");
        setForm({ name: "", email: "", password: "" });
        setPasswordStrength("");
      } else {
        alert(`❌ ${data.msg || data.error || "Registration failed"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Left Panel */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-white p-8 bg-gradient-to-b from-gray-900 to-gray-800">
        <h1 className="text-4xl font-bold mb-4">CloneGPT</h1>
        <p className="text-lg text-center max-w-md">
          AI-powered assistant for smarter workflows. Join now and start your journey!
        </p>
      </div>

      {/* Register Form */}
      <div className="md:w-1/2 flex justify-center items-center p-8 bg-gray-900 relative z-10">
        <div className="login-container w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Create Account</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {form.password && (
              <p className={`text-sm mt-1 ${getStrengthColor()}`}>
                Strength: {passwordStrength}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold mt-3 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <span
              className="text-green-400 hover:text-green-500 font-semibold cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
