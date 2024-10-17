"use client";

import Particles from "@/components/global/particles";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface LayoutProviderProps {
    children: ReactNode;
  }

const LayoutProvider = ({children}:LayoutProviderProps) => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <>
      {children}
      <Particles
        className="absolute inset-0 -z-[1]"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </>
  );
};

export default LayoutProvider;
