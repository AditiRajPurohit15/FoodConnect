import { useState } from "react";
import { addFood } from "../services/food";

export default function AddFood() {
  const [form, setForm] = useState({
    itemName: "", quantity: "", location: "", contact: "", expiryTime: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addFood(form);
      alert("Food listed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding food");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Add Food</h2>
        <input name="itemName" placeholder="Food Item" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="quantity" placeholder="Quantity" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="contact" placeholder="Contact" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="datetime-local" name="expiryTime" onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Add Food
        </button>
      </form>
    </div>
  );
}
