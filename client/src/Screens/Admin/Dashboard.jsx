import React, { useState, useEffect } from "react";
import axios from "axios";
import { useModal } from "../../context/ModalProvider"; // Import for error handling

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg animate-pulse h-28">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null); // Initialize stats as null
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const { showModal } = useModal();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (err) {
        showModal("error", err.response?.data?.message  || err.message );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showModal]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  
  const cards = stats ? [
    { title: "Tenders", value: stats.tenderCount, gradient: "from-indigo-400 to-indigo-600" },
    { title: "Notice & Advertisement", value: stats.noticeAndAdCount, gradient: "from-teal-400 to-teal-600" },
    { title: "News & Events", value: stats.newsEventCount, gradient: "from-amber-400 to-amber-600" },
    { title: "Users", value: stats.userCount, gradient: "from-rose-400 to-rose-600" },
  ] : [];

  return (
    <div className="p-6 min-h-[80vh] bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((card, i) => {
              const isHovered = hoverIndex === i;
              return (
                <div
                  key={card.title}
                  className="group relative"
                
                >
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300`}
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full h-24 opacity-20"
                      style={{
                        background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'><path fill='white' fill-opacity='1' d='M0,96L48,85.3C96,75,192,53,288,64C384,75,480,117,576,138.7C672,160,768,160,864,144C960,128,1056,96,1152,85.3C1248,75,1344,85,1392,90.7L1440,96L1440,320L0,320Z'></path></svg>")`,
                        backgroundSize: "cover",
                        animation: `waveMove ${isHovered ? "3s" : "6s"} ease-in-out infinite alternate`,
                      }}
                    ></div>

                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold drop-shadow-md">
                        {card.title}
                      </h3>
                      <p className="text-4xl font-bold drop-shadow-lg mt-2">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <style>
        {`
          @keyframes waveMove {
            0% { transform: translateY(0) scaleX(1); }
            100% { transform: translateY(-10px) scaleX(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;