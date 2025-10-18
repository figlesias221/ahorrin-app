'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { modal, backdrop } from '@/lib/utils/animations';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
  section?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((command) => {
      const titleMatch = command.title.toLowerCase().includes(searchLower);
      const descMatch = command.description?.toLowerCase().includes(searchLower);
      const keywordMatch = command.keywords?.some((k) =>
        k.toLowerCase().includes(searchLower)
      );
      return titleMatch || descMatch || keywordMatch;
    });
  }, [commands, search]);

  // Group commands by section
  const groupedCommands = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    filteredCommands.forEach((command) => {
      const section = command.section || 'General';
      if (!groups.has(section)) {
        groups.set(section, []);
      }
      groups.get(section)!.push(command);
    });
    return Array.from(groups.entries());
  }, [filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }

      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                  aria-label="Search commands"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No commands found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groupedCommands.map(([section, sectionCommands], sectionIndex) => {
                      // Calculate the starting index for this section
                      let commandIndexOffset = 0;
                      for (let i = 0; i < sectionIndex; i++) {
                        commandIndexOffset += groupedCommands[i][1].length;
                      }

                      return (
                        <div key={section}>
                          <div className="px-2 py-1">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {section}
                            </h3>
                          </div>
                          <div className="space-y-1">
                            {sectionCommands.map((command, index) => {
                              const globalIndex = commandIndexOffset + index;
                              const isSelected = globalIndex === selectedIndex;

                              return (
                                <motion.button
                                  key={command.id}
                                  onClick={() => {
                                    command.action();
                                    onClose();
                                  }}
                                  whileHover={{ x: 4 }}
                                  className={cn(
                                    'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-muted text-foreground'
                                  )}
                                  role="option"
                                  aria-selected={isSelected}
                                >
                                  {command.icon && (
                                    <span className="flex-shrink-0" aria-hidden="true">
                                      {command.icon}
                                    </span>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {command.title}
                                    </p>
                                    {command.description && (
                                      <p
                                        className={cn(
                                          'text-xs truncate',
                                          isSelected
                                            ? 'text-primary-foreground/80'
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {command.description}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowRight
                                    className={cn(
                                      'h-4 w-4 flex-shrink-0',
                                      isSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-muted/50 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">↑</kbd>
                    <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="hidden sm:block">
                  Press <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">ESC</kbd> to close
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to use command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
