import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import TrashNoteCard from "../components/TrashNoteCard";
import { Trash2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Trash = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarMinimized] = useState(true);
  const expanded = !isSidebarMinimized || isSidebarHovered;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Theme-based styling
  const mainBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-900 to-gray-800'
    : 'bg-gradient-to-br from-lime-50 to-teal-50';

  const headerGradientClass = theme === 'dark'
    ? 'bg-gradient-to-r from-green-300 to-green-500'
    : 'bg-gradient-to-r from-green-900 to-green-600';

  const subtitleClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  const trashIconBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-green-600 to-green-800'
    : 'bg-gradient-to-br from-green-500 to-green-900';

  const emptyStateBgClass = theme === 'dark'
    ? 'bg-gray-800'
    : 'bg-gray-100';

  const emptyStateIconClass = theme === 'dark'
    ? 'text-gray-600'
    : 'text-gray-400';

  const emptyStateTextClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500';

  const modalBgClass = theme === 'dark'
    ? 'bg-gray-800'
    : 'bg-white';

  const modalIconBgClass = theme === 'dark'
    ? 'bg-red-900/30'
    : 'bg-red-100';

  const modalTitleClass = theme === 'dark'
    ? 'text-gray-200'
    : 'text-gray-900';

  const modalTextClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  const cancelBtnBgClass = theme === 'dark'
    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700';

  const bgDecoration1Class = theme === 'dark'
    ? 'from-gray-700 to-gray-900/20'
    : 'from-green-100 to-emerald-300/20';

  /* ---- FETCH TRASH NOTES ---- */
  useEffect(() => {
    const fetchTrashNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/note/trash");
        setNotes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTrashNotes();
  }, []);

  /* ---- RESTORE NOTE ---- */
  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:8800/note/${id}/restore`);
      setNotes((prev) => prev.filter((n) => n.idNote !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* ---- PERMANENT DELETE ---- */
  const handlePermanentDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/note/${selectedNoteId}/permanent`);
      setNotes((prev) => prev.filter((n) => n.idNote !== selectedNoteId));
      setShowConfirm(false);
      setSelectedNoteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const openConfirmModal = (id) => {
    setSelectedNoteId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedNoteId(null);
  };

  /* ---- FILTER NOTES ---- */
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const title = (note.title || "").toLowerCase();
    const desc = (note.desc || "").toLowerCase();
    const category = (note.category || "").toLowerCase();

    return (
      title.includes(query) ||
      desc.includes(query) ||
      category.includes(query)
    );
  });

  /* ---- SORT NOTES ---- */
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
    <div className={`flex min-h-screen ${mainBgClass} transition-colors duration-300`}>
      <Sidebar expanded={expanded} setIsHovered={setIsSidebarHovered} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-4 md:p-6 relative z-10 transition-all duration-300
          ${expanded ? "lg:ml-60 ml-0" : "lg:ml-28 ml-0"}
          overflow-auto
        `}
      >
        {/* Decorative Background Elements */}
        <div className={`absolute top-0 right-0 w-60 h-52 bg-gradient-to-br rounded-full blur-3xl ${bgDecoration1Class}`}></div>
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 md:p-3 rounded-full shadow-lg ${trashIconBgClass}`}>
              <Trash2 className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black bg-clip-text text-transparent ${headerGradientClass}`}>
              Trash
            </h1>
          </div>
          <p className={`text-sm ml-10 md:ml-16 ${subtitleClass}`}>
            Recover or permanently delete notes
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
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

        {/* NOTES GRID */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
          {sortedNotes.length === 0 ? (
            <div className="col-span-full text-center py-10 md:py-20">
              <div className={`inline-block rounded-full p-4 md:p-6 mb-4 ${emptyStateBgClass}`}>
                <Trash2 className={`w-8 h-8 md:w-12 md:h-12 ${emptyStateIconClass}`} />
              </div>
              <p className={`font-medium text-sm md:text-base ${emptyStateTextClass}`}>
                Trash is empty.
              </p>
            </div>
          ) : (
            sortedNotes.map((item) => (
              <TrashNoteCard
                key={item.idNote}
                note={item}
                onRestore={handleRestore}
                onPermanentDelete={() => openConfirmModal(item.idNote)}
              />
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className={`rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl transform transition-all ${modalBgClass}`}>
            {/* Icon */}
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${modalIconBgClass}`}>
              <svg className="w-6 h-6 md:w-7 md:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            {/* Content */}
            <h3 className={`text-lg md:text-xl font-bold mb-2 text-center ${modalTitleClass}`}>
              Delete Permanently?
            </h3>
            <p className={`text-sm mb-6 md:mb-8 text-center leading-relaxed ${modalTextClass}`}>
              This note will be deleted forever. You won't be able to recover it.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handlePermanentDelete}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shadow-sm text-sm md:text-base"
              >
                Delete Forever
              </button>
              <button
                onClick={cancelDelete}
                className={`py-3 px-4 rounded-xl font-semibold transition-colors text-sm md:text-base ${cancelBtnBgClass}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;