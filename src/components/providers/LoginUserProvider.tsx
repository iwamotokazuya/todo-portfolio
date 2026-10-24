import type { UserData } from "@/data/userData";
import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

// ログインユーザーの型定義
type LoginUser = UserData&{isAdmin: boolean};

// ログインユーザー情報とそれを更新するセッター関数の型定義
export type LoginUserContextType = {
  loginUser: LoginUser | null;
  setLoginUser: Dispatch<SetStateAction<LoginUser | null>>;
};

// ログインユーザー情報を保持するContextの作成
export const LoginUserContext = createContext<LoginUserContextType>(
  {} as LoginUserContextType
);

// ログインユーザーの状態を保持し、子コンポーネントへ提供するプロバイダー
export const LoginUserProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  // ログイン中のユーザー情報を保持するstate
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);

  return (
    <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};