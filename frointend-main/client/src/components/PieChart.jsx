import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!selectedMonth) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/pie-chart?month=${selectedMonth}`
        );
        console.log("Pie Chart API Response:", response.data); // Debugging Log

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No valid data received.");
          setChartData(null);
          return;
        }

        const labels = data.map((item) => item._id);
        const values = data.map((item) => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching pie chart data", error);
        setChartData(null);
      }
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <div className="bg-white shadow-md p-6 rounded-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
      {chartData && chartData.datasets && chartData.labels.length > 0 ? (
        <Pie data={chartData} />
      ) : (
        <p>No data available for the selected month</p>
      )}
    </div>
  );
};

export default PieChart;
