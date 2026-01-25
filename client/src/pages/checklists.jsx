import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { CheckSquare, ListChecks, Calendar, Pin, Sparkles } from "lucide-react";
import SearchBar from "../components/SearchBar";

const Checklists = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarMinimized] = useState(true);
  const expanded = !isSidebarMinimized || isSidebarHovered;

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

    return title.includes(query) || desc.includes(query) || category.includes(query) || date.includes(query);
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

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8800/checklist/" + id);
      setChecklists(checklists.filter(c => c.idChecklist !== id));
    } catch (err) {
      console.log(err);
    }
  };

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
      <Sidebar expanded={expanded} setIsHovered={setIsSidebarHovered} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-8 relative z-10 transition-all duration-300
          ${expanded ? "ml-60" : "ml-28"}  /* Adjusted to sidebar width + spacing */
          overflow-auto
        `}
      >
        <div className="flex-1 mt-10 p-4">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-900 rounded-full shadow-lg">
                <ListChecks className="text-white" size={19} />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-green-900 to-green-600 bg-clip-text text-transparent">
                Checklists
              </h1>
            </div>
            <p className="text-sm text-gray-600 ml-16">
              Organize tasks with simple checklists
            </p>
          </div>

          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultsCount={filteredChecklists.length}
          />

          {filteredChecklists.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No checklists yet. Create your first checklist!</p>
              <div className="mt-6 flex justify-center">
                <Link
                  to="/add-checklist"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#22cb0b] to-emerald-600 hover:from-[#1ab80a] hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <CheckSquare className="w-5 h-5" />
                  Create New Checklist
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {filteredChecklists.map(item => renderChecklistCard(item))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklists;