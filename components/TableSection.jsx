"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from "axios";
import AddStockModal from "./AddStockModal";
import { Bounce, toast, ToastContainer } from "react-toastify";

const TableSection = ({ stock, setStock }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/watchlist/");
      const items = res.data.items || [];
      setWatchlist(items);

      if (items.length > 0) {
        setStock(items[0]);
      }
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setCategoryInput(item.category);
  };

  const handleSave = async (item) => {
    try {
      await axios.put(`http://localhost:5000/api/watchlist/${item.id}`, {
        "1. symbol": item.symbol,
        "2. name": item.name,
        category: categoryInput,
      });

      setEditingId(null);
      fetchWatchlist();
    } catch (err) {
      console.error("Update failed", err);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this stock?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${id}`);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete stock", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-6 bg-black/30 rounded-2xl text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        transition={Bounce}
      />
      <div className="flex gap-2 justify-between items-center">
        <h2 className="text-2xl font-bold w-max">My Watch List</h2>

        <button
          className="p-2 rounded-md bg-black/70 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Add to watchlist
        </button>
      </div>

      <div className="w-full max-h-[450px] lg:max-h[500px] overflow-y-auto custom-scrollbar">
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="bg-[#2d002d] text-white">
              <th className="p-2">Name</th>
              <th className="p-2">Symbol</th>
              <th className="p-2">Category</th>
              <th className="p-2">Region</th>
              <th className="p-2">Type</th>
              <th className="p-2">Currency</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {watchlist.length > 0 ? (
              watchlist.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-600 hover:bg-purple-300/20 border-b-2 border-b-gray-900"
                  onClick={() => setStock(item)}
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.symbol}</td>
                  <td className="p-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="px-2 py-1 text-white border-2 border-white rounded-lg max-w-[150px]"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                        />
                        <button
                          onClick={() => handleSave(item)}
                          className="text-sm bg-purple-800 hover:bg-purple-700 px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span>{item.category}</span>
                        <CiEdit
                          size={20}
                          title="Edit category"
                          className="cursor-pointer"
                          onClick={() => handleEditClick(item)}
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-2">{item.region}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.currency}</td>
                  <td className="p-2">
                    <button
                      className="cursor-pointer hover:text-red-700"
                      title="Delete from watchlist"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdOutlineDeleteForever size={24} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-gray-400" colSpan={7}>
                  No stocks in your watchlist.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchWatchlist}
      />
    </div>
  );
};

export default TableSection;
