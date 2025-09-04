import React from "react";

export default function AccessibilitySlider({ value, setValue, min, max, step, unit }) {
  return (
    <div className="w-full mt-2">
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer"
      />
      <p className="text-xs text-gray-600 mt-1 text-center">
        {value}{unit}
      </p>
    </div>
  );
}
