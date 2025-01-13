import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Import pages
import LandingPage from "./pages/Visitor/LandingPage";
import Login from "./pages/Visitor/Login";
import Register from "./pages/Visitor/Register";
import FreelancerHome from "./pages/Freelancer/Home";
import Portfolio from "./pages/Freelancer/Portfolio";
import FreelancerProfile from "./pages/Freelancer/Profile";
import FreelancerOffers from "./pages/Freelancer/Offers";

import ClientProfile from "./pages/Client/Profile";
import ClientProjects from "./pages/Client/MyProjects";
import ClientOffers from "./pages/Client/MyOffers";
import Search from './pages/Client/Search';


const AppRoutes = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Helper function to handle route protection
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Freelancer Routes */}
      <Route
        path="/freelancer/home"
        element={
          <PrivateRoute>
            {user?.role === "freelancer" ? <FreelancerHome /> : <Navigate to="/" />}
          </PrivateRoute>
        }
      />
      <Route
        path="/freelancer/portfolio"
        element={
          <PrivateRoute>
            
            {user?.role === "freelancer" ? <Portfolio /> : <Navigate to="/" />}
          </PrivateRoute>
        }
      />

      <Route
        path="/freelancer/offers"
        element={
         <PrivateRoute>
        {user?.role === "freelancer" ? <FreelancerOffers /> : <Navigate to="/" />}
        </PrivateRoute>
  }
/>
      <Route
        path="/freelancer/profile"
        element={
          <PrivateRoute>
            {user?.role === "freelancer" ? <FreelancerProfile /> : <Navigate to="/" />}
          </PrivateRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/client/projects"
        element={
          <PrivateRoute>
            {user?.role === "client" ? <ClientProjects /> : <Navigate to="/" />}
          </PrivateRoute>
        }
      />
      <Route
        path="/client/profile"
        element={
          <PrivateRoute>
            {user?.role === "client" ? <ClientProfile /> : <Navigate to="/" />}
          </PrivateRoute>
        }
        
      />
      <Route
        path="/client/projects/:projectId/offers"
        element={
          <PrivateRoute>
             {user?.role === "client" ? <ClientOffers /> : <Navigate to="/" />}
          </PrivateRoute>
        }
        
      />
       <Route
        path="/client/search"
        element={
          <PrivateRoute>
             {user?.role === "client" ? <Search /> : <Navigate to="/" />}
          </PrivateRoute>
        }
        
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
