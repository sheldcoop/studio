
"use client"

import * as React from "react"
import { Moon, Sun, Palette, Book, Bot } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'slate', 'nocturne', 'quant'];
    const currentIndex = themes.indexOf(theme || 'light');
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 [.slate_&]:-rotate-90 [.slate_&]:scale-0 [.nocturne_&]:-rotate-90 [.nocturne_&]:scale-0 [.quant_&]:-rotate-90 [.quant_&]:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 [.slate_&]:-rotate-90 [.slate_&]:scale-0 [.nocturne_&]:-rotate-90 [.nocturne_&]:scale-0 [.quant_&]:-rotate-90 [.quant_&]:scale-0" />
      <Palette className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all [.slate_&]:rotate-0 [.slate_&]:scale-100 [.nocturne_&]:-rotate-90 [.nocturne_&]:scale-0 [.quant_&]:-rotate-90 [.quant_&]:scale-0" />
      <Book className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all [.nocturne_&]:rotate-0 [.nocturne_&]:scale-100 [.quant_&]:-rotate-90 [.quant_&]:scale-0" />
      <Bot className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all [.quant_&]:rotate-0 [.quant_&]:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
