import { useEffect, useState } from "react";
import { getAvailableFoods } from "../services/food";

export default function Dashboard() {

  const [foods, setFoods] = useState([]);
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalKg: 0,
    co2Reduction: 0
  });

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const res = await getAvailableFoods();
      setFoods(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  const calculateStats = (foodData) => {
    const totalMeals = foodData.length * 4; // Assuming 4 meals per food item
    const totalKg = foodData.reduce((sum, food) => {
      const quantity = parseInt(food.quantity) || 0;
      return sum + quantity;
    }, 0);
    const co2Reduction = Math.round(totalKg * 0.5); // Rough estimate: 0.5kg CO2 per kg of food

    setStats({
      totalMeals,
      totalKg,
      co2Reduction
    });
  };

  const getTopContributors = () => {
    const donorCounts = {};
    foods.forEach(food => {
      if (food.donorId?.name) {
        donorCounts[food.donorId.name] = (donorCounts[food.donorId.name] || 0) + 1;
      }
    });
    
    return Object.entries(donorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const getRecentPickups = () => {
    return foods.filter(food => food.status === 'picked' || food.status === 'delivered')
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impact Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Meals Saved */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Meals Saved</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMeals.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
            </div>
          </div>

          {/* Food Diverted */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Food Diverted (kg)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalKg.toLocaleString()} kg</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* CO2 Reduction */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">CO2 Reduction (kg)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.co2Reduction.toLocaleString()} kg</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Food Waste Pickup */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Food Waste Pickup</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
            
            {/* Map-like visualization */}
            <div className="relative bg-gray-100 rounded-lg h-48 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Pickup Locations</p>
                </div>
              </div>
              
              {/* Scattered pins */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute top-8 right-8 w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute top-12 left-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>

            {/* Recent pickups list */}
            <div className="mt-4 space-y-2">
              {getRecentPickups().map((food) => (
                <div key={food._id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      food.status === 'picked' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium">{food.itemName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{food.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {getTopContributors().map((contributor) => (
                <div key={contributor.name} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{contributor.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                      <p className="text-xs text-gray-500">Donor</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{contributor.count}w</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
