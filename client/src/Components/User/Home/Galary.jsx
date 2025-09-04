import React, { useState, useRef } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import banbg from "@/assets/banbg.png";
import photo1 from "@/assets/g2.jpg";
import photo2 from "@/assets/g3.jpg";
import photo3 from "@/assets/g4.jpg";
import photo4 from "@/assets/g5.jpg";
import { motion } from "framer-motion";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
  }),
};

const photos = [
  { src: photo1, label: "Photo 1" },
  { src: photo2, label: "Photo 2" },
  { src: photo3, label: "Photo 3" },
  { src: photo4, label: "Photo 4" },
];

// Helper to generate calendar days
const generateCalendar = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push("");
  for (let d = 1; d <= daysInMonth; d++) days.push(d.toString());
  return days;
};

const Galary = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const days = generateCalendar(month, year);

  const swiperRef = useRef(null);
  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  return (
    <main className="w-full">
      {/* Banner Section */}
      <section
        className="
          relative w-full min-h-[280px] sm:min-h-[400px] lg:min-h-[548px]
          flex items-center justify-center
          bg-[#dadbfb] bg-no-repeat bg-cover
          py-12 sm:py-16 lg:py-20 mb-5
        "
        style={{
          backgroundImage: `url(${banbg})`,
          backgroundAttachment: "fixed",
        }}
        role="region"
        aria-label="Gallery and Events Section"
      >
        <div className="absolute inset-0 bg-black/40 sm:bg-black/30"></div>
        <div className="absolute left-0 top-0 h-full w-[28%] bg-[#4aa2ff66]" aria-hidden="true"></div>
        <div className="absolute right-0 top-0 h-full w-[28%] bg-[#4aa2ff66]" aria-hidden="true"></div>

        <motion.div
          className="relative z-10 max-w-[1880px] mx-auto w-full px-4 lg:px-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* --- Social Box --- */}
            <motion.section
              className="w-full md:w-[30%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md transition-all"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
              aria-labelledby="social-heading"
            >
              <h2 id="social-heading" className="text-white text-lg font-semibold flex items-center gap-2">
                Social Link
              </h2>
              <nav aria-label="Social Media Links" className="flex gap-2 mt-2">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-[#ffc107] text-black rounded px-2 py-1 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaInstagram />
                </motion.a>
              </nav>
              <div className="mt-3 border-t border-white/50"></div>
              <div
                className="h-[240px] mt-4 bg-[#00000055] rounded-lg border border-white/20"
                role="presentation"
              ></div>
            </motion.section>

            {/* --- Gallery (Swiper) --- */}
            <motion.section
              className="w-full md:w-[44%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md transition-all"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={1}
              aria-labelledby="gallery-heading"
            >
              <div className="flex justify-between items-center">
                <h2 id="gallery-heading" className="text-white text-lg font-semibold">Gallery</h2>
                <div className="flex gap-2">
                  <button className="bg-[#ffc107] text-sm px-2 py-1 rounded hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300">
                    Photo
                  </button>
                  <button className="bg-white text-sm px-2 py-1 rounded hover:bg-gray-200 focus:ring-2 focus:ring-gray-400">
                    Video
                  </button>
                </div>
              </div>
              <div className="mt-3 border-t border-white/50"></div>

              <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={12}
                loop={photos.length > 2}
                speed={600}
                breakpoints={{
                  768: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 12 },
                }}
                className="mt-4"
                aria-label="Photo Gallery"
              >
                {photos.map((p, idx) => (
                  <SwiperSlide key={idx}>
                    <figure className="relative h-56 w-full overflow-hidden rounded-lg border border-white/20 group shadow-md transition-all">
                      <img
                        src={p.src}
                        alt={p.label}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 flex items-end">
                        <div className="w-full p-2 text-white text-sm bg-gradient-to-t from-black/60 to-transparent">
                          {p.label}
                        </div>
                      </figcaption>
                    </figure>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mt-4 flex justify-end gap-2">
                <motion.button
                  className="bg-[#ffc107] p-2 rounded-full hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300"
                  aria-label="Previous slide"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  onClick={slidePrev}
                >
                  <IoIosArrowBack />
                </motion.button>
                <motion.button
                  className="bg-[#ffc107] p-2 rounded-full hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300"
                  aria-label="Next slide"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  onClick={slideNext}
                >
                  <IoIosArrowForward />
                </motion.button>
              </div>
            </motion.section>

            {/* --- Event Calendar --- */}
            <motion.section
              className="w-full md:w-[30%] bg-[#00000033] backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-md transition-all"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={2}
              aria-labelledby="calendar-heading"
            >
              <h2 id="calendar-heading" className="text-white text-lg font-semibold">Event Calendar</h2>
              <div className="mt-3 border-t border-white/50"></div>

              <div className="flex justify-between items-center mt-4 text-white">
                <motion.button
                  className="bg-[#ffc107] p-2 rounded-full hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300"
                  aria-label="Previous month"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  onClick={prevMonth}
                >
                  <IoIosArrowBack />
                </motion.button>
                <h3 className="font-semibold" aria-live="polite">
                  {months[month]} {year}
                </h3>
                <motion.button
                  className="bg-[#ffc107] p-2 rounded-full hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300"
                  aria-label="Next month"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  onClick={nextMonth}
                >
                  <IoIosArrowForward />
                </motion.button>
              </div>

              <div className="grid grid-cols-7 gap-2 mt-4 text-white text-sm" role="grid">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} role="columnheader" className="text-center font-semibold">{d}</div>
                ))}
                {days.map((day, i) => {
                  const isToday =
                    day &&
                    parseInt(day) === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
                  return (
                    <motion.div
                      key={i}
                      role="gridcell"
                      aria-selected={isToday ? "true" : "false"}
                      className={`border border-white/40 text-center py-1 rounded-md transition-all ${
                        day ? "cursor-pointer" : ""
                      } ${isToday ? "bg-[#ffc107] text-black font-bold shadow-md shadow-yellow-400" : "hover:bg-yellow-400 hover:text-black"}`}
                      whileHover={day && !isToday ? { scale: 1.05 } : {}}
                    >
                      {day}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Galary;
