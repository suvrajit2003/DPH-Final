// src/data/navItems.js
import { Home as HomeIcon } from "lucide-react";

export const navItems = [
  { 
    name: "", 
    path: "/", 
    icon: <HomeIcon className="w-5 h-5" /> 
  },
  {
    name: "About Us",
    submenu: [
      { name: "Organogram", path: "/about/organogram" },
      { 
        name: "Who is Who", 
        path: "/about/who-is-who",
        submenu: [
          { name: "Leadership", path: "/about/leadership" },
          { name: "Department Heads", path: "/about/dept-heads" },
          { name: "Staff Directory", path: "/about/staff" }
        ]
      },
      { name: "Our Mission", path: "/about/mission" },
      { name: "History", path: "/about/history" }
    ],
  },
  {
    name: "Act & Rules",
    submenu: [
      { 
        name: "Act & Rules", 
        path: "/act-rules",
        submenu: [
          { name: "Health Act 2023", path: "/act-rules/health-act" },
          { name: "Medical Rules", path: "/act-rules/medical-rules" },
          { name: "Guidelines", path: "/act-rules/guidelines" }
        ]
      },
      { name: "Programs", path: "/programs" },
      { name: "Forms", path: "/forms" },
      { name: "Schemes", path: "/schemes" },
    ],
  },
  { 
    name: "Citizen Corner", 
    path: "/citizen-corner" 
  },
  {
    name: "Notice",
    submenu: [
      { name: "Notice and Advertisement", path: "/notice/advertisement" },
      { name: "News & Events", path: "/notice/news-events" },
      { 
        name: "Tenders", 
        path: "/notice/tenders",
        submenu: [
          { name: "Current Tenders", path: "/notice/tenders/current" },
          { name: "Past Tenders", path: "/notice/tenders/past" },
          { name: "Results", path: "/notice/tenders/results" }
        ]
      },
    ],
  },
  { 
    name: "RTI", 
    path: "/rti" 
  },
  { 
    name: "Health Institutions", 
    path: "/health-institutions" 
  },
  {
    name: "Gallery",
    submenu: [
      { name: "Photo Gallery", path: "/gallery/photos" },
      { name: "Video Gallery", path: "/gallery/videos" },
    ],
  },
  { 
    name: "Contact Us", 
    path: "/contact" 
  },
    {
    name: "About Us",
    submenu: [
      { name: "Organogram", path: "/about/organogram" },
      { 
        name: "Who is Who", 
        path: "/about/who-is-who",
        submenu: [
          { name: "Leadership", path: "/about/leadership" },
          { name: "Department Heads", path: "/about/dept-heads" },
          { name: "Staff Directory", path: "/about/staff" }
        ]
      },
      { name: "Our Mission", path: "/about/mission" },
      { name: "History", path: "/about/history" }
    ],
  },
];

// Configuration for menu splitting
export const MENU_CONFIG = {
  MAX_VISIBLE_ITEMS: 8, // Maximum items to show before creating "More" dropdown
  MORE_DROPDOWN_NAME: "More"
};