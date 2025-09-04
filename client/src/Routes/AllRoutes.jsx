import React from "react";
import { Navigate } from "react-router-dom";
import PageNotFound from "@/Screens/Common/PageNotFound";



// user routes here
import Home from "@/Screens/User/Home";






















import Dashboard from "../Screens/Admin/Dashboard";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";
import Membership from "../Screens/Admin/Menu/AddMenu";


import Menu from "../Screens/Admin/Menu/Menu";
import SubMenu from "../Screens/Admin/Menu/SubMenu";
import AddSubMenu from "../Screens/Admin/Menu/AddSubMenu";

// -----------------------
import SubSubMenu from "../Screens/Admin/Menu/SubSubMenu";
import AddSubSubMenu from "../Screens/Admin/Menu/AddSubSubMenu";

import NewsAndEvents from "../Screens/Admin/Workflow/NewsAndEvents";
import ActAndRules from "../Screens/Admin/Workflow/ActAndRules";
import Footerlink from "../Screens/Admin/Workflow/Footerlink";
import HomeAdminPage from "../Screens/Admin/HomeAdmin";

import ManageGallaryList from "../Screens/Admin/ImageSetup/ManageGalleryList"
import ManageGallaryForm from "../Screens/Admin/ImageSetup/ManageGalleryForm"

import PhotoGalaryList from "../Screens/Admin/ImageSetup/PhotoGalleryList"
import PhotoGalaryForm from "../Screens/Admin/ImageSetup/PhotoGalleryForm"

import VideoGalaryList from "../Screens/Admin/ImageSetup/VideoGalleryList"
import VideoGalaryForm from "../Screens/Admin/ImageSetup/VideoGalleryForm"



import HomeConfiguration from "../Screens/Admin/HomeConfiguration";
import Scheme from "../Screens/Admin/Notifications/Scheme";
import Policy from "../Screens/Admin//Notifications/Policy";
import BedStrength from "../Screens/Admin//Notifications/BedStrength";
import Forms from "../Screens/Admin//Notifications/Forms_1";
import DirectorDeskPage from "../Screens/Admin/DirectorsDesk";

import PageForm from "../Screens/Admin/ManageUser/PageForm"
import PageList from "../Screens/Admin/ManageUser/PageList"
import AssignPermissionPage from "../Screens/Admin/ManageUser/PagePermission"
import UserList from "../Screens/Admin/ManageUser/UserList";
import UserForm from "../Screens/Admin/ManageUser/UserForm";


// Notifications
import TenderFormPage  from "../Screens/Admin/Notifications/TenderFormPage"
import TenderListPage from "../Screens/Admin/Notifications/TenderListPage"
import ManageCorrigendumsPage from "../Screens/Admin/Notifications/CorrigendumPage"


import NoticeListPage from "../Screens/Admin/Notifications/NoticeListPage"
import NoticeFormPage from "../Screens/Admin/Notifications/NoticeFormPage"

import AdvertisementListPage from "../Screens/Admin/Notifications/AdvertisementListPage"
import AdvertisementFormPage from "../Screens/Admin/Notifications/AdvertisementFormPage"

import HolidayListPage from "../Screens/Admin/Notifications/HolidayListPage"
import HolidayFormPage from "../Screens/Admin/Notifications/HolidayFormPage"

import PolicyForm from "../Screens/Admin/Notifications/PolicyForm";   
import SchemeForm from "../Screens/Admin/Notifications/SchemeForm";
import BedStrengthForm from "../Screens/Admin/Notifications/BedStrengthForm";
import FormForm from "../Screens/Admin/Notifications/FormForm";


import HomepageBannerList from "../Screens/Admin/ImageSetup/HomepageBannerList";
import HomePageBannerForm from "../Screens/Admin/ImageSetup/HomePageBannerForm"


//workflow

import NewsAndEventForm from "../Screens/Admin/Workflow/NewsAndEventForm";
import ActAndRuleForm from "../Screens/Admin/Workflow/ActAndRuleForm";
import FooterlinkForm from "../Screens/Admin/Workflow/FooterLinkForm";



//chatbot

import ChatBotTable from "../Screens/Admin/Chatbot/ChatBotTable";
import ChatBotQuestion from "../Screens/Admin/Chatbot/ChatBotQuestion"; 
import ChatBotAnswer from "../Screens/Admin/Chatbot/ChatBotAnswer";
import AddChatbotCategory from "../Screens/Admin/Chatbot/AddChatbotCategory";
import AddChatBotQuestion from "../Screens/Admin/Chatbot/AddChatBotQuestion"; 
import AddChatBotAnswer from "../Screens/Admin/Chatbot/AddChatBotAnswer";
import ImportantLinks from "../Screens/Admin/ImageSetup/ImportantLinks";
import AddImportantLink from "../Screens/Admin/ImageSetup/AddImportantLink";

