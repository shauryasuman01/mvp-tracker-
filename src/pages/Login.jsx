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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">

        <h1 className="text-2xl font-semibold mb-4 text-center">Welcome Back</h1>

        <input className="border rounded p-2 w-full mb-2" placeholder="Email"
          onChange={e=>setEmail(e.target.value)} />

        <input className="border rounded p-2 w-full mb-1" type="password"
          placeholder="Password" onChange={e=>setPassword(e.target.value)} />

        <p onClick={forgotPassword}
          className="text-sm text-right text-indigo-600 cursor-pointer mb-3">
          Forgot password?
        </p>

        <button
          onClick={login}
          disabled={loading}
          className="bg-indigo-600 text-white w-full py-2 rounded mb-2 flex justify-center"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          onClick={googleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full border py-2 rounded mb-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
               className="w-5" />
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm">
          New here? <Link to="/register" className="text-indigo-600">Create account</Link>
        </p>

      </div>
    </div>
  );
}
