import { memo } from "react";
import { Header } from "../organisms/Header";

export const Todo = memo(() => {
  return(
    <>
      <Header />
      <div>Todoページ</div>
    </>
  );
})