import { Button } from "@chakra-ui/react";
import { memo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}
export const LoginButton = memo((props:Props) => {
  const {children, disabled=false, loading=false, onClick} = props;
  return (
    <Button colorPalette="teal" fontWeight="medium" w="full"
      _hover={{ opacity: 0.8 }} loading={loading} disabled={disabled}
      onClick={onClick}>
      {children}
    </Button>
  );
});