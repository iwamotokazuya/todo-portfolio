import { Text, HStack, Dialog } from "@chakra-ui/react";
import { Button } from "../atoms/Button";
import { BaseDialog } from "../organisms/BaseDialog";

type DeleteTarget = {
  id: number;
  type: "soft" | "hard";
};

type Props = {
  deleteTarget: DeleteTarget | null;
  onClose: () => void;
  onConfirm: (target: DeleteTarget) => void;
};

export const TodoDeleteConfirmDialog = ({ deleteTarget, onClose, onConfirm }: Props) => {
  const isHard = deleteTarget?.type === "hard";

  return (
    <BaseDialog isOpen={deleteTarget !== null} onClose={onClose} title={isHard ? "完全消去の確認" : "削除の確認"} maxW="md">
      <Dialog.Body my={4}>
        <Text color="fg">
          {isHard
            ? "削除すると戻せませんがよいですか？"
            : "本当にこのタスクを削除しますか？"}
        </Text>
      </Dialog.Body>

      <Dialog.Footer>
        <HStack gap={2} justify="flex-end" w="full">
          <Button variant="outline" onClick={onClose}>
            戻る
          </Button>
          <Button
            colorPalette="red"
            onClick={() => {
              if (deleteTarget) {
                onConfirm(deleteTarget);
              }
            }}
          >
            {isHard ? "完全消去" : "削除"}
          </Button>
        </HStack>
      </Dialog.Footer>
    </BaseDialog>
  );
};