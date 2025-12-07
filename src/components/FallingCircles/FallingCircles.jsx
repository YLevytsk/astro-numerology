import React, { useEffect, useState } from "react";
import "./FallingCircles.css";

export default function FallingCircles() {
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const size = Math.floor(Math.random() * 80) + 20; // 20–100px
      const left = Math.random() * 95; // 0–95%
      const duration = (Math.random() * 5 + 5).toFixed(2); // 5–10s

      const newCircle = {
        id: Date.now(),
        size,
        left,
        duration,
      };

      setCircles((prev) => [...prev, newCircle]);

      // удаляем старые после окончания анимации
      setTimeout(() => {
        setCircles((prev) => prev.filter((c) => c.id !== newCircle.id));
      }, duration * 1000);
    }, 500); // каждые полсекунды создаём кружок

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="circles-container">
      {circles.map((circle) => (
        <span
          key={circle.id}
          className="circle falling"
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            left: `${circle.left}%`,
            animationDuration: `${circle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}


