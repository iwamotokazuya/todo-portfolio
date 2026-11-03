import { useCallback } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import type { TodoItem } from "../types/todo";
import { toaster } from "@/components/ui/toaster";

export const useTodoDeletion = (
  todos: (TodoItem & { docId: string })[],
  setTodos: React.Dispatch<React.SetStateAction<(TodoItem & { docId: string })[]>>
) => {

  // Todoをゴミ箱行きにする（論理削除）
  const softDeleteTodo = useCallback(async (id: number) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    try {
      const docRef = doc(db, "todos", targetTodo.docId);
      await updateDoc(docRef, { isDeleted: true });

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, isDeleted: true } : todo))
      );
    } catch (error) {
      console.error("Todoの削除に失敗しました:", error);
      toaster.error({
        title: "Todoの削除に失敗しました",
          description: "時間をおいて再度お試しください。",
      });
    }
  }, [todos, setTodos]);

  // ゴミ箱にあるタスクを復元する
  const restoreFromTrash = useCallback(async (id: number) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    try {
      const docRef = doc(db, "todos", targetTodo.docId);
      await updateDoc(docRef, { isDeleted: false });

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, isDeleted: false } : todo))
      );
    } catch (error) {
      console.error("Todoの復元に失敗しました:", error);
      toaster.error({
        title: "Todoの復元に失敗しました",
        description: "時間をおいて再度お試しください。",
      });
    }
  }, [todos, setTodos]);

  // Todoを配列から完全に削除する（管理者専用の完全消去用）
  const hardDeleteTodo = useCallback(async (id: number) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    try {
      const docRef = doc(db, "todos", targetTodo.docId);
      await deleteDoc(docRef);

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Todoの完全消去に失敗しました:", error);
      toaster.error({
        title: "Todoの完全消去に失敗しました",
          description: "時間をおいて再度お試しください。",
      });
    }
  }, [todos, setTodos]);

  return { softDeleteTodo, restoreFromTrash, hardDeleteTodo };
};