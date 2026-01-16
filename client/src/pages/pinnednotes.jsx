import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import pinnoteVideo from "../assets/pinnote.mp4";

const PinnedNotes = () => {
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 mt-10 p-4 relative">
        {/* Video in right corner */}
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
          {filteredNotes.map(item => (
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