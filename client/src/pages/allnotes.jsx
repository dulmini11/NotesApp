import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { Pin, Calendar } from "lucide-react";
import SearchBar from "../components/SearchBar";

const AllNotes = () => {

  /* ---- STATE ---- */
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

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
      setNotes(notes.filter(n => n.idNote !== id));
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
      setNotes(prev =>
        prev.map(note =>
          note.idNote === id ? { ...note, isPinned: !currentStatus } : note
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

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

          // Sort notes - ALWAYS pin first
          const sortedNotes = [...filteredNotes].sort((a, b) => {
            // ALWAYS sort pinned notes first
            if (a.isPinned !== b.isPinned) {
              return b.isPinned ? 1 : -1;
            }

            // Then apply secondary sort
            let comparison = 0;
            switch (sortBy) {
              case 'name':
                comparison = (a.title || "").localeCompare(b.title || "");
                break;
              case 'date':
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
                break;
              case 'category':
                comparison = (a.category || "").localeCompare(b.category || "");
                break;
              case 'pinned':
                return 0; // Already sorted by pin
              default:
                comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
          });

          // Filter only pinned notes if sortBy is 'pinned'
          const displayNotes = sortBy === 'pinned' 
            ? sortedNotes.filter(note => note.isPinned)
            : sortedNotes;

          // Group notes by first letter (for name sort)
          const groupByLetter = () => {
            const grouped = {};
            displayNotes.forEach(note => {
              const firstLetter = (note.title || "A").charAt(0).toUpperCase();
              if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
              }
              grouped[firstLetter].push(note);
            });
            return grouped;
          };

          // Group notes by date
          const groupByDate = () => {
            const grouped = {};
            displayNotes.forEach(note => {
              const dateKey = new Date(note.createdAt).toLocaleDateString('en-CA');
              if (!grouped[dateKey]) {
                grouped[dateKey] = [];
              }
              grouped[dateKey].push(note);
            });
            return grouped;
          };

          // Group notes by category
          const groupByCategory = () => {
            const grouped = {};
            displayNotes.forEach(note => {
              const cat = capitalizeFirst(note.category || "Uncategorized");
              if (!grouped[cat]) {
                grouped[cat] = [];
              }
              grouped[cat].push(note);
            });
            return grouped;
          };

          // Render individual note card
          const renderNoteCard = (item) => (
            <div
              key={item.idNote}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 flex flex-col"
            >
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {capitalizeFirst(item.title)}
                  </h2>
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
          );

          // Render grouped content
          const renderContent = () => {
            if (sortBy === 'name') {
              const grouped = groupByLetter();
              const letters = Object.keys(grouped).sort();
              return letters.map(letter => (
                <div key={letter} className="mb-8">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex items-center justify-center w-10 h-10 border-3 border-green-500 text-green-700 bg-green-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 font-bold text-md">
                      {letter}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {grouped[letter].map(item => renderNoteCard(item))}
                  </div>
                </div>
              ));
            } else if (sortBy === 'date') {
              const grouped = groupByDate();
              const dates = Object.keys(grouped).sort((a, b) => {
                return sortOrder === 'desc' 
                  ? new Date(b) - new Date(a) 
                  : new Date(a) - new Date(b);
              });
              return dates.map(date => (
                <div key={date} className="mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 px-5 py-3 rounded-r-xl">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-md text-gray-800">{date}</span>
                    </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-0.5 bg-green-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
                      </div>
          
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {grouped[date].map(item => renderNoteCard(item))}
                    </div>
                  </div>
                </div>
              ));
            } else if (sortBy === 'category') {
              const grouped = groupByCategory();
              const categories = Object.keys(grouped).sort();
              return categories.map(cat => (
                <div key={cat} className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 border-3 border-green-500 text-green-700 bg-green-50 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 font-bold text-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {cat}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {grouped[cat].map(item => renderNoteCard(item))}
                  </div>
                </div>
              ));
            } else {
              // For 'pinned' or default
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                  {displayNotes.map(item => renderNoteCard(item))}
                </div>
              );
            }
          };

          return (
            <div className="flex">
              <Sidebar />
              <div className="flex-1 mt-10 p-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-bold text-gray-800">All Notes</h1>
                  <div className="text-center mb-5">
                    <Link
                      to="/add"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22cb0b] to-green-500 hover:from-[#22cb0b] hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Note
                    </Link>
                  </div>
                </div>
                <SearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  resultsCount={filteredNotes.length}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
                {renderContent()}
      </div>
    </div>
  );
};

export default AllNotes;