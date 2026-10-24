import { Navigate, Outlet } from "react-router-dom";

// 未ログイン状態でのアクセスを制御し、適切なページへリダイレクトする
export const ProtectedRoute = () => {
  // ローカルストレージからログインフラグを取得し、"true"であるかを確認
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  // 未ログインの場合は、履歴を残さずにログイン画面へ強制リダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ログイン済みの場合は、todo画面をそのまま描画・表示する
  return <Outlet />;
};