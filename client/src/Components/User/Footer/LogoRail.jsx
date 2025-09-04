import React from "react";
import { motion } from "framer-motion";

const LogoRail = () => {
  const logos = [
    {
      src: "https://mtpl.work/dph/storage/importantlinks/1752153470_pt1jpg.webp",
      alt: "Partner 1 Logo",
    },
    {
      src: "https://mtpl.work/dph/storage/importantlinks/1752153479_pt2jpg.webp",
      alt: "Partner 2 Logo",
    },
    {
      src: "https://mtpl.work/dph/storage/importantlinks/1752153488_pt3jpg.webp",
      alt: "Partner 3 Logo",
    },
    {
      src: "https://mtpl.work/dph/storage/importantlinks/1753449151_pcipng.webp",
      alt: "PCI Certified Logo",
    },
  ];

  return (
    <div className="relative">
      <div className="mx-auto -mt-14 w-[95%] md:w-[53%]">
        <div className="rounded-b-[40px] bg-white/95 shadow-lg ring-1 ring-black/10 px-4 py-4">
          <div className="flex flex-wrap justify-center gap-6">
            {logos.map((logo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                whileFocus={{ scale: 1.08 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative flex h-20 w-36 items-center justify-center rounded-xl 
                           p-[2px] focus:outline-none group"
                tabIndex={0}
              >
                {/* Gradient Border (hidden by default, animates on hover/focus) */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]
                                bg-[length:200%_200%] opacity-0 
                                group-hover:opacity-100 group-focus:opacity-100 
                                animate-gradient-spin pointer-events-none transition-opacity duration-300"></div>

                {/* Inner white container */}
                <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-white shadow-sm 
                                transition-all duration-300 ease-in-out 
                                hover:shadow-md 
                                focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-h-14 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoRail;
