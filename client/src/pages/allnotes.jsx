import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { Pin, Calendar } from "lucide-react";

const AllNotes = () => {

  /* ---- STATE ---- */
  const [notes, setNotes] = useState([]);

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  /* ----- FETCH NOTES ----- */
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/note");
        setNotes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllNotes();
  }, []);

  /* ---- DELETE NOTE ---- */
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8800/note/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  /* ---- PIN NOTE ---- */
  const handlePin = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8800/note/${id}/pin`, {
        isPinned: !currentStatus,
      });
      // Refresh notes after pin/unpin
      const res = await axios.get("http://localhost:8800/note");
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 mt-10 p-4">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">All Notes</h1>

        {/* Add New Note Button */}
        <div className="text-center mb-5">
          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22cb0b] to-green-500 hover:from-[#22cb0b] hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Note
          </Link>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {notes
            .slice() // create a copy to avoid mutating state
            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)) // pinned first
            .slice(0, 10) // show first 10 notes
            .map(item => (
              <div
                key={item.idNote}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 flex flex-col"
              >
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {capitalizeFirst(item.title)}
                  </h2>

                  {/* Pin Button */}
                  <button
                    onClick={() => handlePin(item.idNote, item.isPinned)}
                    className={`flex items-center justify-center p-2 rounded-3xl shadow-md transition-all duration-200 transform hover:scale-105 ${
                      item.isPinned
                        ? "bg-yellow-400 text-white hover:bg-yellow-500"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    <Pin className={`w-3 h-3 ${item.isPinned ? "text-white" : "text-gray-800"}`} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                  {capitalizeFirst(item.desc)}
                </p>

                <span className="inline-block bg-gradient-to-r from-green-100 to-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                  {capitalizeFirst(item.category)}
                </span>

                {/* Date */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleDelete(item.idNote)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-[#22cb0b] hover:from-[#22cb0b] hover:to-[#0a7e04] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/update/${item.idNote}`}
                    className="flex-1 bg-gradient-to-r from-[#0ad128] to-[#188529] hover:from-[#22cb0b] hover:to-[#1c930c] text-white text-xs font-semibold py-2 px-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Update
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllNotes;
