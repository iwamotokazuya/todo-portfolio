import { type FC, useState, type ChangeEvent } from "react";
import { Button, Input, VStack, Dialog, Field } from "@chakra-ui/react";
import { BaseDialog } from "../organisms//BaseDialog";
import { useCreateUser } from "../../hooks/useCreateUser";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateUserDialog: FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { createUser, loading } = useCreateUser();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleCreateUser = async () => {
    if (!name || !password) return;

    const success = await createUser(name, password);
    if (success) {
      setName("");
      setPassword("");
      onClose();
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title="新規ユーザー登録" maxW="md">
      <Dialog.Body pb={4}>
        <VStack gap={4} align="stretch">
          <Field.Root>
            <Field.Label>ユーザー名</Field.Label>
            <Input
              placeholder="ユーザー名を入力"
              value={name}
              onChange={handleNameChange}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>パスワード</Field.Label>
            <Input
              type="password"
              placeholder="パスワードを入力(8文字以上)"
              value={password}
              onChange={handlePasswordChange}
            />
          </Field.Root>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer display="flex" justifyContent="flex-end" gap={3} pt={4}>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          キャンセル
        </Button>
        <Button
          colorScheme="teal"
          onClick={handleCreateUser}
          loading={loading}
          disabled={!name || !password}
        >
          登録
        </Button>
      </Dialog.Footer>
    </BaseDialog>
  );
};