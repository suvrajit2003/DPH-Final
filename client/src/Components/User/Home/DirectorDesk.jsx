import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Reusable Section Title
const SectionTitle = ({ children }) => (
  <>
    <motion.h2
      variants={fadeInUp}
      className="text-[#6260d9] text-[25px] tracking-wide font-semibold"
    >
      {children}
    </motion.h2>
    <motion.div
      variants={fadeIn}
      className="h-[1px] bg-gray-300 w-full mt-1 mb-6 relative"
    >
      <span className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-[#facc15]" />
    </motion.div>
  </>
);

// Reusable Button
const ReadMoreButton = ({ label }) => (
  <motion.button
    aria-label={label}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-[#facc15] text-black w-24 h-10 flex items-center justify-center 
               rounded-full shadow hover:bg-yellow-400 transition-colors duration-300"
  >
    <ArrowRight size={20} />
  </motion.button>
);

export default function DirectorDesk() {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://mtpl.work/dph/assets/user/images/bodybg-two.jpg')",
      }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-white/90 pointer-events-none" />

      {/* Content wrapper must be relative so overlay stays behind */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
        className="relative px-6 py-10 lg:px-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Section - Director's Desk */}
          <motion.article variants={fadeInUp}>
            <SectionTitle>From The Director's Desk</SectionTitle>

            <div className="flex gap-5 items-start">
              {/* Director Image */}
              <motion.figure
                variants={fadeIn}
                whileHover={{ scale: 1.03 }}
                className="flex-shrink-0 border border-gray-300 p-1 bg-white"
              >
                <img
                  src="https://mtpl.work/dph/storage/directorsdesk/1752154160_director.webp"
                  alt="Dr. Nilakantha Mishra, Director of Public Health Odisha"
                  className="w-[13rem] h-[14rem] object-cover rounded-sm"
                  loading="lazy"
                />
              </motion.figure>

              {/* Director Text */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-[#6260d9] text-[22px] font-semibold mb-2">
                  Dr. Nilakantha Mishra
                </h3>
                <p className="text-gray-700 text-[16px] leading-relaxed text-justify max-w-lg">
                  Health is a state of complete physical, mental, and social
                  well-being and not merely the absence of disease or infirmity.
                  "HEALTH FOR ALL" does not mean an end to disease and
                  disability or that doctors and nurses will be for everyone. It
                  means that resources for health are evenly distributed and
                  tha...
                </p>
              </motion.div>
            </div>

            {/* Button */}
            <div className="mt-6 flex justify-end">
              <ReadMoreButton label="Read more about Director's Desk" />
            </div>
          </motion.article>

          {/* Right Section - About Us */}
          <motion.article variants={fadeInUp} className="relative">
            {/* Spiral Decoration */}
            <div
              className="absolute -left-[3.5rem] top-0 bottom-0 hidden lg:flex flex-col justify-center"
              style={{
                backgroundImage:
                  "url('https://mtpl.work/dph/assets/user/images/spiral.png')",
                backgroundRepeat: "repeat-y",
                backgroundSize: "auto 10px",
                width: "28px",
              }}
              aria-hidden="true"
            />

            <SectionTitle>About Us</SectionTitle>

            <motion.p
              variants={fadeInUp}
              className="text-gray-700 text-[16px] leading-relaxed text-justify max-w-5xl"
            >
              Consequent upon the creation of the post of Director of Public
              Health, Odisha vide Health & F.W. Department Resolution No.
              14994/H Dt. 06-05-09, the Directorate of Public Health shall act
              as an independent directorate with various public health
              activities. It will provide leadership support to the Public
              Health Program of the State under the leadership of one director
              supported by an additional director (PH), joint directors
              (PH/NCD/Waste Management & Mental Health), deputy directors
              (IDSP/IDD & Vital Statistics), and office establishment. Broadly,
              the Director of Public Health shall deal with three functional
              areas, such as planning & development of public health policy,
              management of public health programs, and capacity building of
              staff in public health disciplines....
            </motion.p>

            {/* Button */}
            <div className="mt-6 flex justify-end pt-[4rem]">
              <ReadMoreButton label="Read more About Us" />
            </div>
          </motion.article>
        </div>
      </motion.div>
    </section>
  );
}
