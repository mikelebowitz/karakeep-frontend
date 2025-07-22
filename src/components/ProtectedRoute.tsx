import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@refinedev/core";
import { Loading } from "./Loading";

export const ProtectedRoute = () => {
  const { data, isLoading } = useIsAuthenticated();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!data?.authenticated) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};