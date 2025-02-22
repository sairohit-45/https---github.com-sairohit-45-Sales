import { useState, useEffect } from "react";
import axios from "axios";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    soldItems: 0,
    unsoldItems: 0,
  });
  const [month, setMonth] = useState("January");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/statistics",
          {
            params: { month },
          }
        );

        console.log("API Response:", response.data); // Debugging

        if (!response.data) {
          console.warn("No data received");
          setStats({ totalSales: 0, soldItems: 0, unsoldItems: 0 });
        } else {
          setStats({
            totalSales: response.data.totalSalesAmount || 0,
            soldItems: response.data.totalSoldItems || 0,
            unsoldItems: response.data.totalNotSoldItems || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics", error);
        setStats({ totalSales: 0, soldItems: 0, unsoldItems: 0 });
      }
      setLoading(false);
    };

    fetchStatistics();
  }, [month]);

  return (
    <div className="p-6 bg-white shadow-md rounded w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Month:</label>
        <select
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-gray-100 rounded text-lg font-semibold">
            Total Sales:{" "}
            <span className="text-green-600">${stats.totalSales}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded text-lg font-semibold">
            Sold Items: <span className="text-blue-600">{stats.soldItems}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded text-lg font-semibold">
            Unsold Items:{" "}
            <span className="text-red-600">{stats.unsoldItems}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
