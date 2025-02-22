require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  "mongodb+srv://santhosh:lakshminivas@cluster0.7xjwmcj.mongodb.net/";

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema
const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  image: String,
  dateOfSale: Date,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// **API to Fetch and Seed Data**
app.get("/api/initialize-db", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);

    res.json({ message: "Database Initialized Successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error initializing database" });
  }
});

// **API to List Transactions with Search & Pagination**
app.get("/api/transactions", async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(`${month} 31, 2100`);

  const query = {
    dateOfSale: { $gte: startDate, $lte: endDate },
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: !isNaN(search) ? Number(search) : undefined },
    ].filter(Boolean),
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const totalCount = await Transaction.countDocuments(query);

    res.json({ transactions, totalCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// **API for Statistics**
app.get("/api/statistics", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(`${month} 31, 2100`);

  try {
    const totalSales = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const soldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: true,
    });

    const notSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: false,
    });

    res.json({
      totalSalesAmount: totalSales[0]?.totalAmount || 0,
      totalSoldItems: soldItems,
      totalNotSoldItems: notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching statistics" });
  }
});

// **API for Bar Chart (Price Ranges)**
app.get("/api/bar-chart", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(`${month} 31, 2100`);

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  try {
    const result = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: startDate, $lte: endDate },
          price: { $gte: range.min, $lte: range.max },
        });
        return { range: `${range.min}-${range.max}`, count };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bar chart data" });
  }
});

// **API for Pie Chart (Category Counts)**
app.get("/api/pie-chart", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(
    `2024-${new Date(`${month} 1, 2024`).getMonth() + 1}-01T00:00:00.000Z`
  );
  const endDate = new Date(
    `2024-${new Date(`${month} 1, 2024`).getMonth() + 1}-31T23:59:59.999Z`
  );

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pie chart data" });
  }
});

// **API to Combine All Responses**
app.get("/api/combined-data", async (req, res) => {
  const { month } = req.query;

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:${PORT}/api/transactions?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/statistics?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/pie-chart?month=${month}`),
    ]);

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching combined data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
