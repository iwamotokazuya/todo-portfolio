import { Box, Container, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {
  // 入力されたユーザー名とパスワードの状態管理
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // 認証ロジック（login関数、通信中フラグloading）の取得
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // バリデーション: ユーザー名が空（またはスペースのみ）、またはパスワードが8文字未満ならボタンを無効化
  const isButtonDisabled = userName.trim() === "" || password.length < 8;

  const onClickLogin = () => {
    // ボタンが無効な状態、またはすでにローディング中であれば何もしない
    if (isButtonDisabled || loading) return;

    // 認証フックを呼び出し、ユーザー名とパスワードの結果を受け取る
    const success = login(userName.trim(), password);
    // 認証に失敗した場合は中断
    if (!success) return;

    // 認証成功時のみ、ローカルストレージにログイン状態を保存し、Todo画面へ強制置換で遷移
    localStorage.setItem("isLoggedIn", "true");
    navigate("/todo", { replace: true });
  };

  return (
    <Box minH="100vh" bg="bg.subtle" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md" bg="bg.panel" p={8} rounded="lg" shadow="md" border="1px solid" borderColor="border.subtle">
        <Stack gap={6}>
          <Heading size="lg" textAlign="center" color="fg">
            ログイン
          </Heading>

          <Stack gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1} color="fg">
                ユーザー名
              </Text>
              <Input
                value={userName}
                placeholder="ユーザー名を入力"
                _focus={{ borderColor: "teal.500", boxShadow: "none" }}
                _focusVisible={{ ring: 2, ringColor: "teal.500" }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1} color="fg">
                パスワード (8文字以上)
              </Text>
              <Input
                type="password"
                value={password}
                placeholder="パスワードを入力"
                _focus={{ borderColor: "teal.500", boxShadow: "none" }}
                _focusVisible={{ ring: 2, ringColor: "teal.500" }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </Box>
          </Stack>

          <Button
            colorPalette="teal"
            w="full"
            disabled={isButtonDisabled || loading}
            loading={loading}
            onClick={onClickLogin}
          >
            ログイン
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};