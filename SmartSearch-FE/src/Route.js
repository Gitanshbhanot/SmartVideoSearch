import { Navigate } from "react-router-dom";
import { lazy } from "react";

const SmartSearch = lazy(() => import("./components/SmartSearch/Controller"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));

export const routes = [
  {
    path: "/",
    element: <Navigate to="/smartSearch/home" />,
    role: ["USER"],
  },
  {
    path: "/smartSearch/:pageType",
    element: <SmartSearch />,
    role: ["USER"],
  },
  {
    path: "*",
    element: <PageNotFound />,
    role: ["USER"],
  },
];
