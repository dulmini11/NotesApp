import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from "../components/Sidebar";

const Notes = () => {

  /* ---- STATE ---- */

  // Store notes data
  const [notes, setNotes] = useState([]);

  // Store current time (for clock & greeting)
  const [time, setTime] = useState(new Date());


  /* --- DIGITAL CLOCK --- */

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Format numbers to always show 2 digits
  const format = (num) => (num < 10 ? "0" + num : num);

  // Return greeting based on current hour
  const getGreeting = (hour) => {
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌆";
    return "Welcome back 🌙";
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
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      {/* MAIN CONTENT */}
      <div className="flex-1 ml-2 mt-10">

        {/* Greeting + Digital Clock Card */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl max-w-xl mx-auto">
            
            <h2 className="text-2xl font-semibold mb-2">
              {getGreeting(time.getHours())}
            </h2>

            {/* Digital Clock */}
            <div className="text-4xl font-mono tracking-wider">
              {format(time.getHours())} :
              {format(time.getMinutes())} :
              {format(time.getSeconds())}
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
            My Notes
          </h1>
          <p className="text-gray-700 text-lg">
            Organize your thoughts beautifully
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {notes.map(item => (
            <div
              key={item.idNote}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200 hover:-translate-y-2 flex flex-col"
            >
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                  {item.desc}
                </p>
                <span className="inline-block bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                  {item.category}
                </span>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleDelete(item.idNote)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/update/${item.idNote}`}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Update
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Add New Note Button */}
        <div className="text-center">
          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Note
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Notes;
