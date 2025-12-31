import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { Pin, Calendar, ChevronLeft, ChevronRight, Clock, TrendingUp, Sparkles, Eye } from "lucide-react";

const Notes = () => {

  /* ---- STATE ---- */

  // Store notes data
  const [notes, setNotes] = useState([]);

  // Store current time (for clock & greeting)
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

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
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Welcome back";
  };

  const getGreetingEmoji = (hour) => {
    if (hour >= 5 && hour < 12) return "☀️";
    if (hour >= 12 && hour < 17) return "🌤️";
    if (hour >= 17 && hour < 21) return "🌆";
    return "🌙";
  };

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
      const res = await axios.get("http://localhost:8800/note");
      setNotes(res.data);
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
      const res = await axios.get("http://localhost:8800/note");
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---- MINI CALENDAR FUNCTIONS ---- */
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  /**
   * Generate calendar days for mini calendar
   */
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month days to fill grid
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const monthDays = getMonthDays();

  // Get recent notes (last 5)
  const recentNotes = notes
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get pinned notes count
  const pinnedCount = notes.filter(note => note.isPinned).length;

  return (
    <div className="flex bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 relative z-10">
        
        {/* Hero Section with Clock */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
            <div className="relative bg-gradient-to-br from-[#1ab80a] via-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-5xl">{getGreetingEmoji(time.getHours())}</div>
                    <h2 className="text-4xl font-black tracking-tight">
                      {getGreeting(time.getHours())}
                    </h2>
                  </div>
                  <p className="text-white/90 text-lg font-medium mb-6">
                    {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>

                  {/* Stats Row */}
                  <div className="flex gap-6">
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
                      <div className="text-3xl font-black mb-1">{notes.length}</div>
                      <div className="text-sm text-white/90 font-medium">Total Notes</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
                      <div className="text-3xl font-black mb-1">{pinnedCount}</div>
                      <div className="text-sm text-white/90 font-medium">Pinned</div>
                    </div>
                  </div>
                </div>

                {/* Digital Clock */}
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-6 h-6 text-white" />
                    <span className="text-sm font-bold text-white/90 tracking-wider uppercase">Live Time</span>
                  </div>
                  <div className="text-6xl font-mono font-black tracking-wider">
                    {format(time.getHours())}
                    <span className="animate-pulse">:</span>
                    {format(time.getMinutes())}
                    <span className="animate-pulse">:</span>
                    {format(time.getSeconds())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: Notes + Sidebar Widgets */}
        <div className="flex gap-6">
          
          {/* LEFT: Notes Section */}
          <div className="flex-1">
            {/* Add New Note Button */}
            <div className="mb-6">
              <Link
                to="/add"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#22cb0b] to-emerald-600 hover:from-[#1ab80a] hover:to-emerald-700 text-white font-black py-5 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Create New Note
              </Link>
            </div>

            {/* Notes Grid */}
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-green-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">Your Notes</h3>
                  </div>
                  <Link
                    to="/allnotes"
                    className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors flex items-center gap-2"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes
                    .slice()
                    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                    .slice(0, 9)
                    .map(item => (
                      <div
                        key={item.idNote}
                        className="group relative cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:-translate-y-2"
                      >
                        {/* Pin Button */}
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

                        <div 
                          onClick={() => navigate(`/view/${item.idNote}`)}
                          className="p-5"
                        >
                          <h2 className="text-lg font-black text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                            {capitalizeFirst(item.title)}
                          </h2>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {capitalizeFirst(item.desc)}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
                              {capitalizeFirst(item.category)}
                            </span>

                            <div className="flex items-center text-xs text-gray-500 font-medium">
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              {new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.idNote);
                              }}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              Delete
                            </button>

                            <Link
                              to={`/update/${item.idNote}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {notes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No notes yet. Create your first note!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar Widgets */}
          <div className="w-80 space-y-6">
            
            {/* Mini Calendar Widget */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-800">{monthYear}</h3>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    <button 
                      onClick={goToPreviousMonth}
                      className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={goToNextMonth}
                      className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center mb-3">
                  {['S','M','T','W','T','F','S'].map(day => (
                    <div key={day} className="text-xs text-gray-600 font-bold py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {monthDays.map((dayObj, i) => (
                    <div
                      key={i}
                      className={`text-sm py-2 rounded-lg font-semibold transition-all ${
                        dayObj.isCurrentMonth
                          ? isToday(dayObj.date)
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                            : 'text-gray-800 hover:bg-gray-100 cursor-pointer'
                          : 'text-gray-300'
                      }`}
                    >
                      {dayObj.isCurrentMonth ? dayObj.date.getDate() : ''}
                    </div>
                  ))}
                </div>

                <Link
                  to="/calendar"
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  Open Full Calendar
                </Link>
              </div>
            </div>

            {/* Recent Notes Widget */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-800">Recent Notes</h3>
                </div>

                <div className="space-y-3">
                  {recentNotes.length > 0 ? (
                    recentNotes.map(note => (
                      <div
                        key={note.idNote}
                        onClick={() => navigate(`/view/${note.idNote}`)}
                        className="group/item cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-emerald-50 rounded-xl p-4 transition-all border border-gray-200 hover:border-green-300 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover/item:text-green-600 transition-colors flex-1">
                            {capitalizeFirst(note.title)}
                          </h4>
                          {note.isPinned && (
                            <Pin className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {capitalizeFirst(note.desc)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                            {capitalizeFirst(note.category)}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(note.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Eye className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">No recent notes</p>
                    </div>
                  )}
                </div>

                {recentNotes.length > 0 && (
                  <Link
                    to="/allnotes"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    View All Notes
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;