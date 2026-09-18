import { useRoutes } from "react-router-dom";
import { DashBoard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SingUp";

import { UserExpenses } from "../pages/UserExpenses";
import { routesName } from "./route.constant";
import { ProtectedRoute } from "./protectedroute";
import Profile from "../pages/Profile";

const routes = [
  {
    path: routesName.login,
    element: <Login />,
  },
  {
    path: routesName.signup,
    element: <SignUp />,
  },
  {
    path: routesName.dashboard,
    element: <ProtectedRoute component={DashBoard} />,
  },
  {
    path: routesName.user,
    element: <ProtectedRoute component={UserExpenses} />,
  },
  {
    path: routesName.profile,
    element: <ProtectedRoute component={Profile} />,
  },
];

const AppRoute = () => {
  return useRoutes(routes);
};
export default AppRoute;
