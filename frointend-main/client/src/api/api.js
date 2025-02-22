import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Change this when deploying

export const fetchTransactions = async (
  month,
  page = 1,
  perPage = 10,
  search = ""
) => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      params: { month, page, perPage, search },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const fetchStatistics = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/statistics`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {};
  }
};

export const fetchBarChart = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/bar-chart`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bar chart:", error);
    return {};
  }
};

export const fetchPieChart = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/pie-chart`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pie chart:", error);
    return {};
  }
};

export const fetchCombinedData = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/combined`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching combined data:", error);
    return {};
  }
};
