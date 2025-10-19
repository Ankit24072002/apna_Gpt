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
    else if (password.match(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)) setPasswordStrength("Medium");
    else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)) setPasswordStrength("Strong");
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
      const res = await fetch("http://localhost:8080/api/auth/register", {
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
        alert(`❌ ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Particle background effect
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "particles";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0;
        if (this.y < 0) this.y = h;
      }
      draw() {
        ctx.fillStyle = "rgba(16,185,129,0.7)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) particlesArray.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particlesArray.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    animate();

    return () => { canvas.remove(); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Animated Left Panel */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-white p-8 animated-gradient-panel">
        <h1 className="text-4xl font-bold mb-4">CloneGPT</h1>
        <p className="text-lg text-center max-w-md">
          AI-powered assistant for smarter workflows. Join now and experience next-level productivity!
        </p>
      </div>

      {/* Right Section: Register Form */}
      <div className="md:w-1/2 flex justify-center items-center p-8 bg-gray-900 relative z-10">
        <div className="login-container w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Create Account</h2>
          <p className="text-center text-gray-300 mb-6">
            Join CloneGPT and start your journey
          </p>

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
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
              className="relative overflow-hidden bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-3 before:absolute before:top-0 before:left-[-75%] before:w-1/2 before:h-full before:bg-white/20 before:rotate-12 before:transition-all before:duration-500 hover:before:left-[125%]"
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
