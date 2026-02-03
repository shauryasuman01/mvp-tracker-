import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const forgotPassword = async () => {
    if (!email) return alert("Enter email first");
    await sendPasswordResetEmail(auth, email);
    alert("Reset email sent!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Execution Tracker</h1>
          <p className="text-purple-300 text-sm">Welcome back! Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && login()}
                className="w-full border-2 border-purple-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && login()}
                className="w-full border-2 border-purple-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right">
              <button
                onClick={forgotPassword}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
              </div>
            </div>

            <button
              onClick={googleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-purple-300 bg-white py-3 rounded-lg font-semibold transition shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-gray-700">
                {loading ? "Connecting..." : "Continue with Google"}
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            New here?{" "}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold transition">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
