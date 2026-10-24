import { UserDataSet } from "../data/userData";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "./useLoginUser";
import { useMessage } from "./useMessage";

export const useAuth = () => {
  // ローディング中の状態管理
  const [loading, setLoading] = useState(false);
  // トーストなどで画面にメッセージを表示するためのカスタムフック
  const { showMessage } = useMessage();
  // ログイン中のユーザー情報をグローバルに保持するためのカスタムフック
  const { setLoginUser } = useLoginUser();
  const navigate = useNavigate();

  // ログイン処理
  const login = useCallback((name: string, password: string): boolean => {
      setLoading(true);
      // ユーザーデータ配列から、入力値に一致するユーザーを検索
      const user = UserDataSet.find(
        (u) => u.name === name && u.password === password
      );

      // 該当するユーザーがいない場合
      if (!user) {
        showMessage({
          title: "ユーザーIDまたはパスワードが正しくありません",
          type: "error",
        });
        setLoading(false);
        return false;
      }

      // ユーザー名が "admin" の場合は管理者フラグ（isAdmin）を true に設定
      const isAdmin = user.name === "admin";
      setLoginUser({ ...user, isAdmin });

      showMessage({
        title: "ログインしました。",
        type: "success",
      });

      setLoading(false);
      return true;
    },
    // 依存配列：フック内で使用している外部関数やセッターを指定
    [setLoginUser, showMessage, setLoading]
  );

  // ログアウト処理（ユーザー情報をクリアし、ローカルストレージのログインフラグを削除してログイン画面へ強制遷移）
  const logout = useCallback(() => { 
    setLoginUser(null);
    localStorage.removeItem("isLoggedIn");
    navigate("/", { replace: true });
  }, [setLoginUser, navigate]);

  return { login, logout, loading, setLoginUser };
};