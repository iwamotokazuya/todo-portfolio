import { Box, Container, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import { memo, useState } from "react";
import { Header } from "../organisms/Header";
import { useTodos, isOverdue } from "../../hooks/useTodos";
import { useLoginUser } from "../../hooks/useLoginUser";
import { LuPlus } from "react-icons/lu";
import { Button } from "../atoms/Button";
import { DropdownMenu } from "../atoms/DropdownMenu";
import { TodoDialog } from "../organisms/TodoDialog";
import { TodoListTable } from "../organisms/TodoListTable";
import { TodoDeleteConfirmDialog } from "../organisms/TodoDeleteConfirmDialog";
import type { FilterStatus, Priority } from "../../types/todo";

// 選択された値が有効な FilterStatus か判定（"deleted" も許可）
const isFilterStatus = (value: string): value is FilterStatus => {
  return value === "active" || value === "completed" || value === "deleted";
};

export const Todo = memo(() => {
  // ログイン中のユーザー情報（管理者判定用）を取得
  const { loginUser } = useLoginUser();

  // Todoに関するすべての状態とロジックをカスタムフックから取得
  const { displayedTodos, filterStatus, handleFilterChange, priorityOrder, dueDateOrder, handleSortPriority, handleSortDueDate, isAddOpen, setIsAddOpen, editingTodo, setEditingTodo, addTodo, updateTodo, completeTodo, restoreTodo, softDeleteTodo, restoreFromTrash, hardDeleteTodo } = useTodos();

  // 「新規作成ダイアログが開いている」または「編集対象のTodoが存在する」場合にダイアログを開く
  const isDialogOpen = isAddOpen || editingTodo !== null;

  // ダイアログを閉じるときに新規・編集の状態を両方リセット
  const handleCloseDialog = () => {
    setIsAddOpen(false);
    setEditingTodo(null);
  };

  // Todoの保存処理（IDがあれば更新、なければ新規追加）
  const handleSaveTodo = (
    todoData: { title: string; content: string; dueDate: string; priority: Priority },
    id?: number
  ) => {
    if (id !== undefined) {
      updateTodo(id, todoData);
    } else {
      addTodo(todoData);
    }
  };

  // フィルター切り替え用の選択肢リスト（管理者の場合は「削除したタスク」も含める）
  const filterItems = [
    { label: "現在の残っているタスク", value: "active" },
    { label: "完了したタスク", value: "completed" },
    ...(loginUser?.isAdmin ? [{ label: "削除したタスク", value: "deleted" }] : []),
  ];

  // 現在のフィルター状態に応じた見出し文言
  const currentFilterLabel =
    filterStatus === "deleted"
      ? "削除したタスク"
      : filterStatus === "completed"
      ? "完了したタスク"
      : "現在の残っているタスク";

  // 削除確認ダイアログの管理用 State
  const [deleteTarget, setDeleteTarget] = useState<{ 
    id: number;
    type: "soft" | "hard";
  } | null>(null);

  return (
    <Box minH="100vh" bg="bg.subtle">
      <Header />

      <Container maxW="6xl" py={8}>
        <Stack gap={8}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="md" color="fg">{currentFilterLabel}</Heading>

            <HStack gap={3}>
              <DropdownMenu
                triggerLabel={currentFilterLabel}
                items={filterItems}
                onSelect={(val) => {
                  if (isFilterStatus(val)) {
                    handleFilterChange(val);
                  }
                }}
                width="auto"
                triggerSize="sm"
              />

              <Button
                colorPalette="teal"
                size="sm"
                onClick={() => setIsAddOpen(true)}
              >
                <LuPlus />
                新規登録
              </Button>
            </HStack>
          </Flex>

          <TodoListTable
            displayedTodos={displayedTodos}
            filterStatus={filterStatus}
            priorityOrder={priorityOrder}
            dueDateOrder={dueDateOrder}
            handleSortPriority={handleSortPriority}
            handleSortDueDate={handleSortDueDate}
            setEditingTodo={setEditingTodo}
            completeTodo={completeTodo}
            restoreTodo={restoreTodo}
            softDeleteTodo={(id) => setDeleteTarget({ id, type: "soft" })}
            restoreFromTrash={restoreFromTrash}
            hardDeleteTodo={(id) => setDeleteTarget({ id, type: "hard" })}
          />
        </Stack>
      </Container>

      {/* 新規・編集用ダイアログ */}
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
        isOverdue={isOverdue}
      />

      {/* 削除確認ダイアログ */}
      <TodoDeleteConfirmDialog
        deleteTarget={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(target) => {
          if (target.type === "hard") {
            hardDeleteTodo(target.id);
          } else {
            softDeleteTodo(target.id);
          }
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
});