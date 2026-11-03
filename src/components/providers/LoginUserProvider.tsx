import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

// ログインユーザーの型定義
export type LoginUser = { 
  userId: number;
  name: string;
  password: string;
  isAdmin: boolean;
};

// ログインユーザー情報とそれを更新するセッター関数の型定義
export type LoginUserContextType = {
  loginUser: LoginUser | null;
  setLoginUser: Dispatch<SetStateAction<LoginUser | null>>;
};

// ログインユーザー情報を保持するContextの作成
export const LoginUserContext = createContext<LoginUserContextType>(
  {} as LoginUserContextType
);

// キーの名前
const STORAGE_KEY = "loginUser";

// ログインユーザーの状態を保持し、子コンポーネントへ提供するプロバイダー
export const LoginUserProvider = ({ children }: { children: ReactNode }) => {
  // 初期化時に localStorage から保存されたユーザー情報を読み込む
  const [loginUser, setLoginUser] = useState<LoginUser | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("ユーザー情報のパースに失敗しました", e);
        return null;
      }
    }
    return null;
  });

  // loginUser が変更されたら localStorage を同期する
  useEffect(() => {
    if (loginUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loginUser));
      localStorage.setItem("isLoggedIn", "true"); // 既存のフラグも連動
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("isLoggedIn");
    }
  }, [loginUser]);

  return (
    <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};