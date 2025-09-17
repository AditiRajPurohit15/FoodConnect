import { useEffect, useState } from "react";
import { getAvailableFoods } from "../services/food";

export default function FoodList() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    getAvailableFoods().then((res) => setFoods(res.data));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Available Foods</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <div key={food._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{food.itemName}</h3>
            <p>Quantity: {food.quantity}</p>
            <p>Location: {food.location}</p>
            <p>Contact: {food.contact}</p>
            <p>Donor: {food.donorId?.name}</p>
            <p>Status: {food.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
