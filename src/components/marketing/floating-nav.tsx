"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const [navSize, setNavSize] = useState(100);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (current) => {
    if (current <= 0) {
      setNavSize(100);
      setIsScrolled(false);
    } else if (current > 0 && current <= 40) {
      setNavSize(100 - (current / 40) * 20);
      setIsScrolled(true);
    } else {
      setNavSize(40);
      setIsScrolled(true);
    }
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <AnimatePresence mode="wait">
      <nav className="md:container fixed top-0 md:top-4 inset-x-0 z-50 mx-auto">
        <motion.div
          initial={{
            width: '100%',
            backgroundColor: 'hsla(var(--background) / 0)',
            backdropFilter: 'blur(0px)',
            borderColor: 'hsla(var(--border) / 0)',
            padding: 0
          }}
          animate={{
            width: `${navSize}%`,
            backgroundColor: `hsla(var(--background) / ${isScrolled ? 0.8 : 0})`,
            backdropFilter: isScrolled ? 'blur(8px)' : 'blur(0px)',
            borderColor: `hsla(var(--border) / ${isScrolled ? 0.1 : 0})`,
            padding: isScrolled ? '0.75rem 1rem' : '0'
          }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
            backgroundColor: { duration: 0.2 }, // Faster transition for background color
            backdropFilter: { duration: 0.2 }, // Faster transition for backdrop filter
          }}
          className={cn(
            "hidden md:flex relative justify-between items-center px-4 py-3 rounded-lg transition duration-200 mx-auto border",
            className
          )}
        >
          <div className="flex items-center space-x-2">
            <Image src="/echo.svg" alt="Echo" width={32} height={32} priority />
            <span className="text-lg font-bold">Echo</span>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block text-sm">{navItem.name}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button variant="default" asChild>
              <Link href="/login">
                Log in
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Mobile Nav */}
        <div className="md:hidden flex justify-between items-center px-8 py-3 bg-gray-100/50 backdrop-blur-sm border-b border-border/10">
          <div className="flex items-center space-x-2">
            <Image src="/echo.svg" alt="Echo" width={32} height={32} priority />
            <span className="text-lg font-bold">Echo</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button variant="default" asChild>
              <Link href="/login">
                Log in
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </AnimatePresence>
  );
};
