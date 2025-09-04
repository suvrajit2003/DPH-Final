import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bgPattern from "@/assets/bodybg.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = () => {
  const swiperRef = useRef(null);

  const cardsData = [
    {
      id: 1,
      name: "John Smith",
      designation: "Director General",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      color: "bg-[#e3b016d9]",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      designation: "Project Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      color: "bg-[#5f5edbb0]",
    },
    {
      id: 3,
      name: "Michael Chen",
      designation: "Technical Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      color: "bg-[#2196f396]",
    },
  ];

  const banners = [
    {
      src: "https://mtpl.work/dph/storage/banners/1752133942_homebanner.webp",
      alt: "Modern office building",
    },
    {
      src: "https://mtpl.work/dph/storage/banners/1752133959_homebanner.webp",
      alt: "Business meeting with stakeholders",
    },
  ];

  return (
    <section className="w-full max-w-[2000px] mx-auto z-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px] lg:min-h-[500px] shadow-xl overflow-hidden">
        
        {/* Left Section - Swiper */}
        <div className="relative lg:col-span-3 h-[300px] sm:h-[400px] lg:h-[500px]">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, Pagination]}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
            }}
            className="w-full h-full"
          >
            {banners.map((banner, i) => (
              <SwiperSlide key={i}>
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="absolute bottom-4 right-4 flex gap-3 z-10">
            <button
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white 
                bg-gradient-to-r from-indigo-600 to-amber-300/95 shadow-lg hover:scale-105 transition"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => swiperRef.current?.swiper?.slideNext()}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white 
                bg-gradient-to-r from-indigo-600 to-amber-300/95 shadow-lg hover:scale-105 transition"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Right Section - Leadership Cards */}
        <div
          className="relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 
            min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            backgroundPosition: "top left",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="relative z-10 w-full max-w-sm mx-auto space-y-6">
            {cardsData.map((card) => (
              <div
                key={card.id}
                className={`relative p-6 rounded-xl shadow-md hover:shadow-lg transition 
                  transform hover:scale-[1.02] duration-300 ease-in-out ${card.color} text-white`}
              >
                <div className="absolute top-[0.4rem] left-[-1.5rem] w-[6rem] h-[6rem] rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={card.image}
                    alt={`Portrait of ${card.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="pl-20">
                  <h3 className="font-semibold text-xl tracking-wide truncate">
                    {card.name}
                  </h3>
                  <p className="text-lg tracking-wide opacity-80 truncate">
                    {card.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
        }
      `}</style>
    </section>
  );
};

export default Banner;