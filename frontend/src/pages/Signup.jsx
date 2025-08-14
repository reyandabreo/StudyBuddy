import { useState } from "react";
import { FaUserPlus, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { signupUser } from "../services/authService";
import { useAuth } from "../context/authContext.jsx";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try{
      const {user, token } = await signupUser({username, email, password});
      login({user, token});
      navigate("/dashboard");

    }catch(error){
      alert(error.response?.data?.message || "Signup failed. Please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-10">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text flex items-center justify-center gap-3 mb-6">
          <FaUserPlus className="text-cyan-400" />
          Create an Account
        </h2>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm text-white/70 mb-1">Username</label>
            <div className="flex items-center bg-white/5 rounded-md border border-white/20 px-3 py-2">
              <FaUserPlus className="text-white/40 mr-2" />
              <input
                type="text"
                placeholder="username123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-transparent w-full text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <div className="flex items-center bg-white/5 rounded-md border border-white/20 px-3 py-2">
              <FaEnvelope className="text-white/40 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent w-full text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <div className="flex items-center bg-white/5 rounded-md border border-white/20 px-3 py-2">
              <FaLock className="text-white/40 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent w-full text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-yellow-400 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-sm text-center text-white/40 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
