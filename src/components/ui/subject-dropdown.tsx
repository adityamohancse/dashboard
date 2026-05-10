"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debug flag: toggle to show red outline and console logs when troubleshooting menu placement
  const DEBUG_MENU = true;
  const debugClass = DEBUG_MENU ? "ring-2 ring-red-500/50" : "";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 220,
    placement: "bottom" as "bottom" | "top",
  });

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...options];
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  function updatePosition() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 280;
    const gap = 8;
    const placeTop = window.innerHeight - rect.bottom < menuHeight + gap;
    let top = placeTop ? rect.top - gap : rect.bottom + gap;
    let left = rect.left;
    const width = Math.max(rect.width, 220);

    // Clamp to viewport so the menu doesn't render off-screen (fixes clipping in transformed parents)
    const maxLeft = Math.max(8, window.innerWidth - width - 8);
    left = Math.min(Math.max(8, left), maxLeft);
    const maxTop = Math.max(8, window.innerHeight - menuHeight - 8);
    top = Math.min(Math.max(8, top), maxTop);

    setPosition({
      top,
      left,
      width,
      placement: placeTop ? "top" : "bottom",
    });
  }

  function openMenu() {
    // compute position synchronously so the portal menu can be positioned immediately
    try {
      updatePosition();
      if (DEBUG_MENU) console.debug('SubjectDropdown.openMenu computed position', { position });
    } catch (e) {
      if (DEBUG_MENU) console.error('SubjectDropdown.openMenu updatePosition failed', e);
    }
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
    updatePosition();
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

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, filteredOptions, onChange, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "relative z-20 group flex h-11 w-full items-center justify-between rounded-2xl border border-cyan-300/20 bg-slate-950/55 px-3.5 text-left text-sm text-slate-100 backdrop-blur-xl transition duration-200 hover:border-cyan-300/45 hover:bg-slate-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:shadow-[0_0_0_3px_rgba(34,211,238,0.14)]",
          className,
        )}
        onClick={() => (open ? closeMenu() : openMenu())}
      >
        <span className={cn("truncate", selected ? "text-slate-100" : "text-slate-400")}>
          {selected?.label ?? placeholder}
        </span>
        <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10 text-cyan-200 transition group-hover:border-cyan-300/45">
          <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
        </span>
      </button>

      <AnimatePresence>
        {open
          ? (() => {
              const menuElement = (
                <motion.div
                  ref={menuRef}
                  role="listbox"
                  initial={{ opacity: 0, y: position.placement === "bottom" ? -6 : 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: position.placement === "bottom" ? -6 : 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className={cn(
                    "fixed z-[9999] pointer-events-auto overflow-visible rounded-2xl border border-cyan-300/20 bg-slate-950/88 shadow-[0_18px_40px_rgba(2,6,23,0.65)] backdrop-blur-2xl",
                    debugClass,
                    menuClassName,
                  )}
                  style={{
                    top: position.placement === "bottom" ? position.top : undefined,
                    bottom:
                      position.placement === "top"
                        ? window.innerHeight - position.top
                        : undefined,
                    left: position.left,
                    width: position.width,
                  }}
                >
                  <div className="border-b border-white/10 p-2.5">
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
                        className="h-10 w-full rounded-xl border border-cyan-300/20 bg-slate-900/65 pl-9 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/35"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1.5">
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
                              "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                              isSelected
                                ? "bg-cyan-400/15 text-cyan-100"
                                : isActive
                                  ? "bg-slate-800/85 text-slate-100"
                                  : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100",
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
              );

              try {
                return createPortal(menuElement, document.body);
              } catch (e) {
                // Inline fallback (absolute inside nearest positioned ancestor)
                const inlineStyle = (() => {
                  if (!triggerRef.current) return { display: "none" };
                  const rect = triggerRef.current.getBoundingClientRect();
                  const offsetParent = (triggerRef.current.offsetParent as HTMLElement) || document.body;
                  const parentRect = offsetParent.getBoundingClientRect();
                  const gap = 8;
                  const top = position.placement === "bottom" ? rect.bottom - parentRect.top + gap : rect.top - parentRect.top - gap;
                  const maxLeft = Math.max(8, (offsetParent.clientWidth || window.innerWidth) - position.width - 8);
                  const left = Math.min(Math.max(8, rect.left - parentRect.left), maxLeft);
                  return { position: "absolute", top, left, width: position.width };
                })();

                return (
                  <motion.div
                    ref={menuRef}
                    role="listbox"
                    initial={{ opacity: 0, y: position.placement === "bottom" ? -6 : 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: position.placement === "bottom" ? -6 : 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className={cn(
                      "absolute z-[9999] pointer-events-auto overflow-visible rounded-2xl border border-cyan-300/20 bg-slate-950/88 shadow-[0_18px_40px_rgba(2,6,23,0.65)] backdrop-blur-2xl",
                      menuClassName,
                    )}
                    style={inlineStyle}
                  >
                    <div className="border-b border-white/10 p-2.5">
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
                          className="h-10 w-full rounded-xl border border-cyan-300/20 bg-slate-900/65 pl-9 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/35"
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1.5">
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
                                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                                isSelected
                                  ? "bg-cyan-400/15 text-cyan-100"
                                  : isActive
                                    ? "bg-slate-800/85 text-slate-100"
                                    : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100",
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
                );
              }
            })()
          : null}
      </AnimatePresence>
    </>
  );
}

