import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
      
        <Navbar />
         <AppRoutes />
        
          
        
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
