import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/user";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(form);
      // Get user data from the response or fetch it
      const { getHome } = await import("../services/user");
      const userResponse = await getHome();
      login(userResponse.data.user);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-gray-600">
          New user? <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}
