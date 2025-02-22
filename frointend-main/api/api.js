export const fetchCombinedData = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/data"); // Replace with actual API URL
    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
