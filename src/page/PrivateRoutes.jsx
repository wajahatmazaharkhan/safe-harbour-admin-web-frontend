import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const PrivateRoutes = () => {
  let auth = useAuthStore((state) => state.authenticated);
  return auth ? <Outlet /> : <Navigate to={"/sign-in"} replace />;
};

export default PrivateRoutes;
