import React from "react";
import Banner from "@/Components/User/Home/Banner";
import TickerBar from "@/Components/User/Home/TickerBar ";
import DirectorDesk from "@/Components/User/Home/DirectorDesk";
import Board from "@/Components/User/Home/Board";
import Galary from "@/Components/User/Home/Galary";

const Home = () => {
  return (
    <div>
      <Banner />
      <TickerBar />
      <DirectorDesk />
      <Board />
      <Galary />
    </div>
  );
};

export default Home;
