import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import TypingSession from "./pages/TypingSession";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<TypingSession />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/results" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
