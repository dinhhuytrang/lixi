import React from "react";

export default function HorseRain({ count = 20 }) {
  return (
    <div className="horse-rain">
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          src="/ngua.png"
          className="flying-horse"
          alt="Ngựa bay"
          style={{
            left: Math.random() * 100 + "vw",
            animationDelay: Math.random() * 5 + "s",
            animationDuration: 6 + Math.random() * 6 + "s",
            transform: `scale(${0.5 + Math.random()})`,
          }}
        />
      ))}
    </div>
  );
}
