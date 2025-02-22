import { useState, useEffect } from "react";
import { fetchCombinedData } from "../api/api";
import TransactionsTable from "../components/TransactionsTable.jsx";
import Statistics from "../components/Statistics.jsx";
import BarChart from "../components/BarChart.jsx";
import PieChart from "../components/PieChart.jsx";

const Dashboard = () => {
  const [month, setMonth] = useState("January");
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCombinedData(month);
      setData(result);
    };
    getData();
  }, [month]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Transaction Dashboard</h1>

      <select
        className="p-2 border rounded"
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

      {data ? (
        <div>
          <Statistics data={data.statistics} />
          <BarChart data={data.barChart} />
          <PieChart data={data.pieChart} />
          <TransactionsTable transactions={data.transactions} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
