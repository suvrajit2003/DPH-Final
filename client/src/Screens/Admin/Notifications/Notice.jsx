import React from 'react'
import MenuTable from "../../Components/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const Notice = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Notice" Rtext="Add Notice" data={SubMenuData}/>
    </div>
  )
}

export default Notice