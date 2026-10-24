import { Button as ChakraButton, type ButtonProps } from "@chakra-ui/react";
import { memo, type ReactNode } from "react";

type Props = ButtonProps & {
  children: ReactNode;
  colorPalette?: string;
  variant?: "solid" | "subtle" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
};

export const Button = memo((props: Props) => {
  const {
    children,
    colorPalette = "teal",
    variant = "solid",
    size = "md",
    loading = false,
    disabled = false,
    onClick,
    ...rest
  } = props;

  return (
    <ChakraButton
      colorPalette={colorPalette}
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      _hover={{ opacity: 0.8 }}
      _focus={{ boxShadow: "none", borderColor: "teal.500" }}
      _focusVisible={{ ring: 2, ringColor: "teal.500" }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
});