import { Box, Flex, Heading, Input, Separator, Stack, Text } from "@chakra-ui/react";
import { memo, useState, type ChangeEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoginButton } from "../atoms/LoginButton";

export const Login = memo(() => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const {login, loading} = useAuth();

  const onChangeUser = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const isPasswordTooShort = password.length > 0 && password.length < 8;
  const isButtonDisabled = userName === "" || password.length < 8;

  const onClickLogin = () => login(userName, password)
    return( 
      <Flex align="center" justify="center" minH="100vh" bg="gray.50">
        <Box bg="bg.panel" w="full" maxW="400px" p={8} rounded="2xl"
          border="1px solid" borderColor="gray.200" shadow="sm">
          <Heading as="h1" fontSize="2xl" fontWeight="700"
            textAlign="center" color="fg" mb={6}>
            todo-portfolio
          </Heading>
          <Separator mb={6} borderColor="gray.200" />
          <Stack gap={4}>
          <Input placeholder="ユーザネーム" value={userName}
          onChange={onChangeUser} size="md" />
          <Stack gap={1}>
            {isPasswordTooShort && (
            <Text fontSize="xs" color="fg.error">
              パスワード8文字以上で記入してください
            </Text>
          )}
            <Input  placeholder="パスワード" type="password"
              value={password} onChange={onChangePassword}
              size="md" />
          </Stack>
          <LoginButton loading={loading} onClick={onClickLogin}
              disabled={userName === "" && password === "" &&isButtonDisabled}>
            ログイン
          </LoginButton>
        </Stack>
      </Box>
    </Flex>
    );
})