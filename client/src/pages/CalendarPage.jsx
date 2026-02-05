import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/ThemeContext"; // Add theme context

const CalendarPage = () => {
  const { theme } = useTheme(); // Get theme
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalNotes, setModalNotes] = useState([]);
  const [modalDate, setModalDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarMinimized] = useState(true);
  const expanded = !isSidebarMinimized || isSidebarHovered;

  // Theme-based styling
  const mainBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-900 to-gray-800'
    : 'bg-gradient-to-br from-slate-50 via-green-100 to-emerald-50';

  const bgDecoration1Class = theme === 'dark'
    ? 'from-gray-800 to-gray-900/20'
    : 'from-green-200 to-emerald-300/20';

  const bgDecoration2Class = theme === 'dark'
    ? 'from-gray-800 to-gray-700/20'
    : 'from-green-200 to-cyan-300/20';

  const cardBgClass = theme === 'dark'
    ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700'
    : 'bg-white/90 backdrop-blur-xl border-green-100/50';

  const headerGradientClass = theme === 'dark'
    ? 'bg-gradient-to-r from-green-300 to-green-500'
    : 'bg-gradient-to-r from-green-900 to-green-600';

  const subtitleClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  const categoryFilterBgClass = theme === 'dark'
    ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700'
    : 'bg-white/90 backdrop-blur-xl border-purple-100/50';

  const statsCardBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-green-600 via-emerald-700 to-teal-700'
    : 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600';

  const calendarCardBgClass = theme === 'dark'
    ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700'
    : 'bg-white/90 backdrop-blur-xl border-blue-100/50';

  const dayHeaderTextClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  const dayTextClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const inactiveDayTextClass = theme === 'dark'
    ? 'text-gray-600'
    : 'text-gray-300';

  const dayBoxBgClass = theme === 'dark'
    ? 'from-gray-800 via-gray-800/30 to-gray-900/50'
    : 'from-white via-green-50/30 to-emerald-50/50';

  const emptyDayBoxBgClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-100';

  const inactiveDayBoxBgClass = theme === 'dark'
    ? 'bg-gray-900/50 border-gray-800'
    : 'bg-gray-50/50 border-gray-100';

  const noteItemBgClass = theme === 'dark'
    ? 'from-gray-700 to-gray-800'
    : 'from-green-100 to-emerald-100';

  const noteItemTextClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const modalBgClass = theme === 'dark'
    ? 'bg-gray-800'
    : 'bg-white';

  const modalNoteBgClass = theme === 'dark'
    ? 'from-gray-700 via-gray-700/50 to-gray-800/50'
    : 'from-green-50 via-emerald-50 to-teal-50';

  const modalNoteTextClass = theme === 'dark'
    ? 'text-gray-200'
    : 'text-gray-800';

  const modalNoteDescClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  /* FETCH NOTES */
  useEffect(() => {
    fetch("http://localhost:8800/note")
      .then((res) => res.json())
      .then(setNotes)
      .catch(console.error);
  }, []);

  /* DERIVED DATA */
  const categories = useMemo(
    () => [...new Set(notes.map((n) => n.category))],
    [notes]
  );

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  /* CALENDAR LOGIC */
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    while (days.length < 35) {
      days.push({
        date: new Date(year, month + 1, days.length - daysInMonth + 1),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const monthDays = getMonthDays();

  const getNotesByDate = (date) =>
    notes.filter((note) => {
      const d = new Date(note.createdAt);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear() &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(note.category))
      );
    });

  const isToday = (date) => {
    const t = new Date();
    return (
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    );
  };

  /* HANDLERS */
  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const openModal = (notes, date) => {
    setModalNotes(notes);
    setModalDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className={`flex min-h-screen ${mainBgClass} transition-colors duration-300 relative overflow-hidden`}>
      {/* Decorative Background Elements */}
      <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br rounded-full blur-3xl ${bgDecoration1Class}`}></div>
      <div className={`absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr rounded-full blur-3xl ${bgDecoration2Class}`}></div>
      
      <Sidebar expanded={expanded} setIsHovered={setIsSidebarHovered} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-4 md:p-6 relative z-10 transition-all duration-300
          ${expanded ? "lg:ml-60 ml-0" : "lg:ml-28 ml-0"}
          overflow-auto
        `}
      >
        {/* HEADER */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-full shadow-lg ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-green-600 to-green-800'
                : 'bg-gradient-to-br from-green-500 to-green-900'
            }`}>
              <Calendar className="text-white w-5 h-5" />
            </div>
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black bg-clip-text text-transparent ${headerGradientClass}`}>
              Calendar
            </h1>
          </div>
          <p className={`text-sm ml-12 md:ml-16 ${subtitleClass}`}>
            View and manage notes by date
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-7">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-80 space-y-4 md:space-y-6">
            {/* MINI CALENDAR */}
            <div className={`hidden md:block border-2 rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group ${cardBgClass}`}>
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                theme === 'dark' ? 'from-green-600/5 to-emerald-600/5' : 'from-green-500/5 to-emerald-500/5'
              }`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <h3 className={`font-bold text-base md:text-lg ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  }`}>{monthYear}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.setMonth(currentDate.getMonth() - 1)
                          )
                        )
                      }
                      className={`p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 rounded-xl transition-all duration-200 hover:shadow-md group/btn ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                      }`}
                    >
                      <ChevronLeft className={`group-hover/btn:text-white transition-colors w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-300 group-hover/btn:text-white' : 'text-green-600'
                      }`} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.setMonth(currentDate.getMonth() + 1)
                          )
                        )
                      }
                      className={`p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 rounded-xl transition-all duration-200 hover:shadow-md group/btn ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                      }`}
                    >
                      <ChevronRight className={`group-hover/btn:text-white transition-colors w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-300 group-hover/btn:text-white' : 'text-green-600'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className={`grid grid-cols-7 text-center text-xs mb-3 font-bold ${dayHeaderTextClass}`}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="pb-2">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-sm">
                  {monthDays.map((d, i) => (
                    <div
                      key={i}
                      className={`py-1 md:py-2 rounded-full cursor-pointer text-center font-medium transition-all duration-200
                        ${
                          d.isCurrentMonth
                            ? isToday(d.date)
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/50 scale-110 ring-2 ring-green-300"
                              : `${dayTextClass} hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100 hover:scale-110 hover:shadow-md ${
                                  theme === 'dark' ? 'hover:from-green-900 hover:to-emerald-900' : ''
                                }`
                            : inactiveDayTextClass
                        }`}
                    >
                      {d.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CATEGORY FILTERS */}
            <div className={`border-2 rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group ${categoryFilterBgClass}`}>
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                theme === 'dark' ? 'from-purple-600/5 to-pink-600/5' : 'from-purple-500/5 to-pink-500/5'
              }`}></div>
              <div className="relative z-10">
                <h3 className={`font-bold mb-3 md:mb-4 text-base md:text-lg flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl text-xs font-bold border-2 transition-all duration-200 transform hover:scale-105 hover:rotate-1
                        ${
                          selectedCategories.includes(cat)
                            ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white border-green-400 shadow-lg shadow-green-500/30"
                            : `${theme === 'dark' 
                                ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-green-500 hover:bg-gradient-to-r hover:from-green-900 hover:to-emerald-900' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50'
                              } shadow-sm hover:shadow-md`
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className={`border-0 rounded-3xl p-5 md:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${statsCardBgClass}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${
                theme === 'dark' ? 'from-white/5 to-transparent' : 'from-white/10 to-transparent'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className={`absolute -right-8 -top-8 w-24 h-24 md:-right-10 md:-top-10 md:w-32 md:h-32 rounded-full blur-2xl ${
                theme === 'dark' ? 'bg-white/5' : 'bg-white/10'
              }`}></div>
              <div className="relative z-10">
                <p className="text-xs text-green-100 font-bold tracking-wider uppercase mb-2">Total Notes</p>
                <p className="text-3xl md:text-5xl font-black text-white">{notes.length}</p>
                <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CALENDAR */}
          <div className={`flex-1 border-2 rounded-3xl p-4 md:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group ${calendarCardBgClass}`}>
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              theme === 'dark' ? 'from-green-600/5 to-cyan-600/5' : 'from-green-500/5 to-cyan-500/5'
            }`}></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-7 gap-3 md:gap-0">
                <h2 className={`text-xl md:text-2xl lg:text-3xl font-black flex items-center gap-2 md:gap-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  <span className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></span>
                  {monthYear}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 md:px-6 md:py-3 text-sm font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-200 relative overflow-hidden group/btn w-fit"
                >
                  <span className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 ${
                    theme === 'dark' ? 'from-white/10 to-transparent' : 'from-white/20 to-transparent'
                  }`}></span>
                  <span className="relative z-10">Today</span>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 md:gap-3 text-sm">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((d) => (
                  <div
                    key={d}
                    className={`text-center font-black pb-2 md:pb-3 text-xs tracking-wider uppercase hidden md:block ${dayHeaderTextClass}`}
                  >
                    {d}
                  </div>
                ))}
                {[
                  "S",
                  "M",
                  "T",
                  "W",
                  "T",
                  "F",
                  "S",
                ].map((d) => (
                  <div
                    key={d}
                    className={`text-center font-black pb-2 text-xs tracking-wider uppercase md:hidden ${dayHeaderTextClass}`}
                  >
                    {d}
                  </div>
                ))}

                {monthDays.map((d, i) => {
                  const dayNotes = getNotesByDate(d.date);
                  return (
                    <div
                      key={i}
                      onClick={() =>
                        dayNotes.length && openModal(dayNotes, d.date)
                      }
                      className={`h-16 md:h-20 lg:h-24 border-2 rounded-xl md:rounded-2xl p-1.5 md:p-2.5 transition-all duration-200 relative overflow-hidden cursor-pointer
                        ${
                          d.isCurrentMonth
                            ? dayNotes.length
                              ? `bg-gradient-to-br ${dayBoxBgClass} border-green-200 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 hover:border-green-400 ${
                                  theme === 'dark' ? 'border-green-700 hover:border-green-500' : ''
                                }`
                              : `${emptyDayBoxBgClass} hover:border-green-200 hover:shadow-lg hover:scale-102 ${
                                  theme === 'dark' ? 'hover:border-green-700' : ''
                                }`
                            : inactiveDayBoxBgClass
                        }`}
                    >
                      {dayNotes.length > 0 && (
                        <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md"></div>
                      )}
                      <div className={`text-xs md:text-sm font-black mb-0.5 md:mb-1.5 ${isToday(d.date) ? "text-green-500" : dayTextClass}`}>
                        {d.date.getDate()}
                      </div>

                      {dayNotes.slice(0, 1).map((n) => (
                        <div
                          key={n.idNote}
                          className={`text-xs truncate mt-0.5 bg-gradient-to-r ${noteItemBgClass} px-1 py-0.5 md:px-2 md:py-1 rounded md:rounded-lg font-medium shadow-sm ${noteItemTextClass}`}
                        >
                          • {n.title}
                        </div>
                      ))}

                      {dayNotes.length > 1 && (
                        <div className="text-xs text-white font-black mt-0.5 md:mt-1.5 bg-gradient-to-r from-green-500 to-emerald-600 px-1 py-0.5 md:px-2 md:py-1 rounded md:rounded-lg inline-block shadow-md">
                          +{dayNotes.length - 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className={`rounded-3xl p-4 md:p-8 w-full max-w-lg shadow-2xl transform scale-100 animate-in zoom-in duration-300 relative overflow-hidden max-h-[90vh] overflow-y-auto ${modalBgClass}`}>
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl ${
              theme === 'dark' ? 'from-green-600/10 to-emerald-600/10' : 'from-green-500/10 to-emerald-500/10'
            }`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className={`text-lg md:text-2xl font-black flex items-center gap-2 md:gap-3 ${modalNoteTextClass}`}>
                  <span className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></span>
                  {modalDate?.toDateString()}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-600 rounded-xl transition-all duration-200 hover:shadow-md group ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <X className={`group-hover:text-white transition-colors w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {modalNotes.map((n) => (
                  <div
                    key={n.idNote}
                    onClick={() => navigate(`/view/${n.idNote}`)}
                    className={`border-2 rounded-2xl p-3 md:p-5 hover:bg-gradient-to-br cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-102 hover:-rotate-1 relative overflow-hidden group ${
                      theme === 'dark' 
                        ? 'border-gray-700 hover:border-green-600' 
                        : 'border-green-100 hover:border-green-300'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      theme === 'dark' ? 'from-green-600/5 to-emerald-600/5' : 'from-green-500/5 to-emerald-500/5'
                    }`}></div>
                    <div className="relative z-10">
                      <h4 className={`font-black mb-1 md:mb-2 text-base md:text-lg ${modalNoteTextClass}`}>{n.title}</h4>
                      <p className={`text-sm line-clamp-2 leading-relaxed ${modalNoteDescClass}`}>
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;