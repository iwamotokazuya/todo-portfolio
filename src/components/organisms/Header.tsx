import { Flex, Heading, Text, Button, HStack } from "@chakra-ui/react";
import { memo } from "react";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "@/hooks/useAuth";
import { useLoginUser } from "@/hooks/useLoginUser";

export const Header = memo(() => {
  const { logout } = useAuth();
  const { loginUser } = useLoginUser();

  return (
    <Flex as="header" align="center" justify="space-between" px={8} py={4}
    bg="white" borderBottom="1px solid" borderColor="teal.100">
      <Heading as="h1" fontSize="xl" fontWeight="700" color="gray.900">
        todo-portfolio
      </Heading>
      <HStack gap={6}>
        <Text fontSize="sm" color="gray.500">
          {loginUser?.name}
        </Text>
        <Button variant="ghost" color="gray.800" size="sm"
        onClick={logout} _hover={{ bg: "gray.100" }} >
          <LuLogOut />ログアウト
        </Button>
      </HStack>
    </Flex>
  );
});