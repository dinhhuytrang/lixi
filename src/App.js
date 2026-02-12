import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LuckyBoard from "./LuckyBoard";
import AdminPanel from "./AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 10 }}>
        <Link to="/admin" style={{ marginRight: 10 }}>
          Admin
        </Link>
        <Link to="/">lixi</Link>
      </div>

      <Routes>
        <Route path="/" element={<LuckyBoard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
