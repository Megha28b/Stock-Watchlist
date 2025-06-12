"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddStockModal = ({ isOpen, onClose, onAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [category, setCategory] = useState("");

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length > 1) {
        fetchSearchResults(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchSearchResults = async (term) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stocks/${term}`);
      const matches = res.data.quote.bestMatches || [];
      setSearchResults(matches);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock || !category) {
      alert("Please select a stock and enter category.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/watchlist", {
        data: selectedStock,
        category,
      });
      onAdded();
      onClose();
      // Reset
      setSearchTerm("");
      setSearchResults([]);
      setSelectedStock(null);
      setCategory("");
    } catch (err) {
      console.error("Failed to add stock", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4">
          Add New Stock to your watchlist
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name or symbol"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Search results */}
          <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
            {searchResults.map((item, index) => (
              <div
                key={index}
                className={`border rounded p-2 cursor-pointer text-sm ${
                  selectedStock?.["1. symbol"] === item["1. symbol"]
                    ? "bg-purple-100 border-purple-500"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedStock(item)}
              >
                <strong>{item["1. symbol"]}</strong> – {item["2. name"]}
              </div>
            ))}
          </div>

          {/* Category input */}
          <input
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
