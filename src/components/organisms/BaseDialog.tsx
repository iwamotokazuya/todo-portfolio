import { Dialog, IconButton, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { LuX } from "react-icons/lu";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  maxW?: string;
  children: ReactNode;
};

export const BaseDialog = ({ isOpen, onClose, title, maxW = "lg", children }: Props) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg.panel" p={6} rounded="lg" shadow="xl" maxW={maxW} w="full">
            <Dialog.Header>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                {title}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <IconButton aria-label="閉じる" size="sm" variant="ghost" pos="absolute" top={4} right={4} onClick={onClose}>
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};