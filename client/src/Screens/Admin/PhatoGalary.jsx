import React from 'react'
import MenuTable from "../../Components/Admin/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const PhatoGalary = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Photo Gallery" Rtext="Add Photo" data={SubMenuData}/>
    </div>
  )
}

export default PhatoGalary