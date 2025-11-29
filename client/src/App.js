import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/notes"
import Add from "./pages/add"
import Update from "./pages/update"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/update/:id" element={<Update/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
