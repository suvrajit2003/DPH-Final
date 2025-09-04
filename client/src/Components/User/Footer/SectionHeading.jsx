import React from "react";
import { COLORS } from "./constants";

const SectionHeading = ({ children }) => (
  <div className="relative mb-6">
    <span
      aria-hidden="true"
      className="absolute -left-1 top-2 h-2 w-2 rounded-full"
      style={{ backgroundColor: COLORS.accent }}
    />
    <h3 className="pl-4 text-[20px] font-semibold text-white">{children}</h3>
    <div
      className="mt-3 ml-4 h-px w-full"
      style={{ backgroundColor: COLORS.line }}
      aria-hidden="true"
    />
  </div>
);

export default SectionHeading;
