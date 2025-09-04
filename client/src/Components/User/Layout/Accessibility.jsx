import React, { useState } from "react";
import AccessibilityButton from "@/Components/User/Accessibility/AccessibilityButton";
import AccessibilityWindow from "@/Components/User/Accessibility/AccessibilityWindow";

export default function Accessibility() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className=""
        // style={{
        //   backgroundImage:
        //     "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')",
        // }}
    >
      <AccessibilityButton onClick={() => setIsOpen(true)} />
      <AccessibilityWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
