// components/RequireAuth.jsx
import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RequireAuth({ children }) {
  const { user, isAuthenticated, userFetchLoading, userFetchError, fetchUser } =
    useAuthStore();
  useEffect(() => {
    if (!isAuthenticated && !userFetchLoading && !userFetchError) {
      fetchUser();
    }
  }, [isAuthenticated, userFetchLoading, fetchUser, user]);
  if (userFetchLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated && userFetchError) {
    toast.error("Failed to fetch user data. redirecting to login.");
    return <Navigate to="/login" />;
  }
  return children;
}
