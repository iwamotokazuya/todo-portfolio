import { Login } from "@/components/pages/Login";
import { Todo } from "@/components/pages/Todo";
import { ProtectedRoute } from "./ProtectedRoute";
import { memo } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import { LoginUserProvider } from "@/components/providers/LoginUserProvider";

// アプリケーション全体のルーティング構造と、認証・ユーザー情報のプロバイダーを管理
export const Router = memo(() => {
  // 画面のパスと対応するコンポーネントのルーティング定義
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Login />, // ルートパス（ログイン画面）は誰でもアクセス可能
    },
    {
      // 階層下にある children のルート（/todo）へのアクセス権をまとめて保護する
      element: <ProtectedRoute />,
      children: [
        {
          path: "/todo",
          element: <Todo />,
        },
      ],
    },
  ];
  // 宣言したルート定義を React Router のフックでルーティング要素に変換
  const element = useRoutes(routes);

  // 一番外側を LoginUserProvider でラップし、配下のすべてのページ・コンポーネントでログインユーザー情報を共有できるようにする
  return <LoginUserProvider>{element}</LoginUserProvider>;
});