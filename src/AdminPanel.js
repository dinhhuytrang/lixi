import React, { useMemo, useState } from "react";
import "./lucky.css";

const STORAGE_KEY = "lixi_config_v1";

const defaultConfig = {
  title: "Li Xì May Mắn – Học Viện 96",
  subtitle: "CHÚC MỪNG NĂM MỚI – VẠN SỰ NHƯ Ý",
  cardsCount: 12,
  denoms: [
    { value: 10000, count: 6 },
    { value: 20000, count: 4 },
    { value: 50000, count: 2 },
  ],
};

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw);
    return { ...defaultConfig, ...parsed };
  } catch {
    return defaultConfig;
  }
}

function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function formatVND(n) {
  return (n || 0).toLocaleString("vi-VN") + "đ";
}

function calcTotal(denoms) {
  return denoms.reduce(
    (s, d) => s + Number(d.value || 0) * Number(d.count || 0),
    0,
  );
}

export default function AdminPanel() {
  const [cfg, setCfg] = useState(loadConfig());
  const totalMoney = useMemo(() => calcTotal(cfg.denoms), [cfg.denoms]);
  const totalPieces = useMemo(
    () => cfg.denoms.reduce((s, d) => s + Number(d.count || 0), 0),
    [cfg.denoms],
  );

  function setField(field, value) {
    setCfg((p) => ({ ...p, [field]: value }));
  }

  function updateDenom(i, field, value) {
    setCfg((p) => {
      const denoms = [...p.denoms];
      denoms[i] = { ...denoms[i], [field]: value };
      return { ...p, denoms };
    });
  }

  function addDenom() {
    setCfg((p) => ({
      ...p,
      denoms: [...p.denoms, { value: 10000, count: 1 }],
    }));
  }

  function removeDenom(i) {
    setCfg((p) => ({ ...p, denoms: p.denoms.filter((_, idx) => idx !== i) }));
  }

  function handleSave() {
    // sanitize
    const cleaned = {
      ...cfg,
      cardsCount: Math.max(1, Number(cfg.cardsCount || 1)),
      denoms: cfg.denoms
        .map((d) => ({
          value: Math.max(0, Number(d.value || 0)),
          count: Math.max(0, Number(d.count || 0)),
        }))
        .filter((d) => d.value > 0 && d.count > 0),
    };

    saveConfig(cleaned);
    alert("Đã lưu cấu hình! Qua trang Board để chạy.");
  }

  function handleReset() {
    setCfg(defaultConfig);
  }

  return (
    <div className="lm-page">
      <header className="lm-header">
        <h1>Admin – Cấu hình Lì Xì</h1>
        <div className="lm-sub">Nhập mệnh giá & số lượng rồi bấm Lưu</div>
      </header>

      <section className="admin admin-full">
        <div className="admin-row">
          <label>Tiêu đề:</label>
          <input
            className="admin-wide"
            value={cfg.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </div>

        <div className="admin-row">
          <label>Sub:</label>
          <input
            className="admin-wide"
            value={cfg.subtitle}
            onChange={(e) => setField("subtitle", e.target.value)}
          />
        </div>

        <div className="admin-row">
          <label>Số thẻ:</label>
          <input
            type="number"
            min={1}
            value={cfg.cardsCount}
            onChange={(e) => setField("cardsCount", e.target.value)}
          />
          <div className="admin-hint">
            Tổng tiền: <b>{formatVND(totalMoney)}</b> • Tổng “tờ”:{" "}
            <b>{totalPieces}</b>
          </div>
        </div>

        <div className="admin-grid">
          <div className="admin-head">Mệnh giá (VND)</div>
          <div className="admin-head">Số lượng</div>
          <div className="admin-head"></div>

          {cfg.denoms.map((d, idx) => (
            <React.Fragment key={idx}>
              <input
                type="number"
                min={0}
                value={d.value}
                onChange={(e) => updateDenom(idx, "value", e.target.value)}
              />
              <input
                type="number"
                min={0}
                value={d.count}
                onChange={(e) => updateDenom(idx, "count", e.target.value)}
              />
              <button className="admin-danger" onClick={() => removeDenom(idx)}>
                Xóa
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="admin-actions">
          <button className="lm-btn" onClick={addDenom}>
            + Thêm mệnh giá
          </button>
          <button className="lm-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="lm-btn" onClick={handleSave}>
            Lưu cấu hình
          </button>
        </div>

        <div className="admin-note">
          Gợi ý: nếu bạn ít tiền, nhập nhiều <b>10k/20k</b>, giảm hoặc bỏ{" "}
          <b>50k/100k</b>. Nếu số lượng “tờ” &lt; số thẻ, Board sẽ tự fill các
          thẻ còn lại = <b>0đ</b> (có thể đổi).
        </div>
      </section>
    </div>
  );
}

export { STORAGE_KEY };
