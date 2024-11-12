import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export const Provider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
};
