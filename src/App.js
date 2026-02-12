import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LuckyBoard from "./LuckyBoard";
import AdminPanel from "./AdminPanel";
import TetCountdown from "./TetCountdown";
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 10 }}>
        <Link to="/admin" style={{ marginRight: 10 }}>
          Admin
        </Link>
        <Link to="/" style={{ marginRight: 10 }}>
          lixi
        </Link>
        <Link to="/tet" style={{ marginRight: 10 }}>
          Tết
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<LuckyBoard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/tet" element={<TetCountdown />} />
      </Routes>
    </BrowserRouter>
  );
}
