import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Sparkles, Eye, FileText, Pin, Calendar } from "lucide-react";
import LeafVideo from "../assets/leaf1.mp4";

const Notes = () => {

  /* ---- STATE ---- */

  // Store notes data
  const [notes, setNotes] = useState([]);

  // Store current time (for clock & greeting)
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

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
    <div className="flex bg-gradient-to-br from-lime-50 to-teal-50 min-h-screen">
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 relative z-10">
        
        {/* Hero Section with Clock */}
        <div className="mb-8">
          <div className="relative group">
            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-[#491b04] via-[#4d1c02] to-black rounded-[2rem] p-10 text-white shadow-2xl overflow-hidden border border-white/10">
              {/* Animated Background Orbs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-48 -mt-48 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-36 -mb-36 blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 flex items-center justify-between gap-8">
                <div className="flex-1">
                  {/* Greeting Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl transform transition-transform duration-300 hover:scale-110">
                        {getGreetingEmoji(time.getHours())}
                      </div>
                      <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        {getGreeting(time.getHours())}
                      </h2>
                    </div>
                    <p className="text-white/80 text-xl font-semibold ml-[5.5rem] tracking-wide">
                      {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="text-2xl font-mono font-black tracking-wider ml-[5.5rem] tabular-nums">
                      <span className="inline-block hover:text-emerald-200 transition-colors">{format(time.getHours())}</span>
                      <span className="animate-pulse text-white/60 mx-0.5">:</span>
                      <span className="inline-block hover:text-emerald-200 transition-colors">{format(time.getMinutes())}</span>
                      <span className="animate-pulse text-white/60 mx-0.5">:</span>
                      <span className="inline-block hover:text-emerald-200 transition-colors">{format(time.getSeconds())}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Container */}
                <div className="flex flex-col items-center gap-2 mr-28">
                  {/* Compact Stats */}
                  <div className="flex flex-col gap-4">
                    
                    {/* Notes */}
                    <div className="group bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-300/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-lg font-bold leading-none mb-0.5">
                            {notes.length}
                          </div>
                          <div className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                            Notes
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pinned */}
                    <div className="group bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-300/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
                          <Pin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-lg font-bold leading-none mb-0.5">
                            {pinnedCount}
                          </div>
                          <div className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                            Pinned
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <video
            src={LeafVideo}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="absolute top-3 right-3 w-52 h-72 pointer-events-none mix-blend-screen"
          />
        </div>

        {/* Main Layout: Notes + Sidebar Widgets */}
        <div className="flex gap-6">
          
          {/* LEFT: Notes Section */}
          <div className="flex-1">
            {notes.length >= 1 && (
                <div className="mb-4 flex">{/* Add New Note Button */}
                  <Link
                    to="/add"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-[#22cb0b] to-emerald-600 hover:from-[#1ab80a] hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Note
                  </Link>
                </div>
            )}

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
                      <NoteCard
                        key={item.idNote}
                        note={item}
                        onPin={handlePin}
                        onDelete={handleDelete}
                      />
                    ))}
                </div>

                {notes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No notes yet. Create your first note!</p>

                    {/* Add New Note Button */}
                    <div className="mt-6 flex justify-center">
                      <Link
                        to="/add"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#22cb0b] to-emerald-600 hover:from-[#1ab80a] hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Note
                      </Link>
                    </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-lime-50 to-green-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-800">Recent Notes</h3>
                </div>

                <div className="space-y-2">
                  {recentNotes.length > 0 ? (
                    recentNotes.slice(0, 4).map(note => (
                      <div
                        key={note.idNote}
                        onClick={() => navigate(`/view/${note.idNote}`)}
                        className="group/item cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-emerald-50 rounded-lg p-2 transition-all border border-gray-200 hover:border-green-300 hover:shadow-sm"
                      >
                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover/item:text-green-600 transition-colors">
                          {capitalizeFirst(note.title)}
                        </h4>

                        <span className="text-[10px] text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Eye className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">No recent notes</p>
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