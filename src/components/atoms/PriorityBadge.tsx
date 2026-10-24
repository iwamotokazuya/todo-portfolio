import { Text } from "@chakra-ui/react";
import type { Priority } from "../../types/todo";

type Props = {
  priority: Priority;
};

export const PriorityBadge = ({ priority }: Props) => {
  const configMap: Record<Priority, { label: string; bg: string; color: string }> = {
    high: { label: "高", bg: "red.50", color: "red.600" },
    medium: { label: "中", bg: "orange.50", color: "orange.600" },
    low: { label: "低", bg: "blue.50", color: "blue.600" },
  };
  const c = configMap[priority] || configMap.medium;

  return (
    <Text
      as="span"
      fontSize="xs"
      fontWeight="bold"
      px={2.5}
      py={0.5}
      bg={c.bg}
      color={c.color}
      rounded="full"
      display="inline-block"
      textAlign="center"
    >
      {c.label}
    </Text>
  );
};