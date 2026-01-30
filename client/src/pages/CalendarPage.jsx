import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const CalendarPage = () => {
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

  /*  CALENDAR LOGIC */
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-cyan-300/20 rounded-full blur-3xl"></div>
      
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
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-900 rounded-full shadow-lg">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-900 to-green-600 bg-clip-text text-transparent">
              Calendar
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-12 md:ml-16">
            View and manage notes by date
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-7">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-80 space-y-4 md:space-y-6">
            {/* MINI CALENDAR */}
            <div className="hidden md:block bg-white/90 backdrop-blur-xl border-2 border-green-100/50 rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <h3 className="font-bold text-gray-800 text-base md:text-lg">{monthYear}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.setMonth(currentDate.getMonth() - 1)
                          )
                        )
                      }
                      className="p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md group/btn"
                    >
                      <ChevronLeft className="text-green-600 group-hover/btn:text-white transition-colors w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.setMonth(currentDate.getMonth() + 1)
                          )
                        )
                      }
                      className="p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md group/btn"
                    >
                      <ChevronRight className="text-green-600 group-hover/btn:text-white transition-colors w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-center text-xs mb-3 text-gray-500 font-bold">
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
                              : "text-gray-700 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100 hover:scale-110 hover:shadow-md"
                            : "text-gray-300"
                        }`}
                    >
                      {d.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CATEGORY FILTERS */}
            <div className="bg-white/90 backdrop-blur-xl border-2 border-purple-100/50 rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-base md:text-lg flex items-center gap-2">
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
                            : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 shadow-sm hover:shadow-md"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 border-0 rounded-3xl p-5 md:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -right-8 -top-8 w-24 h-24 md:-right-10 md:-top-10 md:w-32 md:h-32 bg-white/10 rounded-full blur-2xl"></div>
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
          <div className="flex-1 bg-white/90 backdrop-blur-xl border-2 border-blue-100/50 rounded-3xl p-4 md:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-7 gap-3 md:gap-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 flex items-center gap-2 md:gap-3">
                  <span className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></span>
                  {monthYear}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 md:px-6 md:py-3 text-sm font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-200 relative overflow-hidden group/btn w-fit"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></span>
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
                    className="text-center font-black text-gray-600 pb-2 md:pb-3 text-xs tracking-wider uppercase hidden md:block"
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
                    className="text-center font-black text-gray-600 pb-2 text-xs tracking-wider uppercase md:hidden"
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
                      className={`h-16 md:h-20 lg:h-24 border-2 rounded-xl md:rounded-2xl p-1.5 md:p-2.5 transition-all duration-200 relative overflow-hidden
                        ${
                          d.isCurrentMonth
                            ? dayNotes.length
                              ? "bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 border-green-200 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 cursor-pointer hover:border-green-400"
                              : "bg-white border-gray-100 hover:border-green-200 hover:shadow-lg hover:scale-102 cursor-pointer"
                            : "bg-gray-50/50 border-gray-100"
                        }`}
                    >
                      {dayNotes.length > 0 && (
                        <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md"></div>
                      )}
                      <div className={`text-xs md:text-sm font-black mb-0.5 md:mb-1.5 ${isToday(d.date) ? "text-green-600" : "text-gray-700"}`}>
                        {d.date.getDate()}
                      </div>

                      {dayNotes.slice(0, 1).map((n) => (
                        <div
                          key={n.idNote}
                          className="text-xs text-gray-700 truncate mt-0.5 bg-gradient-to-r from-green-100 to-emerald-100 px-1 py-0.5 md:px-2 md:py-1 rounded md:rounded-lg font-medium shadow-sm"
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
          <div className="bg-white rounded-3xl p-4 md:p-8 w-full max-w-lg shadow-2xl transform scale-100 animate-in zoom-in duration-300 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-2xl font-black text-gray-800 flex items-center gap-2 md:gap-3">
                  <span className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></span>
                  {modalDate?.toDateString()}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-600 bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group"
                >
                  <X className="text-gray-600 group-hover:text-white transition-colors w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {modalNotes.map((n) => (
                  <div
                    key={n.idNote}
                    onClick={() => navigate(`/view/${n.idNote}`)}
                    className="border-2 border-green-100 rounded-2xl p-3 md:p-5 hover:bg-gradient-to-br hover:from-green-50 hover:via-emerald-50 hover:to-teal-50 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-200 transform hover:scale-102 hover:-rotate-1 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <h4 className="font-black text-gray-800 mb-1 md:mb-2 text-base md:text-lg">{n.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
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