import React from "react";
import { COLORS } from "./constants";

const ContactRow = ({ icon: Icon, children, as = "span", href }) => {
  const Comp = href ? "a" : as;
  return (
    <li className="flex items-start gap-3">
      <Icon
        className="mt-1 shrink-0"
        aria-hidden="true"
        style={{ color: COLORS.accent }}
      />
      <Comp
        {...(href ? { href } : {})}
        className="text-[15px] leading-7 outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] rounded-sm"
        style={{ color: COLORS.textDim }}
      >
        {children}
      </Comp>
    </li>
  );
};

export default ContactRow;
