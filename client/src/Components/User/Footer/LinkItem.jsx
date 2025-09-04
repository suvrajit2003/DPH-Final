import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { MdArrowRightAlt } from "react-icons/md";
import { COLORS } from "./constants";

const LinkItem = ({ href, label, external = true }) => (
  <li className="group flex items-start gap-3">
    <MdArrowRightAlt
      className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
      aria-hidden="true"
      style={{ color: COLORS.accent }}
    />
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-[15px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] rounded-sm"
      style={{ color: COLORS.textDim }}
    >
      <span className="transition-colors duration-200 group-hover:text-white">
        {label}
      </span>
    </a>
  </li>
);

export default LinkItem;
