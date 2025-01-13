import { useEffect } from "react";
import useAuth from "./useAuth";

const useFreelancer = () => {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user.role !== "freelancer") {
      logout(); // Optional: Log out the user if they're not a freelancer
      console.error("Unauthorized access: User is not a freelancer");
    }
  }, [user, isAuthenticated, logout]);

  return { user, isAuthenticated };
};

export default useFreelancer;
