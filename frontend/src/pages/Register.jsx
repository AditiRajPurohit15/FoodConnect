import { useState } from "react";
import { registerUser } from "../services/user";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "", role: "donor"
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("User registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
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
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
