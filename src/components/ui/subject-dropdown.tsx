"use client";

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SubjectDropdownOption<T extends string> = {
  value: T;
  label: string;
};

export function SubjectDropdown<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Select subject",
  searchPlaceholder = "Search subject...",
  className,
  menuClassName,
}: {
  value: T;
  options: readonly SubjectDropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  menuClassName?: string;
}) {
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...options];
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  function openMenu() {
    const selectedIndex = Math.max(
      0,
      filteredOptions.findIndex((option) => option.value === value),
    );
    setActiveIndex(selectedIndex);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onDocumentClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        closeMenu();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!open) return;

        if (event.key === "Escape" || event.key === "Tab") {
          closeMenu();
          return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) =>
          filteredOptions.length ? (prev + 1) % filteredOptions.length : 0,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          filteredOptions.length
            ? (prev - 1 + filteredOptions.length) % filteredOptions.length
            : 0,
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const active = filteredOptions[activeIndex];
        if (active) {
          onChange(active.value);
          closeMenu();
        }
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, filteredOptions, onChange, open]);

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (!open) openMenu();
    }
  }

  return (
    <div className="relative isolate overflow-visible">
      <button
        ref={triggerRef}
        type="button"
        id={`${listboxId}-trigger`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className={cn(
          "group flex h-11 w-full items-center justify-between rounded-2xl border border-cyan-400/25 bg-[#071028] px-3.5 text-left text-sm text-slate-100 backdrop-blur-xl transition duration-200 hover:border-cyan-300/55 hover:bg-[#0a1636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:shadow-[0_0_0_3px_rgba(34,211,238,0.14)]",
          className,
        )}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={cn("truncate", selected ? "text-slate-100" : "text-slate-400")}>
          {selected?.label ?? placeholder}
        </span>
        <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-500/15 text-cyan-100 transition group-hover:border-cyan-300/55">
          <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={`${listboxId}-trigger`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-0 top-full z-50 mt-2 w-full min-w-full overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#071028] shadow-2xl shadow-slate-950/70 ring-1 ring-cyan-400/10 backdrop-blur-xl",
              menuClassName,
            )}
          >
            <div className="border-b border-cyan-500/20 p-3">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-10 w-full rounded-xl border border-cyan-500/25 bg-[#020817] pl-9 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filteredOptions.length ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-left text-sm transition",
                        isSelected
                          ? "border-cyan-300/35 bg-cyan-400/20 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_18px_rgba(34,211,238,0.2)]"
                          : isActive
                            ? "bg-slate-800/95 text-slate-100"
                            : "text-slate-200 hover:bg-slate-800/85 hover:text-slate-50",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        onChange(option.value);
                        closeMenu();
                      }}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? <Check size={14} className="text-cyan-300" /> : null}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-3 text-sm text-slate-400">No matching subjects</div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

