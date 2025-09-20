import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold hover:text-green-200">🍲 FoodConnect</Link>
      <div className="space-x-4">
        {isAuthenticated && (
          <>
            {user?.role === 'donor' && (
              <Link to="/add-food" className="hover:underline">Add Food</Link>
            )}
            <Link to="/foods" className="hover:underline">Food List</Link>
            <button 
              onClick={handleLogout}
              className="hover:underline bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
