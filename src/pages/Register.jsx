import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  const googleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">

        <h1 className="text-2xl font-semibold mb-4 text-center">Create Account</h1>

        <input
          className="border rounded p-2 w-full mb-2"
          placeholder="Email"
          onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && signup()}
        />

        <input
          className="border rounded p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && signup()}
        />

        <button onClick={signup} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2 rounded mb-2">
          Sign Up
        </button>

        <button
          onClick={googleSignup}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 bg-white py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>


        <p className="text-center text-sm">
          Already have account? <Link to="/" className="text-emerald-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
