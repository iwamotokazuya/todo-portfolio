import { UserDataSet } from "../data/userData";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "./useLoginUser";
import { useMessage } from "./useMessage";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {showMessage} = useMessage();
  const {setLoginUser} = useLoginUser();

  const login = useCallback((name: string, password: string) => {
    setLoading(true);

    const user = UserDataSet.find(
      (u) => u.name === name && u.password === password
    );

    if (user) {
      const isAdmin = user.name === "admin" ? true : false;
      setLoginUser({...user, isAdmin});
      showMessage({
        title: "ログインしました。",
        type: "success"
      })
      navigate("/todo");
    } else {
      showMessage({
        title: "ユーザーIDまたはパスワードが正しくありません",
        type: "error"});
    }

    setLoading(false);
  }, [navigate, setLoginUser, showMessage]);

  const logout = useCallback(() => {
    setLoginUser(null);
    showMessage({
      title: "ログアウトしました",
      type: "info",
    });
    navigate("/");
  }, [navigate, setLoginUser, showMessage]);

  return { login, logout, loading, setLoginUser };
};