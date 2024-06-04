'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { cn } from 'shared'

export function ThemeSwitcher() {
  return (
    <section className="flex gap-2 bg-background p-1 rounded-md text-muted-foreground">
      <ThemeButton value="light"><Sun size={18} /></ThemeButton>
      <ThemeButton value="dark"><Moon size={18} /></ThemeButton>
      <ThemeButton value="system"><Monitor size={18} /></ThemeButton>
    </section>
  )
}

function ThemeButton({ className, value, ...props }: React.HtmlHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { theme, setTheme } = useTheme()
  const isActive = theme === value

  return (
    <button
      onClick={() => setTheme(value)}
      className={cn('p-1', isActive && 'text-accent-foreground bg-muted rounded-md', className)}
      {...props}
    />
  )
}