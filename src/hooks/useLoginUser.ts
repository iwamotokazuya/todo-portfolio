import { useContext } from "react";
import { LoginUserContext, type LoginUserContextType } from "../components/providers/LoginUserProvider";

//ログイン中のユーザー情報や更新関数（setLoginUser）を取得するためのカスタムフック
export const useLoginUser = (): LoginUserContextType => useContext(LoginUserContext);