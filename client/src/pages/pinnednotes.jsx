import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import pinnoteVideo from "../assets/pinnote.mp4";
import { Sparkles, Pin } from "lucide-react";

const PinnedNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarMinimized] = useState(true);
  const expanded = !isSidebarMinimized || isSidebarHovered;

  useEffect(() => {
    const fetchPinnedNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/note");
        setNotes(res.data.filter((note) => note.isPinned));
      } catch (err) {
        console.log(err);
      }
    };
    fetchPinnedNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/note/${id}`);
      setNotes((prev) => prev.filter((n) => n.idNote !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePin = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8800/note/${id}/pin`, {
        isPinned: !currentStatus,
      });

      if (currentStatus) {
        setNotes((prev) => prev.filter((n) => n.idNote !== id));
      } else {
        setNotes((prev) =>
          prev.map((n) => (n.idNote === id ? { ...n, isPinned: true } : n))
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const title = (note.title || "").toLowerCase();
    const desc = (note.desc || "").toLowerCase();
    const category = (note.category || "").toLowerCase();
    const date = new Date(note.createdAt)
      .toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      .toLowerCase();

    return title.includes(query) || desc.includes(query) || category.includes(query) || date.includes(query);
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = (a.title || "").localeCompare(b.title || "");
        break;
      case "category":
        comparison = (a.category || "").localeCompare(b.category || "");
        break;
      case "date":
      default:
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="flex">
      <Sidebar expanded={expanded} setIsHovered={setIsSidebarHovered} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-4 md:p-6 relative z-10 transition-all duration-300
          ${expanded ? "lg:ml-60 ml-0" : "lg:ml-28 ml-0"}
          overflow-auto
        `}
      >
        {/* VIDEO */}
        <div className="fixed top-0 right-2 md:right-4 z-50">
          <video
            src={pinnoteVideo}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-40 h-40 md:w-60 md:h-60 object-cover pointer-events-none opacity-80 md:opacity-100"
          />
        </div>

        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-900 rounded-full shadow-lg">
              <Pin className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-900 to-green-600 bg-clip-text text-transparent">
              Pinned Notes
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-10 md:ml-16">
            Quickly access your pinned notes
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 mt-16">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultsCount={sortedNotes.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* NOTES GRID / EMPTY STATE */}
        {sortedNotes.length === 0 ? (
          <div className="text-center py-10 md:py-20">
            <div className="inline-block bg-gray-100 rounded-full p-4 md:p-6 mb-4">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              No pinned notes yet. Pin some notes to see them here!
            </p>
            <div className="mt-4 md:mt-6 flex justify-center">
              <Link
                to="/allnotes"
                className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#22cb0b] to-emerald-600 hover:from-[#1ab80a] hover:to-emerald-700 text-white font-semibold py-2 px-4 md:py-2 md:px-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Browse All Notes
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
            {sortedNotes.map((item) => (
              <NoteCard key={item.idNote} note={item} onPin={handlePin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinnedNotes;