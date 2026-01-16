import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import pinnoteVideo from "../assets/pinnote.mp4";

const PinnedNotes = () => {
  /* ---- STATE ---- */
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  /* ---- FETCH PINNED NOTES ---- */
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

  /* ---- DELETE NOTE ---- */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/note/${id}`);
      setNotes((prev) => prev.filter((n) => n.idNote !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* ---- PIN / UNPIN NOTE ---- */
  const handlePin = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8800/note/${id}/pin`, {
        isPinned: !currentStatus,
      });

      // If unpinned → remove from pinned list
      if (currentStatus) {
        setNotes((prev) => prev.filter((n) => n.idNote !== id));
      } else {
        setNotes((prev) =>
          prev.map((n) =>
            n.idNote === id ? { ...n, isPinned: true } : n
          )
        );
      }
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
    const date = new Date(note.createdAt)
      .toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      .toLowerCase();

    return (
      title.includes(query) ||
      desc.includes(query) ||
      category.includes(query) ||
      date.includes(query)
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

      <div className="flex-1 mt-10 p-4 relative">
        {/* VIDEO */}
        <div className="fixed top-0 right-4 z-50">
          <video
            src={pinnoteVideo}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-60 h-60 object-cover pointer-events-none"
          />
        </div>

        <h1 className="text-3xl font-bold mb-12 text-gray-800">
          Pinned Notes
        </h1>

        {/* SEARCH BAR (WITH CLEAR SUPPORT) */}
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
              No pinned notes available.
            </p>
          )}

          {sortedNotes.map((item) => (
            <NoteCard
              key={item.idNote}
              note={item}
              onPin={handlePin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinnedNotes;