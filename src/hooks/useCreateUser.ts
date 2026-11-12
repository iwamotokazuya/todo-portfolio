import { useCallback, useState } from "react";
import { useMessage } from "./useMessage";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  const createUser = useCallback(
    async (name: string, password: string): Promise<boolean> => {
      setLoading(true);

      try {
        // ユーザー名の重複チェック
        const q = query(collection(db, "users"), where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          showMessage({
            title: "このユーザー名はすでに使用されています",
            type: "error",
          });
          setLoading(false);
          return false;
        }

        // 新規ユーザーデータの作成
        const newUser = {
          user_id: String(Date.now()),
          name: name,
          password: password,
          isAdmin: false,
        };

        await addDoc(collection(db, "users"), newUser);

        showMessage({
          title: "ユーザー登録が完了しました。ログインしてください。",
          type: "success",
        });

        setLoading(false);
        return true;
      } catch (error) {
        console.error("ユーザー登録エラー:", error);
        showMessage({
          title: "ユーザー登録に失敗しました",
          type: "error",
        });
        setLoading(false);
        return false;
      }
    },
    [showMessage]
  );

  return { createUser, loading };
};