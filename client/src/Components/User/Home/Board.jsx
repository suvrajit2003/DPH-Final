import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import boardBg from "@/assets/aboutbg.png";
import { motion } from "framer-motion";

// Animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

// Card data
const cardData = [
  {
    id: 1,
    day: "14th",
    monthYear: "Aug 2025",
    description: "Concise and clear description.",
  },
  {
    id: 2,
    day: "20th",
    monthYear: "Sep 2025",
    description: "Optimized for readability.",
  },
  {
    id: 3,
    day: "5th",
    monthYear: "Oct 2025",
    description: "Accessible and user-friendly.",
  },
  {
    id: 4,
    day: "11th",
    monthYear: "Nov 2025",
    description: "Animated and responsive.",
  },
];

export default function Board() {
  return (
    <>
      {/* Board Section */}
      <section
        className="
          relative w-full 
          flex justify-center items-center 
          bg-no-repeat bg-bottom bg-contain
          h-[280px] sm:h-[380px] md:h-[480px] lg:h-[580px]
        "
        style={{ backgroundImage: `url(${boardBg})` }}
        aria-hidden="true"
      >
        {/* Gradient overlay */}
        <div
          className="
            absolute top-0 left-0 w-full 
            h-[100px] sm:h-[150px] md:h-[180px] lg:h-[200px] 
            bg-gradient-to-b from-[rgba(78,81,229,0.43)] to-transparent
          "
        />

        {/* Cards Section */}
        <section
          aria-label="Information Cards"
          className="w-full max-w-[1800px] mx-auto px-4 py-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cardData.map((card, i) => (
              <motion.article
                key={card.id}
                className="
                relative
                bg-[#f1f1f1f0] h-[440px] rounded-xl 
                border-b-[5px] border-[#ffc107]
                shadow-[ -1px_-10px_8px_#56565654] 
                p-6 flex flex-col
                transition-all duration-300
                hover:scale-[1.03] hover:shadow-lg
                focus-within:ring-2 focus-within:ring-yellow-500
              "
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
                role="region"
                aria-labelledby={`card-title-${card.id}`}
              >
                {/* Top header bar */}
                <div
                  className="
                    font-medium text-white text-[18px] text-center
                    bg-[#4448e1] 
                    px-[10px] py-[12px]
                    rounded-t-[10px]
                    shadow-[0px_3px_4px_#7c7b7ba3]
                    absolute top-0 left-0 w-full
                  "
                >
                  Card {card.id}
                </div>

                {/* Date + Description row */}
                <header className="mt-16">
                  <div className="flex items-center gap-4">
                    {/* Date Button */}
                    <button
                      id={`card-title-${card.id}`}
                      className="w-[23%] flex justify-center items-center h-12 
             bg-amber-500 rounded-tl-[15px] rounded-br-[15px] 
             shadow-md shadow-gray-500/70 hover:shadow-amber-400/80 
             transition duration-300 ease-in-out text-white font-semibold leading-tight"
                    >
                      <div className="flex w-full h-full">
                        {/* Left part (day) */}
                        <span
                          className="flex items-center justify-center w-2/5 sm:w-2/5 
                     text-[12px] sm:text-[13px] md:text-sm lg:text-base"
                        >
                          {card.day}
                        </span>

                        {/* Right part (month/year) */}
                        <span
                          className="flex items-center justify-center bg-[#6063e5] 
                     rounded-br-[8px] w-3/5 sm:w-3/5 h-full 
                     text-[12px] sm:text-[13px] text-white"
                        >
                          {card.monthYear}
                        </span>
                      </div>
                    </button>

                    {/* Aligned text */}
                    <div className="flex-1">
                      <p className="text-[#2563eb] hover:text-green-600 font-medium">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </header>

                {/* Absolute button at bottom */}
                <button
                  className="absolute bottom-[-1.5rem] left-[9.5rem]
                           bg-yellow-500 text-black px-8 py-2 rounded-full 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 
                           transition-colors duration-300 hover:bg-yellow-400"
                >
                  <FaArrowRightLong size={20} />
                </button>
              </motion.article>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
