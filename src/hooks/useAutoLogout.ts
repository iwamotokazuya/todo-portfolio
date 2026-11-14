import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { toaster } from "../components/ui/toaster";

// 自動タイムアウト時間30分
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export const useAutoLogout = () => {
  const { logout } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ログアウトを実行し、トーストで通知する関数
  const handleLogout = useCallback(() => {
    logout();
    toaster.info({
      title: "ログアウトしました",
      description: "一定時間操作がなかったため、セッションが終了しました。",
    });
  }, [logout]);

  // タイマーをリセットする関数
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    }
  }, [handleLogout]);

  useEffect(() => {
    // 監視するユーザー操作イベント
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    // 初回マウント時にタイマーを開始
    resetTimer();

    // イベントリスナー登録
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // クリーンアップ
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);
};