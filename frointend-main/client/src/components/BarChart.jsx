// import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  if (!data || typeof data !== "object") {
    return <p className="text-red-500">Invalid data provided</p>;
  }

  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Items",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Use a transparent color for better visuals
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-6 bg-white p-4 shadow-md rounded">
      <h2 className="text-xl font-semibold mb-3">Price Range Distribution</h2>
      <Bar
        data={chartData}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default BarChart;
