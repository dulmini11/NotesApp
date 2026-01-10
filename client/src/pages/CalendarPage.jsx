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

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    fetch("http://localhost:8800/note")
      .then((res) => res.json())
      .then(setNotes)
      .catch(console.error);
  }, []);

  /* ================= DERIVED DATA ================= */
  const categories = useMemo(
    () => [...new Set(notes.map((n) => n.category))],
    [notes]
  );

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  /* ================= CALENDAR LOGIC ================= */
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

  /* ================= HANDLERS ================= */
  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const openModal = (notes, date) => {
    setModalNotes(notes);
    setModalDate(date);
    setIsModalOpen(true);
  };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage notes by date
          </p>
        </div>

        <div className="flex gap-6">
          {/* LEFT PANEL */}
          <div className="w-72 space-y-6">
            {/* MINI CALENDAR */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{monthYear}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() - 1)
                        )
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() + 1)
                        )
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-xs mb-2 text-gray-500">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-sm">
                {monthDays.map((d, i) => (
                  <div
                    key={i}
                    className={`py-1 rounded-md
                      ${
                        d.isCurrentMonth
                          ? isToday(d.date)
                            ? "bg-green-500 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                          : "text-gray-300"
                      }`}
                  >
                    {d.date.getDate()}
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORY FILTERS */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs border
                      ${
                        selectedCategories.includes(cat)
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* STATS */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-gray-500">Total Notes</p>
              <p className="text-3xl font-bold text-gray-900">{notes.length}</p>
            </div>
          </div>

          {/* MAIN CALENDAR */}
          <div className="flex-1 bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{monthYear}</h2>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg"
              >
                Today
              </button>
            </div>

            <div className="grid grid-cols-7 gap-3 text-sm">
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
                  className="text-center font-semibold text-gray-600"
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
                    className={`h-28 border rounded-xl p-2 cursor-pointer
                      ${
                        d.isCurrentMonth
                          ? "bg-white hover:shadow-md"
                          : "bg-gray-50"
                      }`}
                  >
                    <div className="text-xs font-semibold text-gray-700">
                      {d.date.getDate()}
                    </div>

                    {dayNotes.slice(0, 2).map((n) => (
                      <div
                        key={n.idNote}
                        className="text-xs text-gray-600 truncate mt-1"
                      >
                        • {n.title}
                      </div>
                    ))}

                    {dayNotes.length > 2 && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        +{dayNotes.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {modalDate?.toDateString()}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              {modalNotes.map((n) => (
                <div
                  key={n.idNote}
                  onClick={() => navigate(`/view/${n.idNote}`)}
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-semibold">{n.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {n.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
