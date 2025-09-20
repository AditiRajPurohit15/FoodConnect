import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAvailableFoods, updateFoodStatus, deleteDeliveredFood } from "../services/food";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const timeoutsRef = useRef({});

  useEffect(() => {
    fetchFoods();
    
    // Cleanup timeouts on unmount
    return () => {
      Object.values(timeoutsRef.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await getAvailableFoods();
      setFoods(res.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      alert("Error fetching foods");
    }
  };

  const handlePickup = async (foodId) => {
    if (!window.confirm("Are you sure you want to pick up this food item?")) {
      return;
    }

    setLoading(true);
    try {
      await updateFoodStatus(foodId, "picked");
      // Update the food status in the list instead of removing it
      setFoods(foods.map(food => 
        food._id === foodId ? { ...food, status: 'picked' } : food
      ));
      alert("Food item picked up successfully!");
    } catch (error) {
      console.error("Error picking up food:", error);
      alert(error.response?.data?.message || "Error picking up food");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (foodId) => {
    if (!window.confirm("Are you sure you want to mark this food item as delivered?")) {
      return;
    }

    setLoading(true);
    try {
      await updateFoodStatus(foodId, "delivered");
      // Update the food status in the list
      setFoods(foods.map(food => 
        food._id === foodId ? { ...food, status: 'delivered' } : food
      ));
      alert("Food item marked as delivered! It will be removed in 2 minutes.");
      
      // Auto-delete after 2 minutes (120,000 milliseconds)
      const timeoutId = setTimeout(async () => {
        try {
          await deleteDeliveredFood(foodId);
          setFoods(foods.filter(food => food._id !== foodId));
          alert("Food item has been automatically removed after delivery.");
        } catch (error) {
          console.error("Error auto-deleting delivered food:", error);
          // Still remove from UI even if backend deletion fails
          setFoods(foods.filter(food => food._id !== foodId));
        }
        // Clean up timeout reference
        delete timeoutsRef.current[foodId];
      }, 120000); // 2 minutes
      
      // Store timeout reference for cleanup
      timeoutsRef.current[foodId] = timeoutId;
      
    } catch (error) {
      console.error("Error delivering food:", error);
      alert(error.response?.data?.message || "Error delivering food");
    } finally {
      setLoading(false);
    }
  };

  // Only show pickup button for volunteers and NGOs
  const canPickup = user?.role === 'volunteer' || user?.role === 'ngo';

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Available Foods</h2>
      {foods.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No available food items at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div key={food._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-green-800">{food.itemName}</h3>
              <div className="space-y-2 mt-3">
                <p><span className="font-semibold">Quantity:</span> {food.quantity}</p>
                <p><span className="font-semibold">Location:</span> {food.location}</p>
                <p><span className="font-semibold">Contact:</span> {food.contact}</p>
                <p><span className="font-semibold">Donor:</span> {food.donorId?.name}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    food.status === 'available' ? 'bg-green-100 text-green-800' : 
                    food.status === 'picked' ? 'bg-orange-100 text-orange-800' :
                    food.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {food.status}
                  </span>
                </p>
                {canPickup && (
                  <div className="mt-3 space-y-2">
                    {food.status === 'available' && (
                      <button
                        onClick={() => handlePickup(food._id)}
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Picking up..." : "Pick Up"}
                      </button>
                    )}
                    {food.status === 'picked' && (
                      <button
                        onClick={() => handleDeliver(food._id)}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Delivering..." : "Delivered"}
                      </button>
                    )}
                    {food.status === 'delivered' && (
                      <div className="text-center text-sm text-gray-500 bg-gray-100 py-2 px-4 rounded">
                        Will be removed automatically
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
