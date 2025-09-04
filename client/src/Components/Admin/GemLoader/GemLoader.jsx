
import React from "react";

export default function GemLoader() {
  return (
    <div
      className="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-3xl shadow-lg animate-spinY"
      style={{
        transformStyle: "preserve-3d",
        filter: "drop-shadow(0 0 6px #a78bfa)",
        clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
        boxShadow:
          "0 0 8px 2px #8b5cf6, 0 0 20px 6px #a78bfa, 0 0 40px 10px #c4b5fd",
      }}
    >
      <div
        className="absolute top-1 left-1 w-8 h-8 rounded-3xl bg-white opacity-30 animate-rotateShine"
        style={{ filter: "blur(2px)" }}
      />
    </div>
  );
}
