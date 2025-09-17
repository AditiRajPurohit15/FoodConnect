import { useEffect, useState } from "react";
import { getHome } from "../services/user";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getHome().then((res) => setUser(res.data.user)).catch(() => setUser(null));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {user ? (
        <p className="mt-4">Welcome, {user.name}! 🎉</p>
      ) : (
        <p className="mt-4 text-red-600">Please login first.</p>
      )}
    </div>
  );
}
