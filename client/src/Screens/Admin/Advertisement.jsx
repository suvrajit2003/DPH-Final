import React from 'react'
import MenuTable from "../../Components/Admin/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const Advertisement = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Advertisement" Rtext="Add Advertisement" data={SubMenuData}/>
    </div>
  )
}

export default Advertisement