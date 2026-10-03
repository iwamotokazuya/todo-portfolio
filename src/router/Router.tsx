import { Login } from "@/components/pages/Login";
import { Todo } from "@/components/pages/Todo";
import { memo } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import { LoginUserProvider } from "@/components/providers/LoginUserProvider";

export const Router = memo(() => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/todo",
      element: <Todo />,
    },
  ];
  const element = useRoutes(routes);

  return <LoginUserProvider>{element}</LoginUserProvider>;
});