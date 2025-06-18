
"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? theme : resolvedTheme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className={cn(
        "flex items-center justify-between space-x-2 p-2 h-10 w-full rounded-md bg-sidebar-accent/10 animate-pulse",
        "group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0"
      )}>
        <div className="flex items-center space-x-2 group-data-[collapsible=icon]:hidden">
          <div className="w-5 h-5 bg-sidebar-muted-foreground/30 rounded-full"></div>
          <div className="w-12 h-4 bg-sidebar-muted-foreground/30 rounded"></div>
        </div>
        <div className="w-9 h-5 bg-sidebar-muted-foreground/30 rounded-full group-data-[collapsible=icon]:hidden"></div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-6 h-6 bg-sidebar-muted-foreground/30 rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className={cn(
        "flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hover:bg-transparent"
      )}
    >
      <div className="flex items-center space-x-2 group-data-[collapsible=icon]:hidden">
        {currentTheme === 'light' ? <Sun className="h-5 w-5 text-sidebar-foreground" /> : <Moon className="h-5 w-5 text-sidebar-foreground" />}
        <Label htmlFor="theme-switch" className="text-sm text-sidebar-foreground cursor-pointer">
          {currentTheme === "light" ? "Light" : "Dark"}
        </Label>
      </div>
      <Switch
        id="theme-switch"
        checked={currentTheme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="group-data-[collapsible=icon]:hidden data-[state=checked]:bg-primary data-[state=unchecked]:bg-sidebar-muted-foreground/50"
      />
      <button 
        onClick={toggleTheme} 
        aria-label="Toggle theme"
        className="hidden group-data-[collapsible=icon]:flex items-center justify-center h-10 w-10 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
      >
        {currentTheme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
    </div>
  );
}
