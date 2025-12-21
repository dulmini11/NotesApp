import React, { useState } from 'react';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const idNote = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8800/note/" + idNote, book);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8" style={{ background: '#ffffff' }}>
      
      {/* Floating Balls */}
      <div className="absolute top-20 right-20 w-80 h-80 rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #2ef015, #22cb0b, #1ea309, #16850a)',
          boxShadow: 'inset -30px -30px 60px rgba(0,0,0,0.3), 0 30px 80px rgba(34,203,11,0.4)',
          animation: 'float 6s ease-in-out infinite'
        }} />

      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #2ef015, #22cb0b, #1ea309, #16850a)',
          boxShadow: 'inset -30px -30px 60px rgba(0,0,0,0.3), 0 30px 80px rgba(34,203,11,0.4)',
          animation: 'float 6s ease-in-out infinite 3s'
        }} />

      <style>{`
        @keyframes float {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-15px,-25px); }
        }
      `}</style>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-white border-opacity-40"
          style={{ background: 'rgba(255,255,255,0.15)' }}>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Update Note</h1>
            <p className="text-gray-600 mt-2">Edit and update your content</p>
          </div>

          {/* Cover */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
            <input
              type="text"
              name="cover"
              onChange={handleChange}
              placeholder="Paste image URL"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                placeholder="Update title"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                onChange={handleChange}
                placeholder="Update category"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              rows="6"
              name="desc"
              onChange={handleChange}
              placeholder="Update description"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white">
              Cancel
            </button>

            <button
              onClick={handleClick}
              className="px-8 py-3 rounded-xl text-white font-semibold"
              style={{ background: '#22cb0b' }}>
              Update Note
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Update;
