import { Menu, Portal } from "@chakra-ui/react";
import { memo, type ReactNode } from "react";
import { LuChevronDown } from "react-icons/lu";
import { Button } from "./Button";

export type DropdownItem = {
  label: string;
  value: string;
};

type Props = {
  triggerLabel: ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  width?: string;
  triggerVariant?: "solid" | "subtle" | "outline" | "ghost";
  triggerSize?: "xs" | "sm" | "md" | "lg";
};

export const DropdownMenu = memo((props: Props) => {
  const {
    triggerLabel,
    items,
    onSelect,
    width = "full",
    triggerVariant = "outline",
    triggerSize = "md",
  } = props;

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          w={width}
          justifyContent="space-between"
          fontWeight="normal"
        >
          {triggerLabel}
          <LuChevronDown />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="bg.panel"
            shadow="md"
            p={1}
            rounded="md"
            border="1px solid"
            borderColor="border.subtle"
            w="var(--reference-width)"
          >
            {items.map((item) => (
              <Menu.Item
                key={item.value}
                value={item.value}
                onClick={() => onSelect(item.value)}
                cursor="pointer"
                p={2}
                _hover={{ bg: "bg.subtle" }}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
});