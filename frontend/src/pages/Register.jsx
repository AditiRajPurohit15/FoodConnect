import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { registerUser } from "../services/user";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "", role: "donor"
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      // Get user data after registration
      const { getHome } = await import("../services/user");
      const userResponse = await getHome();
      login(userResponse.data.user);
      alert("User registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="mobile" placeholder="Mobile" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="donor">Donor</option>
          <option value="volunteer">Volunteer</option>
          <option value="ngo">NGO</option>
        </select>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an Account? <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}
