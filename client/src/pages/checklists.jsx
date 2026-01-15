import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { CheckSquare, Calendar, Pin } from "lucide-react";
import SearchBar from "../components/SearchBar";

const Checklists = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
    
  // Filter checklists based on search query
  const filteredChecklists = checklists.filter(checklist => {
    const query = searchQuery.toLowerCase();
    const title = (checklist.title || "").toLowerCase();
    const desc = (checklist.desc || "").toLowerCase();
    const category = (checklist.category || "").toLowerCase();
    const date = new Date(checklist.createdAt).toLocaleDateString(undefined, {
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

  // Fetch checklists
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const res = await axios.get("http://localhost:8800/checklist");
        setChecklists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChecklists();
  }, []);

  // Capitalize first letter
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Delete checklist
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8800/checklist/" + id);
      setChecklists(checklists.filter(c => c.idChecklist !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // Pin/Unpin checklist
  const handlePin = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8800/checklist/${id}/pin`, {
        isPinned: !currentStatus,
      });
      
      setChecklists(prev =>
        prev.map(checklist =>
          checklist.idChecklist === id ? { ...checklist, isPinned: !currentStatus } : checklist
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Render individual checklist card
  const renderChecklistCard = (item) => (
    <div
      key={item.idChecklist}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 flex flex-col cursor-pointer"
      onClick={() => navigate(`/checklist/view/${item.idChecklist}`)}
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
              handlePin(item.idChecklist, item.isPinned);
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
                            <Link
                              to={`/update/${item.idNote}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-gradient-to-r from-[#0ad128] to-[#188529] hover:from-[#22cb0b] hover:to-[#1c930c] text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.idNote);
                              }}
                              className="flex-1 bg-gradient-to-r from-amber-950 to-red-900 hover:from-amber-950 hover:to-amber-900 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              Delete
                            </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 mt-10 p-4">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">Checklists</h1>

        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultsCount={filteredChecklists.length}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {checklists.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">No checklists available.</p>
          )}
          {filteredChecklists.map(item => renderChecklistCard(item))}
        </div>
      </div>
    </div>
  );
};

export default Checklists;