import GenerateLinkPage from "../Screens/Admin/GenerateLink/GenerateLink";
import GenerateLinkForm from "../Screens/Admin/GenerateLink/GenerateLinkForm";

import ChangePasswordPage from "../Screens/Admin/ChangePassword";



//user
import ImportantLink from "../Screens/User/ImportantLink";


// import ImportantLinks from "@/Screens/User/ImportantLinks";

const authRoutes = [
    { path: "/login", component: <Login /> },
  { path: "/sign-up", component: <SignUp /> },
   {path:"*", component: <PageNotFound/>},
]

const nonAuthRoutes = [

  {path:"*", component: <PageNotFound/>},
  {path:"/important-link", component: <ImportantLink />},


    // user routes here-------------------------------------------

 { path: "/", component: <Home /> },
];

const adminRoutes = [


  {path:"*", component: <PageNotFound/>},
  { path: "/admin/dashboard", component: <Dashboard /> },
 
  {
    path: "/admin/",
    exact: true,
    component: <Navigate to="/admin/dashboard" />,
  },
  { path: "/admin/change-password", component: <ChangePasswordPage /> },

//s:menu
    { path: "/admin/menusetup/menu", component: <Menu /> },
    { path: "/admin/menusetup/submenu", component: <SubMenu /> },
    //Add sub menu link
    { path: "/admin/menusetup/submenu/create", component: <AddSubMenu /> },

//edit structure
  { path: "/admin/menusetup/menu/add", component: <Membership /> },
     { path: "/admin/menusetup/menu/edit/:id", component: <Membership /> },
// edit submenu
     { path: "/admin/menusetup/submenu/edit/:id", component: <AddSubMenu /> },

{path:"/admin/menusetup/subsubmenu", component: <SubSubMenu />},
// SubSubMenuForm
{path:"/admin/menusetup/subsubmenu/create", component: <AddSubSubMenu />},

{ path: "/admin/menusetup/subsubmenu/edit/:id", component: <AddSubSubMenu /> },
















  // { path: "/admin/manage-chatbot/chatbot-category", component: <ManageChatbot /> },
  {
    path: "/admin/manage-chatbot/chatbot-category",
    component: <ChatBotTable />,
  },
  { 
    path: "/admin/manage-chatbot/add-category", 
    component: <AddChatbotCategory /> 
  },
  { 
    path: "/admin/manage-chatbot/edit-category/:id", 
    component: <AddChatbotCategory /> 
  },
  {
    path: "/admin/manage-chatbot/chatbot-question",
    component: <ChatBotQuestion />, // Fixed: Capital B
  },
  { 
    path: "/admin/manage-chatbot/add-question", 
    component: <AddChatBotQuestion /> 
  },
  { 
    path: "/admin/manage-chatbot/edit-question/:id", 
    component: <AddChatBotQuestion /> 
  },
  {
    path: "/admin/manage-chatbot/chatbot-answer",
    component: <ChatBotAnswer />, // Fixed: Capital B
  },
  { 
    path: "/admin/manage-chatbot/add-answer", 
    component: <AddChatBotAnswer /> 
  },
  { 
    path: "/admin/manage-chatbot/edit-answer/:id", 
    component: <AddChatBotAnswer /> 
  },
  // Workflow routes
  {
    path: "/admin/workflow/news-and-events/add",
    component: <NewsAndEventForm />,
  },
   {
    path: "/admin/workflow/news-and-events",
    component: <NewsAndEvents />,
  },
  {
    path: "/admin/workflow/news-and-events/edit/:id",
    component: <NewsAndEventForm />,
  },
  { path: "/admin/workflow/act-and-rules", component: <ActAndRules /> },
  {
    path: "/admin/workflow/act-and-rules/add",
    component: <ActAndRuleForm />,
  },

  // Route to the "Edit" form, with a dynamic ':id' parameter
  {
    path: "/admin/workflow/act-and-rules/edit/:id",
    component: <ActAndRuleForm />,
  },
  { path: "/admin/workflow/footerlink", component: <Footerlink /> },
  {
    path: "/admin/workflow/footerlink/add",
    component: <FooterlinkForm />, // Points to the new form
  },
  {
    path: "/admin/workflow/footerlink/edit/:id",
    component: <FooterlinkForm />, // Also points to the new form
  },
  // Generate Link route
  { path: "/admin/generate-link", component: <GenerateLinkPage /> },
    { path: "/admin/generate-link/add", component: <GenerateLinkForm /> },
      { path: "/admin/generate-link/edit/:id", component: <GenerateLinkForm /> },



  // Image Setup routes
  // { path: "/admin/image-setup/homepage-banner", component: <HomepageBanner /> },
  { path: "/admin/image-setup/home-admin", component: <HomeAdminPage /> },



    { path: "/admin/image-setup/homepage-banner", component: <HomepageBannerList /> },
    { path: "/admin/image-setup/homepage-banner/add", component: <HomePageBannerForm/> },
    { path: "/admin/image-setup/homepage-banner/edit/:id", component: <HomePageBannerForm/> },


      { path: "/admin/image-setup/manage-galary", component: <ManageGallaryList /> },
      { path: "/admin/image-setup/manage-galary/add", component: <ManageGallaryForm /> },
      { path: "/admin/image-setup/manage-galary/edit/:id", component: <ManageGallaryForm /> },

    
    
      { path: "/admin/image-setup/photo-galary", component: <PhotoGalaryList /> },
      { path: "/admin/image-setup/photo-galary/add", component: <PhotoGalaryForm /> },
      { path: "/admin/image-setup/photo-galary/edit/:id", component: <PhotoGalaryForm /> },


     { path: "/admin/image-setup/video-galary", component: <VideoGalaryList /> },
     { path: "/admin/image-setup/video-galary/add", component: <VideoGalaryForm /> },
     { path: "/admin/image-setup/video-galary/edit/:id", component: <VideoGalaryForm /> },


  
  { path: "/admin/image-setup/important-links", component: <ImportantLinks /> },
  { path: "/admin/image-setup/important-links/add", component: <AddImportantLink /> },
  { path: "/admin/image-setup/important-links/edit/:id", component: <AddImportantLink /> },



  // Notification routes
  { path: "/admin/notifications/tenders", component: <TenderListPage /> },
    { path: "/admin/notifications/tenders/add", component: <TenderFormPage /> },
        { path: "/admin/notifications/tenders/edit/:id", component: <TenderFormPage /> },
           {path:"/admin/notifications/tenders/:tenderId/corrigendums", component: <ManageCorrigendumsPage /> },


  { path: "/admin/notifications/notices", component: <NoticeListPage /> },
    { path: "/admin/notifications/notices/add", component: <NoticeFormPage /> },
        { path: "/admin/notifications/notices/edit/:id", component: <NoticeFormPage /> },







  { path: "/admin/notifications/advertisements", component: <AdvertisementListPage /> },
    { path: "/admin/notifications/advertisements/add", component: <AdvertisementFormPage /> },
      { path: "/admin/notifications/advertisements/edit/:id", component: <AdvertisementFormPage /> },



  
//noti

  { path: "/admin/notifications/scheme", component: <Scheme /> },
  {
    path: "/admin/notifications/scheme/add",
    component: <SchemeForm />,
  },
  {
    path: "/admin/notifications/scheme/edit/:id",
    component: <SchemeForm />,
  },
  { path: "/admin/notifications/policy", component: <Policy /> },
  {
    path: "/admin/notifications/policy/add",
    component: <PolicyForm />,
  },
  {
    path: "/admin/notifications/policy/edit/:id",
    component: <PolicyForm />
  },


  { path: "/admin/notifications/bed-strength", component: <BedStrength /> },
    { path: "/admin/notifications/bed-strength/add", component: <BedStrengthForm /> },
     {
    path: "/admin/notifications/bed-strength/edit/:id",
    component: <BedStrengthForm />},



  { path: "/admin/notifications/forms", component: <Forms /> },
    { path: "/admin/notifications/forms/add", component: <FormForm /> },
      { path: "/admin/notifications/forms/edit/:id", component: <FormForm /> },


  { path: "/admin/notifications/holidays", component: <HolidayListPage /> },
    { path: "/admin/notifications/holidays/add", component: <HolidayFormPage /> },
        { path: "/admin/notifications/holidays/edit/:id", component: <HolidayFormPage /> },

  // Home configuration routes
  { path: "/admin/home-config", component: <HomeConfiguration /> },
  // Directors Desk route
  { path: "/admin/directors-desk", component: <DirectorDeskPage /> },
  // Membership route
  { path: "/admin/membership", component: <Membership /> },


{ path: "/admin/image-setup/homepage-banner", component: <HomepageBannerList /> },
    { path: "/admin/image-setup/homepage-banner/add", component: <HomePageBannerForm/> },
    { path: "/admin/image-setup/homepage-banner/edit/:id", component: <HomePageBannerForm/> },






    { path: "/admin/user-management/pages", component: <PageList /> },
    { path: "/admin/user-management/pages/add", component: <PageForm /> },
    { path: "/admin/user-management/pages/edit/:id", component: <PageForm /> },
    {
    path: "/admin/page-permission",
    component: <AssignPermissionPage />,
  },

    { path: "/admin/user-management/users", component: <UserList /> },
    { path: "/admin/user-management/users/add", component: <UserForm /> },
    { path: "/admin/user-management/users/edit/:id", component: <UserForm /> },
];



export { adminRoutes, nonAuthRoutes, authRoutes };
