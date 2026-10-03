import { useContext } from "react";
import { LoginUserContext, type LoginUserContextType } from "../components/providers/LoginUserProvider";

export const useLoginUser = (): LoginUserContextType => useContext(LoginUserContext);