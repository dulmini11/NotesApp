import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/notes"
import Add from "./pages/add"
import Update from "./pages/update"
import AllNotes from "./pages/allnotes";
import PinnedNotes from "./pages/pinnednotes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/update/:id" element={<Update/>}/>
        <Route path="/allnotes" element={<AllNotes/>}/>
        <Route path="/pinned" element={<PinnedNotes/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
