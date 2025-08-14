import { useState } from "react";
import { FaLock, FaUserAlt, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/authContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuth();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    
    try{
      const data = await loginUser({email, password});
      localStorage.setItem("token", data.token); // <-- Make sure this matches your backend response
      login(data);
      navigate("/dashboard");
    }catch(error){
      alert(error.response?.data?.message || "login failed. Try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-10">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text flex items-center justify-center gap-3 mb-6">
          <FaSignInAlt className="text-cyan-400" />
          Log In to StudyAI
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <div className="flex items-center bg-white/5 rounded-md border border-white/20 px-3 py-2">
              <FaUserAlt className="text-white/40 mr-2" />
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
            Log In
          </button>
        </form>

        <div className="text-sm text-center text-white/40 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-pink-400 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
