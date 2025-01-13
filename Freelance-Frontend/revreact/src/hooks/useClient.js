import { useEffect } from "react";
import useAuth from "./useAuth";

const useClient = () => {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user.role !== "client") {
      logout(); // Optional: Log out the user if they're not a client
      console.error("Unauthorized access: User is not a client");
    }
  }, [user, isAuthenticated, logout]);

  return { user, isAuthenticated };
};

export default useClient;
