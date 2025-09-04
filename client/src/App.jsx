import React from 'react'
import {  Route, Routes } from "react-router-dom";
import { nonAuthRoutes, authRoutes, adminRoutes } from './Routes/AllRoutes';
import NonAuthLayout from './Routes/middleware/NonAuthLayout';
import AuthLayout from './Routes/middleware/AuthLayout';
import AdminLayout from './Routes/middleware/AdminLayout';
import Layout from './Screens/Layout/Layout';
import "highlight.js/styles/github.css"; 


const App = () => {
  return (
    <React.Fragment>
        <Routes>
          {nonAuthRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
            />
          ))}

           {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<AuthLayout>{route.component}</AuthLayout>}
              key={idx}
            />
          ))}

          {adminRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AdminLayout>
                  <Layout>
                    {route.component}
                  </Layout>
                </AdminLayout>
              }
              key={idx}
            />
          ))}
        </Routes>
    </React.Fragment>
  )
}

export default App
