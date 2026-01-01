import React, { useEffect, useState } from 'react'; 
import { ChevronLeft, ChevronRight, X, Calendar, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const CalendarPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [notes, setNotes] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalNotes, setModalNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);

  // Fetch all notes from backend on component mount
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await fetch("http://localhost:8800/note");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllNotes();
  }, []);

  // Extract unique categories from all notes
  const categories = [...new Set(notes.map(note => note.category))];

  // Calendar navigation functions
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
  
  const goToToday = () => setCurrentDate(new Date());
  
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  /**
   * Generate array of day objects for calendar grid
   * Includes previous month overflow, current month, and next month overflow
   * Returns 35 days total (5 weeks) for consistent grid layout
   */
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Day of week for 1st
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in month
    const daysInPrevMonth = new Date(year, month, 0).getDate(); // Days in previous month
    
    const days = [];
    
    // Add overflow days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ 
        date: new Date(year, month - 1, daysInPrevMonth - i), 
        isCurrentMonth: false 
      });
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        date: new Date(year, month, i), 
        isCurrentMonth: true 
      });
    }
    
    // Add overflow days from next month to fill grid
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ 
        date: new Date(year, month + 1, i), 
        isCurrentMonth: false 
      });
    }
    
    return days;
  };

  const monthDays = getMonthDays();

  /**
   * Filter notes by specific date and selected categories
   * Matches year, month, and day exactly
   */
  const getNotesByDate = (date) => {
    return notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.getDate() === date.getDate() &&
             noteDate.getMonth() === date.getMonth() &&
             noteDate.getFullYear() === date.getFullYear() &&
             (selectedCategories.length === 0 || selectedCategories.includes(note.category));
    });
  };

  // Toggle category filter on/off
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Utility functions
  const capitalizeFirst = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Modal handlers
  const openModal = (dayNotes, date) => {
    setModalNotes(dayNotes);
    setModalDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /**
   * Color scheme definitions for categories
   * Each category gets assigned colors cyclically based on index
   */
  const categoryColors = [
    { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500', gradient: 'from-green-400 to-emerald-500' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500', gradient: 'from-emerald-400 to-teal-500' },
    { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', dot: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500' },
    { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-300', dot: 'bg-lime-500', gradient: 'from-lime-400 to-green-500' },
    { bg: 'bg-green-200', text: 'text-green-800', border: 'border-green-400', dot: 'bg-green-600', gradient: 'from-green-500 to-emerald-600' },
    { bg: 'bg-emerald-200', text: 'text-emerald-800', border: 'border-emerald-400', dot: 'bg-emerald-600', gradient: 'from-emerald-500 to-green-600' },
  ];

  const getCategoryColor = (category) => {
    const index = categories.indexOf(category) % categoryColors.length;
    return categoryColors[index];
  };

  return (
    <div className="flex bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-8 relative z-10">
        {/* Page Header */}
        <div className="mb-10 relative">
          <div className="flex items-center gap-5 mb-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#22cb0b] to-emerald-600 p-5 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
                <Calendar className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-2 tracking-tight">
                My Calendar
              </h1>
              <p className="text-gray-600 text-base font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                Visualize and organize your notes by date
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-7">
          {/* Left Sidebar Panel */}
          <div className="w-80 space-y-6">
            {/* Mini Calendar Widget */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-br from-[#1ab80a] via-green-500 to-emerald-600 rounded-3xl p-7 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-black text-xl tracking-tight">{monthYear}</h3>
                    <div className="flex gap-1 bg-white/20 rounded-2xl p-1.5 backdrop-blur-md border border-white/30">
                      <button onClick={goToPreviousMonth} className="text-white hover:bg-white/30 rounded-xl p-2.5 transition-all transform hover:scale-110">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={goToNextMonth} className="text-white hover:bg-white/30 rounded-xl p-2.5 transition-all transform hover:scale-110">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {['S','M','T','W','T','F','S'].map(day => (
                      <div key={day} className="text-xs text-white/90 font-black tracking-wider">{day}</div>
                    ))}
                  </div>
                  {/* Mini calendar grid */}
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {monthDays.map((dayObj,i) => (
                      <div key={i} className={`text-sm py-2.5 rounded-2xl font-bold transition-all ${dayObj.isCurrentMonth ? isToday(dayObj.date) ? 'bg-white text-green-600 shadow-xl scale-110 ring-2 ring-white/50' : 'text-white hover:bg-white/30 cursor-pointer hover:scale-110' : 'text-transparent'}`}>
                        {dayObj.isCurrentMonth ? dayObj.date.getDate() : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Panel */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur opacity-30 group-hover:opacity-50 transition"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-2xl border border-green-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-gray-800 text-lg">Filters</h3>
                </div>
                {/* Category checkboxes */}
                <div className="space-y-3">
                  {categories.map(category => {
                    const colors = getCategoryColor(category);
                    return (
                      <label key={category} className={`flex items-center gap-4 cursor-pointer p-4 rounded-2xl transition-all border-2 ${selectedCategories.includes(category) ? `${colors.bg} ${colors.border} shadow-lg scale-105 border-2` : 'border-transparent hover:bg-gray-50 hover:shadow-md'}`}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-6 h-6 rounded-xl accent-green-500"
                        />
                        <div className={`w-4 h-4 rounded-full ${colors.dot} shadow-lg`}></div>
                        <span className={`text-sm font-bold flex-1 ${selectedCategories.includes(category) ? colors.text : 'text-gray-700'}`}>
                          {capitalizeFirst(category)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl p-7 shadow-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <h3 className="font-bold mb-3 text-white/90 text-sm tracking-wider uppercase">Total Notes</h3>
                  <div className="text-5xl font-black mb-2">{notes.length}</div>
                  <p className="text-sm text-white/80 font-medium">Across all dates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar Grid */}
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-green-100">
              {/* Calendar header with navigation */}
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">{monthYear}</h2>
                <div className="flex items-center gap-4">
                  <button onClick={goToToday} className="px-8 py-4 bg-gradient-to-r from-[#22cb0b] to-emerald-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-110 transition-all transform">
                    Today
                  </button>
                  <div className="flex gap-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 shadow-inner">
                    <button onClick={goToPreviousMonth} className="p-3 hover:bg-white rounded-xl transition-all shadow-md hover:scale-110">
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button onClick={goToNextMonth} className="p-3 hover:bg-white rounded-xl transition-all shadow-md hover:scale-110">
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 7-column calendar grid */}
              <div className="grid grid-cols-7 gap-3">
                {/* Day name headers */}
                {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day => (
                  <div key={day} className="text-center font-black text-gray-800 pb-4 text-sm tracking-widest uppercase">{day}</div>
                ))}

                {/* Calendar day cells */}
                {monthDays.map((dayObj, idx) => {
                  const dayNotes = getNotesByDate(dayObj.date);
                  const isTodayCell = isToday(dayObj.date);

                  return (
                    <div
                      key={idx}
                      className={`relative h-28 rounded-2xl p-3 flex flex-col transition-all duration-300 ${dayObj.isCurrentMonth ? isTodayCell ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-3 border-green-500 shadow-xl scale-105 ring-4 ring-green-200' : dayNotes.length > 0 ? 'bg-white border-2 border-gray-300 hover:border-green-500 hover:shadow-2xl hover:scale-110 cursor-pointer' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 hover:bg-white hover:shadow-lg' : 'bg-gray-50/50 border border-gray-200 opacity-50'}`}
                      onClick={() => dayNotes.length && openModal(dayNotes, dayObj.date)}
                    >
                      {/* Note count badge */}
                      {dayNotes.length > 0 && dayObj.isCurrentMonth && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {dayNotes.length}
                        </div>
                      )}
                      {/* Day number */}
                      <div className={`text-sm font-black mb-2 ${dayObj.isCurrentMonth ? isTodayCell ? 'text-green-600 text-lg' : 'text-gray-800' : 'text-gray-400'}`}>
                        {dayObj.date.getDate()}
                      </div>
                      {/* Note previews - show first note + count of remaining */}
                      <div className="flex flex-col gap-1.5 overflow-hidden flex-1">
                        {dayNotes.slice(0,1).map(note => {
                          const colors = getCategoryColor(note.category);
                          return (
                            <div key={note.idNote} className={`${colors.bg} ${colors.text} text-xs rounded-xl px-2 py-1.5 truncate font-bold border-2 ${colors.border} shadow-md hover:shadow-lg transition-all`}>
                              {capitalizeFirst(note.title)}
                            </div>
                          );
                        })}
                        {dayNotes.length > 1 && (
                          <div className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 text-xs rounded-xl px-2 py-1.5 font-black text-center shadow-md">
                            +{dayNotes.length - 1} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing all notes on selected date */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition"></div>
            <div className="relative bg-white rounded-3xl p-10 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
              {/* Close button */}
              <button onClick={closeModal} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110 shadow-lg">
                <X className="w-6 h-6" />
              </button>
              {/* Modal header with date */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-[#22cb0b] to-emerald-600 p-4 rounded-2xl shadow-xl">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-800 mb-1">{modalDate?.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                  <p className="text-base text-gray-500 font-semibold">{modalDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              {/* List of all notes for selected date */}
              <div className="space-y-4">
                {modalNotes.map(note => {
                  const colors = getCategoryColor(note.category);
                  return (
                    <div
                      key={note.idNote}
                      onClick={() => { navigate(`/view/${note.idNote}`); closeModal(); }}
                      className={`${colors.bg} hover:shadow-2xl cursor-pointer rounded-2xl p-5 transition-all border-2 ${colors.border} hover:scale-105 transform`}
                    >
                      <div className={`font-black text-lg mb-2 ${colors.text}`}>{capitalizeFirst(note.title)}</div>
                      <div className="text-sm text-gray-600 line-clamp-2 mb-3 font-medium">{capitalizeFirst(note.desc)}</div>
                      <div className={`text-xs ${colors.text} flex items-center gap-2 font-bold`}>
                        <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-lg`}></div>
                        {capitalizeFirst(note.category)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarPage;