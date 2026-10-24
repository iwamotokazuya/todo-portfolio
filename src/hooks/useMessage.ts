import { useCallback } from "react";
import { toaster } from "@/components/ui/toaster"

// showMessage関数に渡す引数の型定義
type Props = {
  title: string;
  type: "info" | "warning" | "success" | "error"
}

//アプリ内でトースト通知（ポップアップメッセージ）を手軽に表示するためのカスタムフック
export const useMessage = () => {
  const showMessage = useCallback((props:Props) => {
    const {title, type} = props;
    toaster.create({
      title,
      type,
      duration: 3000
    })
  }, []);

  return {showMessage};
}