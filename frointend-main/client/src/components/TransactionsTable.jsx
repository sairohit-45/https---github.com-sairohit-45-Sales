import { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("January");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/transactions",
          {
            params: { month, search, page, perPage },
          }
        );
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [month, search, page]);

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      {/* Search and Month Filter */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded w-1/2"
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

      {/* Transactions Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Sold</th>
              <th className="border p-2">Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="text-center">
                  <td className="border p-2">{t.title}</td>
                  <td className="border p-2">{t.description}</td>
                  <td className="border p-2">${t.price}</td>
                  <td className="border p-2">{t.category}</td>
                  <td className="border p-2">{t.sold ? "Yes" : "No"}</td>
                  <td className="border p-2">
                    {new Date(t.dateOfSale).toDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
