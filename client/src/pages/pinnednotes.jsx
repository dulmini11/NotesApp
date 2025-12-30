import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { Pin, Calendar } from "lucide-react";
import SearchBar from "../components/SearchBar";

const PinnedNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
    
  // Filter notes based on search query
    
  const filteredNotes = notes.filter(note => {
  const query = searchQuery.toLowerCase();
  const title = (note.title || "").toLowerCase();
  const desc = (note.desc || "").toLowerCase();
  const category = (note.category || "").toLowerCase();
  const date = new Date(note.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
  }).toLowerCase();
 
  return (
      title.includes(query) ||
      desc.includes(query) ||
      category.includes(query) ||
      date.includes(query)
  );  
});

  // Fetch pinned notes
  useEffect(() => {
    const fetchPinnedNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/note");
        const pinned = res.data.filter(note => note.isPinned);
        setNotes(pinned);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPinnedNotes();
  }, []);

  // Capitalize first letter
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8800/note/" + id);
      setNotes(notes.filter(n => n.idNote !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // Pin/Unpin note
  const handlePin = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8800/note/${id}/pin`, {
        isPinned: !currentStatus,
      });
      
      // If unpinning (currentStatus is true), remove from list
      if (currentStatus) {
        setNotes(prev => prev.filter(note => note.idNote !== id));
      } else {
        // If pinning, update the state
        setNotes(prev =>
          prev.map(note =>
            note.idNote === id ? { ...note, isPinned: !currentStatus } : note
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Render individual note card
  const renderNoteCard = (item) => (
    <div
      key={item.idNote}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 flex flex-col cursor-pointer"
      onClick={() => navigate(`/view/${item.idNote}`)} // <-- navigate to view page
    >
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
            {capitalizeFirst(item.title)}
          </h2>

          {/* Pin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePin(item.idNote, item.isPinned);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.idNote);
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-[#22cb0b] hover:from-[#22cb0b] hover:to-[#0a7e04] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Delete
          </button>

          <Link
            onClick={(e) => e.stopPropagation()}
            to={`/update/${item.idNote}`}
            className="flex-1 bg-gradient-to-r from-[#0ad128] to-[#188529] hover:from-[#22cb0b] hover:to-[#1c930c] text-white text-xs font-semibold py-2 px-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Update
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 mt-10 p-4">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">Pinned Notes</h1>

        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultsCount={filteredNotes.length}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {notes.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">No pinned notes available.</p>
          )}
          {filteredNotes.map(item => renderNoteCard(item))}
        </div>
      </div>
    </div>
  );
};

export default PinnedNotes;
