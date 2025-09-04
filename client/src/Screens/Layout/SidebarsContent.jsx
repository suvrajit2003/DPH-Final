import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiFoodMenu, BiSolidDashboard } from "react-icons/bi";
import {
  MdCardMembership,
  MdImageSearch,
  MdSettingsSuggest,
} from "react-icons/md";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { RiArrowDropRightFill } from "react-icons/ri";
import { Bot } from "lucide-react";
import { GiNetworkBars } from "react-icons/gi";
import { IoIosLink } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { FaPenToSquare, FaUsersRectangle } from "react-icons/fa6";

const SidebarsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    setSelectedItem(location.pathname);

    const matchingParent = menuItems.find((item) =>
      item.submenu?.some((sub) => sub.path === location.pathname)
    );
    if (matchingParent) {
      setExpandedMenu(matchingParent.path);
    }
  }, [location.pathname]);

  const handleClick = (path, hasSubmenu = false) => {
    if (hasSubmenu) {
      setExpandedMenu((prev) => (prev === path ? null : path));
    } else {
      navigate(path);
      setSelectedItem(path);
    }
  };

  const classes = {
    active:
      "flex items-center justify-between px-4 py-3 mt-2 text-md font-semibold tracking-wide text-white bg-[#2E3A8C] rounded-lg cursor-pointer transition-all duration-300",
    inactive:
      "flex items-center justify-between px-4 py-3 mt-2 text-md font-semibold tracking-wide text-[#49608c] rounded-lg cursor-pointer hover:text-white hover:bg-[#4F68A4] transition-all duration-300",
    subItem:
      "flex items-center gap-2 ml-2 mt-1 px-3 py-2 text-sm text-[#49608c] hover:text-white hover:bg-[#6b82b1] rounded-md cursor-pointer transition-all duration-200 truncate",
    subItemActive:
      "flex items-center gap-2 ml-2 mt-1 px-3 py-2 text-sm text-white bg-[#2E3A8C] rounded-md cursor-pointer transition-all duration-200 truncate",
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <BiSolidDashboard size={24} />,
    },
    {
      path: "/admin/menusetup",
      label: "Menu Setup",
      icon: <BiFoodMenu size={24} />,
      submenu: [
        {
          label: "Menu",
          path: "/admin/menusetup/menu",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Sub Menu",
          path: "/admin/menusetup/submenu",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Sub-sub Menu",
          path: "/admin/menusetup/subsubmenu",
          icon: <RiArrowDropRightFill size={30} />,
        },
      ],
    },
    {
      path: "/admin/manage-chatbot",
      label: "Manage Chatbot",
      icon: <Bot size={24} />,
      submenu: [
        {
          label: "Chatbot Category",
          path: "/admin/manage-chatbot/chatbot-category",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Chatbot Question",
          path: "/admin/manage-chatbot/chatbot-question",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Chatbot Answer",
          path: "/admin/manage-chatbot/chatbot-answer",
          icon: <RiArrowDropRightFill size={30} />,
        },
      ],
    },
    {
      path: "/admin/workflow",
      label: "Workflow",
      icon: <GiNetworkBars size={24} />,
      submenu: [
        {
          label: "News and Events",
          path: "/admin/workflow/news-and-events",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Act and Rules",
          path: "/admin/workflow/act-and-rules",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Footer Link",
          path: "/admin/workflow/footerlink",
          icon: <RiArrowDropRightFill size={30} />,
        },
      ],
    },
    {
      path: "/admin/generate-link",
      label: "Generate Link",
      icon: <IoIosLink size={24} />,
    },
    {
      path: "/admin/image-setup",
      label: "Image Setup",
      icon: <MdImageSearch size={24} />,
      submenu: [
        {
          label: "Homepage Banner",
          path: "/admin/image-setup/homepage-banner",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Home Admin",
          path: "/admin/image-setup/home-admin",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Manage Gallery",
          path: "/admin/image-setup/manage-galary",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Photo Gallery",
          path: "/admin/image-setup/photo-galary",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Video Gallery",
          path: "/admin/image-setup/video-galary",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Important Links",
          path: "/admin/image-setup/important-links",
          icon: <RiArrowDropRightFill size={30} />,
        },
      ],
    },
    {
      path: "/admin/notifications",
      label: "Notification",
      icon: <IoNotifications size={24} />,
      submenu: [
        {
          label: "Tenders",
          path: "/admin/notifications/tenders",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Notices",
          path: "/admin/notifications/notices",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Advertisements",
          path: "/admin/notifications/advertisements",
          icon: <RiArrowDropRightFill size={30} />,
        },
        
        {
          label: "Holidays",
          path: "/admin/notifications/holidays",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Scheme",
          path: "/admin/notifications/scheme",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Policy",
          path: "/admin/notifications/policy",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Bed Strength",
          path: "/admin/notifications/bed-strength",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Forms",
          path: "/admin/notifications/forms",
          icon: <RiArrowDropRightFill size={30} />,
        }
      ],
    },
    {
      path: "/admin/home-config",
      label: "Home Configuration",
      icon: <MdSettingsSuggest size={24} />,
    },
    {
      path: "/admin/directors-desk",
      label: "Director's Desk",
      icon: <FaPenToSquare size={24} />,
    },
    {
      path: "/admin/user-management",
      label: "User Setup",
      icon: <FaUsersRectangle size={24} />,
      submenu: [
        {
          label: "Manage Users",
          path: "/admin/user-management/users",
          icon: <RiArrowDropRightFill size={30} />,
        },
         {
          label: "Page Permissions",
          path: "/admin/page-permission",
          icon: <RiArrowDropRightFill size={30} />,
        },
        {
          label: "Pages",
          path: "/admin/user-management/pages",
          icon: <RiArrowDropRightFill size={30} />,
        },
      ],
    },
  ];

  return (
    <div>
      {menuItems.map((item) => {
        const isActive = selectedItem.startsWith(item.path);
        const isExpanded = expandedMenu === item.path;

        return (
          <div key={item.path}>
            <div
              className={isActive ? classes.active : classes.inactive}
              onClick={() => handleClick(item.path, !!item.submenu)}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2 truncate">{item.label}</span>
              </div>
              {item.submenu &&
                (isExpanded ? <FiChevronDown /> : <FiChevronRight />)}
            </div>

            {/* Submenu with animation */}
            {item.submenu && (
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {item.submenu.map((sub) => (
                  <div
                    key={sub.path}
                    className={
                      selectedItem === sub.path
                        ? classes.subItemActive
                        : classes.subItem
                    }
                    onClick={() => handleClick(sub.path)}
                  >
                    {sub.icon}
                    <span className="truncate">{sub.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarsContent;
