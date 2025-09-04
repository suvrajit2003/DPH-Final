import React from 'react'
import MenuTable from "../../Components/Admin/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const GenerateLink = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Generate Link" Rtext="Add Link" data={SubMenuData}/>
    </div>
  )
}

export default GenerateLink