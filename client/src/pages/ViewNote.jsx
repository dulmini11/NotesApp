import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewNote = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const noteId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/note/${noteId}`);
        setNote(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`http://localhost:8800/note/${noteId}`);
      navigate("/allnotes");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <div className="w-16 h-16 border-4 border-[#22cb0b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/allnotes")}
            className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a7e04] hover:text-white bg-white hover:bg-[#22cb0b] rounded-xl shadow transition-all border border-green-200"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to notes
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden">

          {/* Cover */}
          {note.cover ? (
            <div className="w-full h-64 bg-gradient-to-br from-[#22cb0b]/20 to-[#0a7e04]/20">
              <img
                src={note.cover}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-[#22cb0b]/10 via-green-50 to-[#0a7e04]/10 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#22cb0b]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">

            {/* Category */}
            {note.category && (
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-green-100 text-sm font-semibold text-[#0a7e04]">
                {note.category}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0a7e04] to-[#22cb0b] mb-6">
              {note.title || "Untitled"}
            </h1>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-10">
              {note.desc || "No description provided."}
            </p>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-green-100">
              <span className="text-xs text-gray-500">
                Created on {new Date(note.createdAt || Date.now()).toLocaleDateString()}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/update/${noteId}`)}
                  className="px-6 py-3 font-semibold text-[#0a7e04] border-2 border-green-100 rounded-xl hover:bg-green-50 transition"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="px-6 py-3 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;