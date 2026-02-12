import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./tet.css";
import HorseRain from "./HorseRain";
const TET_TIME = new Date("2026-02-17T00:00:00");

export default function TetCountdown() {
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();
  <HorseRain count={20} />;
  const diff = TET_TIME - now;
  const totalSeconds = Math.floor(diff / 1000);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ===== 60 GIÂY CUỐI ===== */
  useEffect(() => {
    if (totalSeconds > 0 && totalSeconds <= 60) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
      });
    }
  }, [totalSeconds]);

  /* ===== GIAO THỪA ===== */
  useEffect(() => {
    if (totalSeconds === 0) {
      localStorage.setItem("tet_firework_start", Date.now());

      const end = Date.now() + 6000;
      (function fire() {
        confetti({
          particleCount: 120,
          spread: 120,
          origin: { x: Math.random(), y: Math.random() * 0.6 },
        });
        if (Date.now() < end) requestAnimationFrame(fire);
      })();

      setTimeout(() => navigate("/"), 60 * 60 * 1000);
    }
  }, [totalSeconds, navigate]);

  /* ================= SAU GIAO THỪA ================= */
  if (totalSeconds <= 0) {
    const daysAfter = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));

    const tetDays = [
      {
        title: "🌸 MÙNG 1 TẾT 🌸",
        text: "Sức khỏe dồi dào – Gia đạo bình an – Phúc lộc viên mãn",
      },
      {
        title: "🌸 MÙNG 2 TẾT 🌸",
        text: "An vui trọn vẹn – Hạnh phúc đủ đầy – Vạn sự hanh thông",
      },
      {
        title: "🌸 MÙNG 3 TẾT 🌸",
        text: "Trí tuệ khai minh – Công danh tiến phát – Phúc lành bền lâu",
      },
    ];

    const today = tetDays[Math.min(daysAfter, tetDays.length - 1)];

    return (
      <div className="tet-page fireworks">
        <img src="/ngua.png" alt="Ngựa Tết" className="tet-horse big" />

        <h1 className="run-text"> CHÚC MỪNG NĂM MỚI 2026 – BÍNH NGỌ </h1>

        <h2>{today.title}</h2>
        <p className="wish">{today.text}</p>
      </div>
    );
  }

  /* ================= ĐẾM NGƯỢC ================= */
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className="tet-page">
      <img src="/ngua.png" alt="Ngựa Tết" className="tet-horse" />

      <h1>ĐẾM NGƯỢC TẾT ÂM 2026 – BÍNH NGỌ</h1>

      <div className="countdown">
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
        {String(s).padStart(2, "0")}
      </div>

      {totalSeconds <= 60 && (
        <div className="alert">🎆 60 GIÂY CUỐI – CHUẨN BỊ GIAO THỪA 🎆</div>
      )}
    </div>
  );
}
