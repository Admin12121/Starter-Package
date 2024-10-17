"use client"
import "./style.navigation.scss";
import Link from "next/link";
import { motion } from "framer-motion";
import { ModeToggle } from "../toogle-mode";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/app/logo.png"

const Navbar = ({
  isLoading = false,
  position = false,
}: {
  isLoading?: boolean;
  position?: boolean;
  showHome?: string | null;
}) => {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleMouseMove = (e: any) => {
    const navElements = document.getElementsByClassName("nav");
    for (let i = 0; i < navElements.length; i++) {
      const card = navElements[i];
      const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <>
      <motion.div
        className="Nav_wrapper"
        style={{ position: position ? "absolute" : "fixed" }}
      >
        <div className="nav" onMouseMove={handleMouseMove}>
          <motion.div
            initial={{ height: 54 }}
            animate={{ height: toggle ? "24rem" : 54 }}
            transition={{ duration: 0.3 }}
            className="nav_wrap flex"
          >
            <span className="nav_wrap flex justify-between items-center h-[52px]">
              <span className="flex gap-2 items-center justify-center cursor-pointer">
                <Skeleton className="h-11 w-11 rounded-md" disable={!isLoading}>
                  <div className="logo">
                    <Link href="/">
                      <span>
                        <Image
                          src={Logo}
                          alt="logo"
                        />
                      </span>
                    </Link>
                  </div>
                </Skeleton>
                <Skeleton className="h-11 w-48 rounded-md" disable={!isLoading}>
                  <h1 className="text-2xl font-semibold">
                    Next auth
                  </h1>
                </Skeleton>
              </span>
              <span className="hidden md:flex gap-2 items-center justify-center">
                <ModeToggle />
                <Button asChild className="h-11 px-5 rounded-[8px]">
                  <Link href="/auth/sign-in">Login</Link>
                </Button>
              </span>
              <span className="flex md:hidden">
                <Button
                  className="h-11 w-11 p-0 rounded-[8px]"
                  onClick={() => setToggle((prev) => !prev)}
                >
                  <Menu className="w-7 h-7" />
                </Button>
              </span>
            </span>
            <span className="bg-[#202224] w-full h-[calc(100%-56px)] top-14 flex justify-between items-center relative rounded-md"></span>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;