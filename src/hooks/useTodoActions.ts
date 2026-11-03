import { useCallback } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import type { TodoItem, TodoUpdateFields } from "../types/todo";
import { isOverdue, PRIORITY_MAP } from "./useTodos";
import { toaster } from "@/components/ui/toaster";

export const useTodoActions = (
  userId: number | undefined,
  todos: (TodoItem & { docId: string })[],
  setTodos: React.Dispatch<React.SetStateAction<(TodoItem & { docId: string })[]>>,
  setIsAddOpen: (isOpen: boolean) => void,
  setEditingTodo: (todo: TodoItem | null) => void
) => {

  // 新規Todoの追加
  const addTodo = useCallback(
    async (todo: Omit<TodoItem, "id" | "isCompleted" | "createdAt" | "isDeleted">): Promise<boolean> => {
      if (userId === undefined || userId === null) return false;

      const overdue = isOverdue(todo.dueDate);
      const effectivePriority = overdue ? "high" : todo.priority;
      const nextId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

      const newTodoFirestoreData = {
        user_id: userId,
        todo_id: nextId,
        title: todo.title,
        content: todo.content,
        dueDate: todo.dueDate,
        priority: PRIORITY_MAP[effectivePriority],
        isCompleted: false,
        isDeleted: false,
        createdAt: serverTimestamp(),
      };

      try {
        const docRef = await addDoc(collection(db, "todos"), newTodoFirestoreData);
        
        const newTodoStateItem: TodoItem & { docId: string } = {
          docId: docRef.id,
          id: nextId,
          title: todo.title,
          content: todo.content,
          dueDate: todo.dueDate,
          priority: effectivePriority,
          isCompleted: false,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        };

        setTodos((prev) => [newTodoStateItem, ...prev]);
        setIsAddOpen(false);
        return true;
      } catch (error) {
        console.error("Todoの追加に失敗しました:", error);
        toaster.error({
          title: "Todoの追加に失敗しました",
          description: "時間をおいて再度お試しください。",
        });
        return false;
      }
    },
    [userId, todos, setTodos, setIsAddOpen]
  );

  // 既存Todoの更新
  const updateTodo = useCallback(async (id: number, updatedFields: TodoUpdateFields) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    const overdue = isOverdue(updatedFields.dueDate);
    const effectivePriority = overdue ? "high" : updatedFields.priority;

    try {
      const docRef = doc(db, "todos", targetTodo.docId);
      await updateDoc(docRef, {
        title: updatedFields.title,
        content: updatedFields.content,
        dueDate: updatedFields.dueDate,
        priority: PRIORITY_MAP[effectivePriority],
      });

      setTodos((prev) =>
        prev.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              ...updatedFields,
              priority: effectivePriority,
            };
          }
          return todo;
        })
      );
      setEditingTodo(null);
    } catch (error) {
      console.error("Todoの更新に失敗しました:", error);
      toaster.error({
        title: "Todoの更新に失敗しました",
        description: "時間をおいて再度お試しください。",
      });
    }
  }, [todos, setTodos, setEditingTodo]);

  // Todoを完了にする
  const completeTodo = useCallback(async (id: number) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    try {
      const docRef = doc(db, "todos", targetTodo.docId);
      await updateDoc(docRef, { isCompleted: true });

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: true } : todo))
      );
    } catch (error) {
      console.error("Todoの完了処理に失敗しました:", error);
      toaster.error({
        title: "Todoの完了処理に失敗しました",
        description: "時間をおいて再度お試しください。",
      });
    }
  }, [todos, setTodos]);

  // 完了したTodoを未完了（Active）に差し戻す
  const restoreTodo = useCallback(async (id: number) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    try {
      const docRef = doc(db, "todos", targetTodo.docId);
      await updateDoc(docRef, { isCompleted: false });

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: false } : todo))
      );
    } catch (error) {
      console.error("Todoの差し戻しに失敗しました:", error);
      toaster.error({
        title: "Todoの差し戻しに失敗しました",
        description: "時間をおいて再度お試しください。",
      });
    }
  }, [todos, setTodos]);

  return { addTodo, updateTodo, completeTodo, restoreTodo };
};