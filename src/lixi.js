import React, { useState } from "react";
import "./lucky.css";
import { STORAGE_KEY } from "./AdminPanel";

const DEFAULT_LABELS = [
  "Bình An",
  "Mạnh Khỏe",
  "Hạnh Phúc",
  "May Mắn",
  "Tài Lộc",
  "Thành Công",
  "An Khang",
  "Phú Quý",
  "Như Ý",
  "Bình Yên",
  "Vạn Sự",
  "Sung Túc",
  "Thuận Lợi",
  "Vững Bền",
  "Tươi Vui",
  "Hanh Thông",
];

const defaultConfigFallback = {
  title: "LÌ XÌ MAY MẮN - 2026",
  subtitle: "CHÚC MỪNG NĂM MỚI – VẠN SỰ NHƯ Ý",
  cardsCount: 12,
  denoms: [
    { value: 10000, count: 6 },
    { value: 20000, count: 4 },
    { value: 50000, count: 2 },
  ],
};

/* ================== Utils ================== */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadCfg() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfigFallback;
    return { ...defaultConfigFallback, ...JSON.parse(raw) };
  } catch {
    return defaultConfigFallback;
  }
}

function buildPool(denoms) {
  const pool = [];
  for (const d of denoms || []) {
    const value = Number(d.value);
    const count = Number(d.count);
    if (!Number.isFinite(value) || !Number.isFinite(count)) continue;
    if (value <= 0 || count <= 0) continue;
    for (let i = 0; i < count; i++) pool.push(value);
  }
  return pool;
}

function formatVND(n) {
  return (n || 0).toLocaleString("vi-VN") + " VND";
}

function createCards(cfg) {
  const n = Math.max(1, Number(cfg.cardsCount || 12));
  const labels = shuffle(DEFAULT_LABELS).slice(0, n);
  const amounts = shuffle(buildPool(cfg.denoms));

  return labels.map((label, idx) => ({
    id: `${Date.now()}-${idx}`,
    label,
    amount: amounts[idx] ?? 0,
    opened: false,
    orderNo: idx + 1,
  }));
}

/* ================== Modal ================== */

function CongratsModal({ open, card, onClose, onClaim }) {
  if (!open || !card) return null;

  return (
    <div className="lm-modalOverlay" onMouseDown={onClose}>
      <div className="lm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="lm-modalClose" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="lm-modalTitle">Chúc Mừng!</div>

        <div className="lm-modalMascot">
          <img src="/ngua.png" alt="Mascot" />
        </div>

        <div className="lm-modalSub">
          Chúc bạn một năm mới tiền vào như nước!
        </div>

        <div className="lm-modalMoney">{formatVND(card.amount)}</div>

        <button className="lm-claimBtn" onClick={onClaim}>
          Nhận Lộc
        </button>
      </div>
    </div>
  );
}

/* ================== Main ================== */

export default function LuckyBoard() {
  const cfg = loadCfg();
  const [cards, setCards] = useState(() => createCards(cfg));
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  function regen() {
    const newCfg = loadCfg();
    setCards(createCards(newCfg));
    setSelected(null);
    setModalOpen(false);
  }

  function openCard(card) {
    if (card.opened) return;
    setSelected(card);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function claim() {
    setCards((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, opened: true } : c)),
    );
    setModalOpen(false);
  }

  return (
    <div className="lm-page">
      <header className="lm-header">
        <h1>{cfg.title}</h1>
        <div className="lm-sub">{cfg.subtitle}</div>

        <div className="lm-actions">
          <button className="lm-btn" onClick={regen}>
            Random lại
          </button>
        </div>
      </header>

      <main className="lm-grid">
        {cards.map((c) => (
          <div
            key={c.id}
            className={`lm-card ${c.opened ? "opened" : ""}`}
            onClick={() => openCard(c)}
            role="button"
            tabIndex={0}
            title={c.opened ? "Đã mở" : "Click để mở"}
          >
            <div className="lm-badge">{c.orderNo}</div>

            <div className="lm-mascotWrap">
              <div className="lm-mascot">
                <img src="/ngua.png" alt="Mascot" />
              </div>

              {!c.opened ? (
                <div className="lm-year">2026</div>
              ) : (
                <div className="lm-money">{formatVND(c.amount)}</div>
              )}
            </div>

            <div className="lm-text">{c.label}</div>
          </div>
        ))}
      </main>

      <CongratsModal
        open={modalOpen}
        card={selected}
        onClose={closeModal}
        onClaim={claim}
      />
    </div>
  );
}
