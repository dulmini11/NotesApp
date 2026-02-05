import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Notes from "./pages/notes";
import Add from "./pages/add";
import Update from "./pages/update";
import AllNotes from "./pages/allnotes";
import PinnedNotes from "./pages/pinnednotes";
import ViewNote from "./pages/ViewNote";
import CalendarPage from "./pages/CalendarPage";
import LoadingPage from "./pages/LoadingPage";
import Checklists from "./pages/checklists";
import Trash from "./pages/trash";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Reduced to 2 seconds for better UX

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/add" element={<Add />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/allnotes" element={<AllNotes />} />
            <Route path="/pinned" element={<PinnedNotes />} />
            <Route path="/view/:id" element={<ViewNote />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/trash" element={<Trash />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;