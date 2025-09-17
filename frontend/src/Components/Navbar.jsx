import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🍲 FoodConnect</h1>
      <div className="space-x-4">
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/add-food" className="hover:underline">Add Food</Link>
        <Link to="/foods" className="hover:underline">Food List</Link>
      </div>
    </nav>
  );
}
