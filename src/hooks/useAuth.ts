import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "./useLoginUser";
import { useMessage } from "./useMessage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();
  const { setLoginUser } = useLoginUser();
  const navigate = useNavigate();

  const login = useCallback(
    async (name: string, password: string): Promise<boolean> => {
      setLoading(true);

      try {
        // Firestoreの users コレクションから name と password が一致するデータを検索
        const q = query(
          collection(db, "users"),
          where("name", "==", name),
          where("password", "==", password)
        );

        const querySnapshot = await getDocs(q);

        // 該当するユーザーがいない場合
        if (querySnapshot.empty) {
          showMessage({
            title: "ユーザーIDまたはパスワードが正しくありません",
            type: "error",
          });
          setLoading(false);
          return false;
        }

        // 該当したドキュメントからデータを取得
        const docSnap = querySnapshot.docs[0];
        const userData = docSnap.data();

        // ユーザー情報をグローバルステートにセット
        setLoginUser({
          userId: userData.user_id,
          name: userData.name,
          password: userData.password,
          isAdmin: userData.isAdmin
        });

        showMessage({
          title: "ログインしました。",
          type: "success",
        });

        setLoading(false);
        return true;
      } catch (error) {
        console.error("ログインエラー:", error);
        showMessage({
          title: "ログイン処理に失敗しました",
          type: "error",
        });
        setLoading(false);
        return false;
      }
    },
    [setLoginUser, showMessage, setLoading]
  );

  const logout = useCallback(() => {
    setLoginUser(null);
    localStorage.removeItem("isLoggedIn");
    navigate("/", { replace: true });
  }, [setLoginUser, navigate]);

  return { login, logout, loading, setLoginUser };
};