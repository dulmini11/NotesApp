import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { Calendar, Sparkles, CheckSquare, Archive as ArchiveIcon } from "lucide-react";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import AllNote from "../assets/allnote.mp4";

const AllNotes = () => {
  /* ---- STATE ---- */
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarMinimized] = useState(true);
  const [showArchived, setShowArchived] = useState(false); // NEW: Archive toggle state
  const expanded = !isSidebarMinimized || isSidebarHovered;

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  /* ----- FETCH NOTES ----- */
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        // NEW: Choose endpoint based on archive view
        const endpoint = showArchived 
          ? "http://localhost:8800/note/archived" // Fetch only archived notes
          : "http://localhost:8800/note"; // Fetch non-archived notes
        
        const res = await axios.get(endpoint);
        setNotes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllNotes();
  }, [showArchived]); // Re-fetch when archive view changes

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

  /* ---- ARCHIVE NOTE ---- */
  const handleArchive = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8800/note/${id}/archive`, {
        isArchived: !currentStatus,
      });
      setNotes(prev =>
        prev.map(note =>
          note.idNote === id ? { ...note, isArchived: !currentStatus } : note
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

  // Sort notes (pinned first, then by selected criteria)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;

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
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const displayNotes = sortBy === 'pinned' 
    ? sortedNotes.filter(note => note.isPinned)
    : sortedNotes;

  const groupByLetter = () => {
    const grouped = {};
    displayNotes.forEach(note => {
      const firstLetter = (note.title || "A").charAt(0).toUpperCase();
      if (!grouped[firstLetter]) grouped[firstLetter] = [];
      grouped[firstLetter].push(note);
    });
    return grouped;
  };

  const groupByDate = () => {
    const grouped = {};
    displayNotes.forEach(note => {
      const dateKey = new Date(note.createdAt).toLocaleDateString('en-CA');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(note);
    });
    return grouped;
  };

  const groupByCategory = () => {
    const grouped = {};
    displayNotes.forEach(note => {
      const cat = capitalizeFirst(note.category || "Uncategorized");
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(note);
    });
    return grouped;
  };

  // Render grouped content
  const renderContent = () => {
    if (sortBy === 'name') {
      const grouped = groupByLetter();
      return Object.keys(grouped).sort().map(letter => (
        <div key={letter} className="mb-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center justify-center w-10 h-10 border-3 border-green-500 text-green-700 bg-green-50 rounded-2xl shadow-lg font-bold text-md">
              {letter}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {grouped[letter].map(item => (
              <NoteCard 
                key={item.idNote}
                note={item}
                onPin={handlePin}
                onDelete={handleDelete}
                onArchive={handleArchive} // NEW: Pass archive handler
              />
            ))}
          </div>
        </div>
      ));
    } else if (sortBy === 'date') {
      const grouped = groupByDate();
      return Object.keys(grouped).sort((a, b) => sortOrder === 'desc' ? new Date(b) - new Date(a) : new Date(a) - new Date(b)).map(date => (
        <div key={date} className="mb-8">
          <div className="bg-white p-4 md:p-6 mt-8 md:mt-16 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 px-4 md:px-5 py-3 rounded-r-xl">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                <span className="font-bold text-sm md:text-md text-gray-800">{date}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {grouped[date].map(item => (
                <NoteCard 
                  key={item.idNote}
                  note={item}
                  onPin={handlePin}
                  onDelete={handleDelete}
                  onArchive={handleArchive} // NEW: Pass archive handler
                />
              ))}
            </div>
          </div>
        </div>
      ));
    } else if (sortBy === 'category') {
      const grouped = groupByCategory();
      return Object.keys(grouped).sort().map(cat => (
        <div key={cat} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 border-3 border-green-500 text-green-700 bg-green-50 px-4 md:px-6 py-3 rounded-2xl shadow-lg font-bold text-sm md:text-md">
              {cat}
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {grouped[cat].map(item => (
              <NoteCard 
                key={item.idNote}
                note={item}
                onPin={handlePin}
                onDelete={handleDelete}
                onArchive={handleArchive} // NEW: Pass archive handler
              />
            ))}
          </div>
        </div>
      ));
    } else {
      // For 'pinned' or default
      return (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {displayNotes.map(item => (
            <NoteCard 
              key={item.idNote}
              note={item}
              onPin={handlePin}
              onDelete={handleDelete}
              onArchive={handleArchive} // NEW: Pass archive handler
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar expanded={expanded} setIsHovered={setIsSidebarHovered} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-3 md:p-4 relative z-10 transition-all duration-300
          ${expanded ? "lg:ml-60 ml-0" : "lg:ml-28 ml-0"}  /* Responsive margins */
          overflow-auto
        `}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-900 rounded-full shadow-lg">
                <CheckSquare className="text-white" size={19} />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {showArchived ? "Archived Notes" : "All Notes"} {/* NEW: Dynamic title */}
              </h1>
            </div>
            <p className="text-sm text-gray-600 ml-16">
              {showArchived 
                ? "View and manage your archived notes" 
                : "View and manage all your notes"} {/* NEW: Dynamic subtitle */}
            </p>
          </div>
          
          {/* BUTTONS SECTION */}
          <div className="flex flex-col xs:flex-row items-center gap-3 mb-5">
            {notes.length >= 1 && (
              <video
                src={AllNote}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="absolute top-0 right-0 w-[200px] h-[120px] md:w-[300px] md:h-[170px] lg:w-[400px] lg:h-[220px] xl:w-[600px] xl:h-[340px] pointer-events-none mix-blend-screen opacity-70 md:opacity-100"
              />
            )}
            
            <div className="flex items-center gap-2">
              {/* Archive Toggle Button - NEW */}
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`inline-flex items-center gap-2 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base relative z-10
                  ${showArchived 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800' 
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'}`}
              >
                <ArchiveIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">
                  {showArchived ? "Show Active Notes" : "Show Archived"}
                </span>
                <span className="md:hidden">
                  {showArchived ? "Active" : "Archive"}
                </span>
              </button>
              
              {/* New Note Button */}
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22cb0b] to-green-400 hover:from-[#22cb0b] hover:to-green-700 text-white font-bold py-2 px-4 md:py-3 md:px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base relative z-10"
              >
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden xs:inline">New Note</span>
                <span className="xs:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultsCount={filteredNotes.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* CONTENT */}
        {displayNotes.length === 0 ? (
          <div className="text-center py-10 md:py-20">
            <div className="inline-block bg-gray-100 rounded-full p-4 md:p-6 mb-4">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              {showArchived 
                ? "No archived notes found. Archive notes to see them here." 
                : "No notes found. Create your first note!"}
            </p>
            <div className="mt-4 md:mt-6 flex justify-center gap-3">
              {showArchived ? (
                <button
                  onClick={() => setShowArchived(false)}
                  className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 md:py-2 md:px-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  <ArchiveIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Back to Active Notes
                </button>
              ) : (
                <Link
                  to="/add"
                  className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#22cb0b] to-emerald-600 hover:from-[#1ab80a] hover:to-emerald-700 text-white font-semibold py-2 px-4 md:py-2 md:px-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Note
                </Link>
              )}
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AllNotes;