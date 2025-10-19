import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import "../Styles/login.css"; // ✅ correct path


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Particle effect
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

    for (let i = 0; i < 120; i++) particlesArray.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => canvas.remove();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Left Section */}
      <div
        className="md:w-1/2 flex flex-col justify-center items-center text-white p-8 animated-gradient-panel bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581092580497-53a7aa8c8c04?fit=crop&w=800&q=80')",
        }}
      >
        <h1 className="text-5xl font-bold mb-4">CloneGPT</h1>
        <p className="text-lg text-center max-w-md">
          AI-powered assistant for smarter workflows. Log in to start your journey!
        </p>
      </div>

      {/* Right Section: Login Form */}
      <div className="md:w-1/2 flex justify-center items-center p-8 bg-gray-900 relative z-10">
        <div className="login-container w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Welcome Back
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Login to access your CloneGPT account
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-300" size={18} />
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

            {/* Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-3 before:absolute before:top-0 before:left-[-75%] before:w-1/2 before:h-full before:bg-white/20 before:rotate-12 before:transition-all before:duration-500 hover:before:left-[125%]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-400 hover:text-green-500 font-semibold cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
