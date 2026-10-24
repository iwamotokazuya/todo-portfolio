import { Card, HStack, Stack, Table, Text } from "@chakra-ui/react";
import { memo } from "react";
import type { FilterStatus, SortOrder, TodoItem } from "../../types/todo";
import { formatDateToSlash, isOverdue } from "../../hooks/useTodos";
import { Button } from "../atoms/Button";
import { PriorityBadge } from "../atoms/PriorityBadge";

type Props = {
  displayedTodos: TodoItem[]; // 表示対象のTodoリスト
  filterStatus: FilterStatus; // 現在のフィルター状態（active / completed / deleted）
  priorityOrder: SortOrder | null; // 優先度のソート順（asc / desc / null）
  dueDateOrder: SortOrder | null; // 期限日のソート順（asc / desc / null）
  handleSortPriority: () => void; // 優先度ソートを切り替えるハンドラー
  handleSortDueDate: () => void; // 期限日ソートを切り替えるハンドラー
  setEditingTodo: (todo: TodoItem) => void; // 編集対象のTodoをセットする関数
  completeTodo: (id: number) => void; // Todoを完了にする関数
  restoreTodo: (id: number) => void; // 完了済みTodoを未完了に戻す関数
  softDeleteTodo: (id: number) => void; // Todoをゴミ箱行き（論理削除）にする関数
  restoreFromTrash: (id: number) => void; // ゴミ箱から未完了へ復元する関数
  hardDeleteTodo: (id: number) => void; // Todoを完全に削除する関数（管理者用）
};

// Todoの一覧をテーブル形式で表示
export const TodoListTable = memo((props: Props) => {
  const {
    displayedTodos,
    filterStatus,
    priorityOrder,
    dueDateOrder,
    handleSortPriority,
    handleSortDueDate,
    setEditingTodo,
    completeTodo,
    restoreTodo,
    softDeleteTodo,
    restoreFromTrash,
    hardDeleteTodo,
  } = props;

  return (
    <Card.Root bg="bg.panel" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
      <Table.Root interactive size="lg">
        <Table.Header bg="bg.subtle">
          <Table.Row>
            <Table.ColumnHeader>タイトル / 内容</Table.ColumnHeader>
            <Table.ColumnHeader
              cursor="pointer"
              onClick={handleSortPriority}
              textAlign="center"
              w="140px"
            >
              優先度 {priorityOrder && (priorityOrder === "asc" ? "▲" : "▼")}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              cursor="pointer"
              onClick={handleSortDueDate}
              w="160px"
            >
              期限 {dueDateOrder && (dueDateOrder === "asc" ? "▲" : "▼")}
            </Table.ColumnHeader>
            <Table.ColumnHeader w="180px" textAlign="right" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {displayedTodos.map((todo) => {
            const overdue = !todo.isCompleted && isOverdue(todo.dueDate);
            return (
              <Table.Row key={todo.id} opacity={todo.isCompleted ? 0.6 : 1}>
                <Table.Cell maxW="400px">
                  <Stack gap={0.5}>
                    <Text
                      fontWeight="bold"
                      color={overdue ? "red.500" : "fg"}
                      lineClamp={1}
                    >
                      {todo.title}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={overdue ? "red.400" : "fg.muted"}
                      lineClamp={1}
                    >
                      {todo.content || "（内容なし）"}
                    </Text>
                  </Stack>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <PriorityBadge priority={todo.priority} />
                </Table.Cell>

                <Table.Cell fontSize="sm">
                  <Text
                    as="span"
                    color={overdue ? "red.500" : "fg.muted"}
                    fontWeight={overdue ? "bold" : "normal"}
                  >
                    {formatDateToSlash(todo.dueDate)}
                    {overdue && " (期限切れ)"}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="right">
                  {filterStatus === "deleted" ? (
                    // 削除済み
                    <HStack gap={2} justify="flex-end">
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="blue"
                        onClick={() => restoreFromTrash(todo.id)}
                      >
                        復元する
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="red"
                        onClick={() => hardDeleteTodo(todo.id)}
                      >
                        完全消去
                      </Button>
                    </HStack>
                  ) : todo.isCompleted ? (
                    // 完了済みタブ
                    <HStack gap={2} justify="flex-end">
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="green"
                        onClick={() => restoreTodo(todo.id)}
                      >
                        未完了に戻す
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="red"
                        onClick={() => softDeleteTodo(todo.id)}
                      >
                        削除
                      </Button>
                    </HStack>
                  ) : (
                    // 未完了タブ
                    <HStack gap={2} justify="flex-end">
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="blue"
                        onClick={() => setEditingTodo(todo)}
                      >
                        編集
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="green"
                        onClick={() => completeTodo(todo.id)}
                      >
                        完了
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="red"
                        onClick={() => softDeleteTodo(todo.id)}
                      >
                        削除
                      </Button>
                    </HStack>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      {displayedTodos.length === 0 && (
        <Text textAlign="center" color="fg.muted" py={8}>
          {filterStatus === "deleted"
            ? "削除したタスクはありません"
            : filterStatus === "completed"
            ? "完了したタスクはありません"
            : "残っているタスクはありません"}
        </Text>
      )}
    </Card.Root>
  );
});