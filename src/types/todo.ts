// Todoの優先度を表す型
export type Priority = "high" | "medium" | "low";

export type TodoItem = {
  id: number; // 一意の識別子（ID）
  title: string; // Todoのタイトル
  content: string; // Todoの詳細内容・メモ
  dueDate: string; // 期限日（"YYYY-MM-DD" 形式の文字列）
  priority: Priority; // 優先度
  isCompleted: boolean; // 完了フラグ（true: 完了済み, false: 未完了）
  isDeleted?: boolean; // 削除済みかどうか（trueならゴミ箱行き）
  createdAt: string; // 作成日時（ISO文字列）
};

// 編集時に変更可能なフィールドを安全に絞る型
export type TodoUpdateFields = Pick<
  TodoItem,
  "title" | "content" | "dueDate" | "priority"
>;
// 一覧画面で表示するタスクのステータス
export type FilterStatus = "active" | "completed" | "deleted";
// テーブルのソート順（asc: 昇順, desc: 降順）
export type SortOrder = "asc" | "desc";