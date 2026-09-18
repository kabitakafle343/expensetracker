import { Navigate } from "react-router-dom";
import TokenService from "../api/tokenservice";
import { UserLayOut } from "../layout/UserLayout";

export const ProtectedRoute = ({ component: Component }: any) => {
  const isAuthenticated = TokenService.getToken();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <UserLayOut>
        <Component />
      </UserLayOut>
    </>
  );
};
