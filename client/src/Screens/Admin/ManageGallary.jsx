import React from 'react'
import MenuTable from "../../Components/Admin/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const ManageGallary = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Gallery Category" Rtext="Add Category" data={SubMenuData}/>
    </div>
  )
}

export default ManageGallary