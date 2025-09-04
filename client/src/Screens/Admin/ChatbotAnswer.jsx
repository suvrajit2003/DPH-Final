import React from 'react'
import MenuTable from "../../Components/Admin/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const ChatbotAnswer = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Chatbot Answer" Rtext="Add Answer" data={SubMenuData}/>
    </div>
  )
}

export default ChatbotAnswer