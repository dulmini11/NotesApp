import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Sparkles, Eye, FileText, Pin, Calendar, MoreVertical, Star, Zap } from "lucide-react";
import LeafVideo from "../assets/leaf1.mp4";

const Notes = () => {

  /* ---- STATE ---- */

  // Store notes data
  const [notes, setNotes] = useState([]);

  // Store current time (for clock & greeting)
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarMinimized] = useState(true);
  const expanded = !isSidebarMinimized || isSidebarHovered;


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
    if (hour >= 17 && hour < 21) return "🌇";
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
      <Sidebar expanded={expanded} setIsHovered={setIsSidebarHovered} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-4 relative z-10 transition-all duration-300
          ${expanded ? "ml-60" : "ml-28"}  /* Adjusted to sidebar width + spacing */
          overflow-auto
        `}
      > 
        {/* 2-COLUMN LAYOUT */}
        <div className="flex gap-6">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-6">
            
            {/* 1. HERO SECTION */}
            <div>
              <div className="relative group">
                {/* Enhanced Glow Effect */}
                <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-[#491b04] via-[#4d1c02] to-black rounded-[2rem] p-10 pr-0 text-white shadow-2xl overflow-hidden border border-white/10">
                  {/* Animated Background Orbs */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-48 -mt-48 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-36 -mb-36 blur-2xl"></div>
                  <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10 flex items-center justify-between gap-8">
                    <div className="flex-1">
                      {/* Greeting Section */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl transform transition-transform duration-300 hover:scale-110">
                            {getGreetingEmoji(time.getHours())}
                          </div>
                          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                            {getGreeting(time.getHours())}
                          </h2>
                        </div>
                        <p className="text-white/70 text-md font-semibold ml-[5.5rem] tracking-wide">
                          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="text-2xl font-sans font-bold tracking-wider ml-[5.5rem] tabular-nums">
                          <span className="inline-block hover:text-emerald-200 transition-colors">{format(time.getHours())}</span>
                          <span className="animate-pulse text-white/60 mx-0.5">:</span>
                          <span className="inline-block hover:text-emerald-200 transition-colors">{format(time.getMinutes())}</span>
                          <span className="animate-pulse text-white/60 mx-0.5">:</span>
                          <span className="inline-block hover:text-emerald-200 transition-colors">{format(time.getSeconds())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side Container */}
                    <div className="flex flex-col items-center gap-2 mr-44">
                      {/* Compact Stats */}
                      <div className="flex flex-col gap-4">
                        
                        {/* Notes */}
                        <div className="group bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-300/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
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
                        <div className="group bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-300/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
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
              <video
                src={LeafVideo}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="absolute top-0 right-0 w-52 h-72 pointer-events-none mix-blend-screen"
              />
            </div>
              </div>


            {/* 2. NOTES GRIDS SECTION */}
            <div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-green-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-900 rounded-full shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black bg-gradient-to-r from-green-900 to-green-600 bg-clip-text text-transparent">Your Notes</h3>
                    </div>
                    <Link
                      to="/allnotes"
                      className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors flex items-center gap-2"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {notes.length >= 1 && (
                    <div className="mb-4 flex">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes
                      .slice()
                      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                      .slice(0, 6)
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
            
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-80 space-y-6">
            
            {/* 3. ENHANCED CALENDAR SECTION */}
            <div>
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#491b04] to-green-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-all duration-500"></div>
                
                {/* Main Calendar Card */}
                <div className="relative bg-gradient-to-br from-white via-green-50 to-white rounded-3xl p-6 shadow-2xl border border-green-200 overflow-hidden">
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#491b04]/10 to-green-500/10 rounded-full -mr-12 -mt-12 blur-lg"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-600/10 to-green-900/10 rounded-full -ml-8 -mb-8 blur-md"></div>
                  
                  {/* Header with Enhanced Design */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-[#491b04] to-[#4d1c02] rounded-xl shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-black bg-gradient-to-r from-[#491b04] to-green-900 bg-clip-text text-transparent">
                        {monthYear}
                      </h3>
                    </div>
                    <div className="flex gap-1 bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-1 border border-green-200">
                      <button 
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gradient-to-r hover:from-[#491b04]/10 hover:to-green-500/10 rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-105"
                      >
                        <ChevronLeft className="w-4 h-4 text-green-900" />
                      </button>
                      <button 
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gradient-to-r hover:from-[#491b04]/10 hover:to-green-500/10 rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-105"
                      >
                        <ChevronRight className="w-4 h-4 text-green-900" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Days Header */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-3">
                    {['S','M','T','W','T','F','S'].map(day => (
                      <div 
                        key={day} 
                        className="text-xs font-bold py-2 bg-gradient-to-b from-green-50 to-white rounded-lg text-green-900"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {monthDays.map((dayObj, i) => (
                      <div
                        key={i}
                        className={`relative py-2 rounded-full cursor-pointer text-center font-medium transition-all duration-300 transform hover:scale-105 ${
                          dayObj.isCurrentMonth
                            ? isToday(dayObj.date)
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-105 border-2 border-white'
                              : 'text-green-900 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:shadow-md'
                            : 'text-green-300 hover:text-green-400'
                        }`}
                      >
                        {dayObj.isCurrentMonth ? dayObj.date.getDate() : ''}
                        {isToday(dayObj.date) && dayObj.isCurrentMonth && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#491b04] to-green-900 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Open Calendar Button */}
                  <Link
                    to="/calendar"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1fd234] via-green-700 to-green-600 hover:from-[#4d1c02] hover:via-[#903809]  hover:to-[#260e02]  text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group"
                  >
                    <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="group-hover:tracking-wide transition-all">Open Full Calendar</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. ENHANCED RECENT NOTES SECTION */}
            <div>
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-green-900/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-50 transition-all duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-white via-green-50 to-white rounded-3xl p-4 shadow-2xl border border-green-200 overflow-hidden">
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-900/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-[#491b04]/10 to-green-600/10 rounded-full blur-lg"></div>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-[#491b04] to-green-900 rounded-full shadow-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-black bg-gradient-to-r from-[#491b04] to-green-900 bg-clip-text text-transparent">
                          Recent Notes
                        </h3>
                        <p className="text-xs text-green-600 font-medium">Last 3 updates</p>
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-green-500 animate-pulse" />
                  </div>

                  {/* Recent Notes List */}
                  <div className="space-y-3 mb-6">
                    {recentNotes.length > 0 ? (
                      recentNotes.slice(0, 3).map((note, index) => (
                        <div
                          key={note.idNote}
                          onClick={() => navigate(`/view/${note.idNote}`)}
                          className="group/item cursor-pointer relative overflow-hidden bg-gradient-to-r from-white to-green-50 hover:from-green-50 hover:to-emerald-50 rounded-xl p-3 transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-lg transform hover:-translate-y-0.5"
                        > 
                          <div className="ml-2">
                            {/* Title with Pin Indicator */}
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold text-green-900 line-clamp-1 group-hover/item:text-green-700 transition-colors">
                                {capitalizeFirst(note.title)}
                              </h4>
                            </div>
                            
                            {/* Date and Time */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                                {new Date(note.createdAt).toLocaleDateString('en-US', {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="text-[10px] text-green-500 font-medium">
                                {new Date(note.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            
                            {/* Preview if available */}
                            {note.content && (
                              <p className="text-xs text-green-700/70 line-clamp-1 mt-2">
                                {note.content.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                          
                          {/* Hover Indicator */}
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-3">
                          <Eye className="w-8 h-8 text-green-400" />
                        </div>
                        <p className="text-sm font-medium text-green-700">No recent notes</p>
                        <p className="text-xs text-green-500 mt-1">Create your first note to see it here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;