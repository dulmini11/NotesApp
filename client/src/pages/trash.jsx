import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import TrashNoteCard from "../components/TrashNoteCard";

const Trash = () => {
  /* ---- STATE ---- */
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

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
  const handlePermanentDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/note/${id}/permanent`);
      setNotes((prev) => prev.filter((n) => n.idNote !== id));
    } catch (err) {
      console.log(err);
    }
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
    <div className="flex">
      <Sidebar />

      <div className="flex-1 mt-10 p-4">
        <h1 className="text-3xl font-bold mb-12 text-red-600">
          🗑 Trash
        </h1>

        {/* SEARCH BAR */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultsCount={sortedNotes.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* NOTES GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {sortedNotes.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              Trash is empty.
            </p>
          )}

          {sortedNotes.map((item) => (
            <TrashNoteCard
              key={item.idNote}
              note={item}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trash;