import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaChevronRight } from "react-icons/fa";

import { COLORS, FACET_BG } from "./constants";
import SectionHeading from "./SectionHeading";
import LinkItem from "./LinkItem";
import ContactRow from "./ContactRow";
import LogoRail from "./LogoRail";

const AllFooterComponent = () => {
  return (
    <footer
      className={`relative isolate bg-[#5f77a5] ${FACET_BG} bg-blend-multiply`}
      aria-labelledby="site-footer-heading"
    >
      <h2 id="site-footer-heading" className="sr-only">
        Site footer
      </h2>

      <LogoRail />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto w-[95%] md:w-[88%] px-4 md:px-2 pb-10 pt-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Useful Links */}
          <nav aria-label="Useful links">
            <SectionHeading>Useful Links</SectionHeading>
            <ul className="space-y-3">
              <LinkItem
                href="https://www.cewacor.nic.in/error/error.html"
                label="Test Link"
              />
            </ul>
          </nav>

          {/* Important Links */}
          <nav aria-label="Important links">
            <SectionHeading>Important Links</SectionHeading>
            <ul className="space-y-3">
              <LinkItem href="https://mohfw.gov.in/" label="Ministry Of Health &amp; Family" />
              <LinkItem href="https://odisha.gov.in/" label="Government Of Orissa Website" />
              <LinkItem href="https://nhmodisha.gov.in/" label="National Health Mission, Odisha" />
              <LinkItem href="https://ncdc.gov.in/" label="National Institute Of" />
              <LinkItem href="https://idsp.nic.in/" label="Integrated Disease Surveillance" />
              <li className="pt-1">
                <a
                  href="http://localhost:5173/important-link"
                  className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors"
                  style={{ color: COLORS.accent }}
                >
                  Read More
                  <FaChevronRight aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Us */}
          <address className="not-italic">
            <SectionHeading>Contact Us</SectionHeading>
            <ul className="space-y-4">
              <ContactRow icon={FaMapMarkerAlt}>
                Ground Floor, HOD Building, Bhubaneswar- 751001
              </ContactRow>
              <ContactRow icon={FaEnvelope} href="mailto:dph.orissa@gmail.com">
                dph[dot]orissa[at]gmail[dot]com
              </ContactRow>
              <ContactRow icon={FaPhone} href="tel:+916742396977">
                91-674-2396977
              </ContactRow>
            </ul>
          </address>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div
        className="relative mt-2 w-full py-3 text-center text-[13px]"
        style={{ backgroundColor: COLORS.bottom, color: COLORS.textDim }}
      >
        © {new Date().getFullYear()} Department of Public Health | All Rights Reserved
        
      </div>
    </footer>
  );
};

export default AllFooterComponent;
