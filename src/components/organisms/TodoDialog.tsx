import { Box, HStack, Input, Stack, Text, Textarea, Dialog } from "@chakra-ui/react";
import { useState, useEffect, type ChangeEvent } from "react";
import type { Priority, TodoItem } from "../../types/todo";
import { Button } from "../atoms/Button";
import { DropdownMenu } from "../atoms/DropdownMenu";
import { BaseDialog } from "../organisms/BaseDialog";

// コンポーネントが受け取るプロパティの型定義
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: { title: string; content: string; dueDate: string; priority: Priority }, id?: number) => void;
  editingTodo?: TodoItem | null;
  isOverdue: (date: string) => boolean;
};

// 選択された値が有効な Priority か判定する
const isPriority = (value: string): value is Priority => {
  return value === "high" || value === "medium" || value === "low";
};

export const TodoDialog = ({ isOpen, onClose, onSave, editingTodo, isOverdue }: Props) => {
   // 編集対象が存在するかどうかで新規か編集かを判定
  const isEditMode = Boolean(editingTodo);

  // フォーム各項目の入力値の状態管理
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDateError, setDueDateError] = useState("");

  // ダイアログが開いたとき、または編集対象（editingTodo）が切り替わったときにフォームの値を初期化・同期する
  useEffect(() => {
    if (editingTodo) {
      // 編集の場合既存のTodoデータをフォームにセット
      setTitle(editingTodo.title);
      setContent(editingTodo.content);
      setDueDate(editingTodo.dueDate);
      setPriority(editingTodo.priority);
    } else {
      // 新規の場合フォームを空にリセット
      setTitle("");
      setContent("");
      setDueDate("");
      setPriority("medium");
    }
    setDueDateError("");
  }, [editingTodo, isOpen]);

   // 「登録する」または「変更を保存」ボタンが押されたときの処理
  const handleAction = () => {
    if (!title.trim()) return;

    // 新規作成時、または「編集時に日付が変更され、かつ過去の日付に設定された場合」にエラーにする
    const isDateChanged = editingTodo ? dueDate !== editingTodo.dueDate : true;
    if (isDateChanged && isOverdue(dueDate)) {
      setDueDateError("期限は本日以降の日付を指定してください");
      return;
    }

    // ダイアログが開くたびに前のエラー表示をクリア
    setDueDateError("");

     // 編集モードならIDを添えて保存、新規ならそのまま保存
    if (isEditMode && editingTodo) {
      onSave({ title, content, dueDate, priority }, editingTodo.id);
    } else {
      onSave({ title, content, dueDate, priority });
    }
    onClose();
  };

  // 重要度選択用のドロップダウンアイテムリスト
  const priorityItems = [
    { label: "高", value: "high" },
    { label: "中", value: "medium" },
    { label: "低", value: "low" },
  ];

  // 現在選択されている重要度のラベル表示
  const currentPriorityLabel =
    priority === "high" ? "高" : priority === "medium" ? "中" : "低";

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "TODOの編集" : "新規TODO作成"}
      maxW="lg"
    >
      <Dialog.Body my={4}>
        <Stack gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1} color="fg">
              タイトル <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1} color="fg">
              内容の詳細
            </Text>
            <Textarea
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              rows={3}
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1} color="fg">
              設定期限
            </Text>
            <Input
              type="date"
              value={dueDate}
              aria-invalid={Boolean(dueDateError)}
              aria-describedby={dueDateError ? "due-date-error" : undefined}
              _invalid={{ borderColor: "red.500", borderWidth: "2px" }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDueDate(e.target.value);
                if (dueDateError) setDueDateError("");
              }}
            />
            {dueDateError && (
              <Text id="due-date-error" fontSize="xs" color="red.500" mt={1}>
                {dueDateError}
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1} color="fg">
              重要度 <Text as="span" color="red.500">*</Text>
            </Text>
            <DropdownMenu
              triggerLabel={currentPriorityLabel}
              items={priorityItems}
              onSelect={(val) => {
                if (isPriority(val)) {
                  setPriority(val);
                }
              }}
            />
          </Box>
        </Stack>
      </Dialog.Body>

      <Dialog.Footer>
        <HStack gap={2} justify="flex-end" w="full">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
          <Button colorPalette="teal" onClick={handleAction} disabled={!title.trim()}>
            {isEditMode ? "変更を保存" : "登録する"}
          </Button>
        </HStack>
      </Dialog.Footer>
    </BaseDialog>
  );
};