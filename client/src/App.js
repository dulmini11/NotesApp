import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Notes from "./pages/notes";
import Add from "./pages/add";
import Update from "./pages/update";
import AllNotes from "./pages/allnotes";
import PinnedNotes from "./pages/pinnednotes";
import ViewNote from "./pages/ViewNote";
import CalendarPage from "./pages/CalendarPage";
import LoadingPage from "./pages/LoadingPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Notes/>}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/update/:id" element={<Update/>}/>
          <Route path="/allnotes" element={<AllNotes/>}/>
          <Route path="/pinned" element={<PinnedNotes/>}/>
          <Route path="/view/:id" element={<ViewNote />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;