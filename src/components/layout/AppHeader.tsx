
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar'; // To get the trigger for mobile
import { Calendar } from '@/components/ui/calendar';

export function AppHeader({ user }) {
  const { toggleSidebar, isMobile } = useSidebar();
  const [currentDate, setCurrentDate] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [reminderTasks, setReminderTasks] = useState([]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));
  }, []);

  // Load tasks for search and reminders
  useEffect(() => {
    if (showSearch || showReminders) {
      const saved = localStorage.getItem('taskBoardState');
      if (saved) {
        try {
          const boardColumns = JSON.parse(saved);
          const allTasks = boardColumns.flatMap(col => col.tasks);
          if (showReminders) {
            setReminderTasks(allTasks.filter(task => task.dueDate && task.dueDate !== 'Not set'));
          }
          if (showSearch) {
            setSearchResults(allTasks);
          }
        } catch {}
      }
    }
  }, [showSearch, showReminders]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const saved = localStorage.getItem('taskBoardState');
    if (saved) {
      try {
        const boardColumns = JSON.parse(saved);
        const allTasks = boardColumns.flatMap(col => col.tasks);
        setSearchResults(
          allTasks.filter(task =>
            (task.title && task.title.toLowerCase().includes(e.target.value.toLowerCase())) ||
            (task.subtitle && task.subtitle.toLowerCase().includes(e.target.value.toLowerCase()))
          )
        );
      } catch {}
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
        <h1 className="hidden text-xl font-semibold text-foreground md:block">
          Welcome back, {user?.nickname || 'User'} 👋
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setShowSearch(true)}>
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setShowReminders(true)}>
          <Bell className="h-5 w-5" />
        </Button>
        {currentDate && (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Button variant="ghost" size="icon" aria-label="Calendar" onClick={() => setShowCalendar(true)}>
              <CalendarDays className="h-5 w-5" />
            </Button>
            <span>{currentDate}</span>
          </div>
        )}
        <Avatar className="h-8 w-8">
          {user?.profilePic ? (
            <AvatarImage src={user.profilePic} alt="User avatar" data-ai-hint="user avatar" />
          ) : null}
          <AvatarFallback>{user?.nickname ? user.nickname[0].toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
      </div>
      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowSearch(false)}>
          <div className="bg-card rounded-xl shadow-2xl p-6 relative w-full max-w-md" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Search Tasks</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              placeholder="Search by title or subtitle..."
              autoFocus
            />
            {searchTerm && searchResults.length === 0 && (
              <div className="text-muted-foreground text-center">No tasks found.</div>
            )}
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {searchResults.map(task => (
                <li key={task.id} className="flex flex-col bg-muted/30 rounded p-3">
                  <span className="font-medium">{task.title}</span>
                  {task.subtitle && <span className="text-sm text-muted-foreground">{task.subtitle}</span>}
                  {task.dueDate && task.dueDate !== 'Not set' && (
                    <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Reminders Modal */}
      {showReminders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowReminders(false)}>
          <div className="bg-card rounded-xl shadow-2xl p-6 relative w-full max-w-md" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => setShowReminders(false)}
              aria-label="Close reminders"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Reminders</h2>
            {reminderTasks.length === 0 ? (
              <div className="text-muted-foreground text-center">No tasks with reminders.</div>
            ) : (
              <ul className="space-y-3">
                {reminderTasks.map(task => (
                  <li key={task.id} className="flex flex-col bg-muted/30 rounded p-3">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowCalendar(false)}>
          <div className="bg-card rounded-xl shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => setShowCalendar(false)}
              aria-label="Close calendar"
            >
              &times;
            </button>
            <Calendar />
          </div>
        </div>
      )}
    </header>
  );
}
