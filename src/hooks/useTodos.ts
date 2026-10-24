import { useState, useMemo, useCallback } from "react";
import type { Priority, TodoItem, FilterStatus, SortOrder, TodoUpdateFields } from "../types/todo";

// 本日の日付を "YYYY-MM-DD" 形式の文字列で取得
export const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// "YYYY-MM-DD"形式の日付を"YYYY/MM/DD"表記に変換（未設定なら "—" を返す）
export const formatDateToSlash = (dateStr: string) => {
  if (!dateStr) return "—";
  return dateStr.replace(/-/g, "/");
};

// 指定した期日（dueDate）が今日より過去（期限切れ）かどうかを判定する関数
export const isOverdue = (dueDate: string) => {
  if (!dueDate) return false;
  const today = getTodayString();
  return dueDate < today;
};

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  // フィルターおよびソートの状態管理
  // active: 未完了, completed: 完了済み, deleted: 削除済み（管理者限定）
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("active");
  // 優先度ソート (asc / desc / null)
  const [priorityOrder, setPriorityOrder] = useState<SortOrder | null>(null);
  // 期限ソート (asc / desc / null)
  const [dueDateOrder, setDueDateOrder] = useState<SortOrder | null>(null);

  // モーダル（ダイアログ）の開閉および編集対象の管理
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // フィルター切り替え時にソート順をリセット
  const handleFilterChange = useCallback((status: FilterStatus) => {
    setFilterStatus(status);
    setPriorityOrder(null);
    setDueDateOrder(null);
  }, []);

  // 優先度ソートの切り替え
  const handleSortPriority = useCallback(() => {
    setPriorityOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  }, []);

  // 期限ソートの切り替え
  const handleSortDueDate = useCallback(() => {
    setDueDateOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  }, []);

  // 新規Todoの追加
  const addTodo = useCallback(
    (todo: Omit<TodoItem, "id" | "isCompleted" | "createdAt" | "isDeleted">) => {
      const overdue = isOverdue(todo.dueDate);
      const nextId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

      const newTodo: TodoItem = {
        ...todo,
        priority: overdue ? "high" : todo.priority,
        id: nextId,
        isCompleted: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      };
      setTodos((prev) => [newTodo, ...prev]);
      setIsAddOpen(false);
    },
    [todos]
  );

  // 既存Todoの更新（引数をTodoUpdateFieldsに絞る）
  const updateTodo = useCallback((id: number, updatedFields: TodoUpdateFields) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const merged = { ...todo, ...updatedFields };
          const overdue = isOverdue(merged.dueDate);
          return {
            ...merged,
            priority: overdue ? "high" : merged.priority,
          };
        }
        return todo;
      })
    );
    setEditingTodo(null);
  }, []);

  // Todoを完了にする
  const completeTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const overdue = isOverdue(todo.dueDate);
          return {
            ...todo,
            priority: overdue ? "high" : todo.priority,
            isCompleted: true,
          };
        }
        return todo;
      })
    );
  }, []);

  // 完了したTodoを未完了（Active）に差し戻す
  const restoreTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: false } : todo))
    );
  }, []);

  // Todoをゴミ箱行きにする（論理削除）
  const softDeleteTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isDeleted: true } : todo))
    );
  }, []);

  // ゴミ箱にあるタスクを未完了の状態に戻す（復元）
  const restoreFromTrash = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isDeleted: false, isCompleted: false } : todo))
    );
  }, []);

  // Todoを配列から完全に削除する（管理者専用の完全消去用）
  const hardDeleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // フィルター・期限切れによる優先度自動変更・ソートを適用した「表示用Todoリスト」を算出
  const displayedTodos = useMemo(() => {
    let filtered = todos.map((todo) => {
      if (!todo.isCompleted && isOverdue(todo.dueDate)) {
        return { ...todo, priority: "high" as Priority };
      }
      return todo;
    }).filter((todo) => {
      if (filterStatus === "deleted") {
        return todo.isDeleted;
      } else if (filterStatus === "completed") {
        return !todo.isDeleted && todo.isCompleted;
      } else {
        return !todo.isDeleted && !todo.isCompleted;
      }
    });

    // ソート処理の適用
    return [...filtered].sort((a, b) => {
      if (filterStatus === "active") {
        const aOverdue = isOverdue(a.dueDate);
        const bOverdue = isOverdue(b.dueDate);
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
      }

      // 優先度順ソート
      if (priorityOrder !== null) {
        const priorityRank: Record<Priority, number> = { high: 1, medium: 2, low: 3 };
        const comparison = priorityRank[a.priority] - priorityRank[b.priority];
        if (comparison !== 0) {
          return priorityOrder === "asc" ? comparison : -comparison;
        }
      }

      // 期限日順ソート
      if (dueDateOrder !== null) {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (comparison !== 0) {
          return dueDateOrder === "asc" ? comparison : -comparison;
        }
      }

      return 0;
    });
  }, [todos, filterStatus, priorityOrder, dueDateOrder]);

  return { displayedTodos, filterStatus, handleFilterChange, priorityOrder, dueDateOrder, handleSortPriority, handleSortDueDate, isAddOpen, setIsAddOpen, editingTodo, setEditingTodo, addTodo, updateTodo, completeTodo, restoreTodo, softDeleteTodo, restoreFromTrash, hardDeleteTodo };
};