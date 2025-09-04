import React from 'react'
import MenuTable from "../../Components/Admin/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const HomepageBanner = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Banner" Rtext="Add Banner" data={SubMenuData}/>
    </div>
  )
}

export default HomepageBanner