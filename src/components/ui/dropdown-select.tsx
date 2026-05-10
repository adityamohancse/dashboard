"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option<T extends string> = {
  value: T;
  label: string;
};

export function DropdownSelect<T extends string>({
  value,
  options,
  onChange,
  className,
  menuClassName,
}: {
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  className?: string;
  menuClassName?: string;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 180, placement: "bottom" as "bottom" | "top" });

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  function updatePosition() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 152;
    const gap = 6;
    const placeTop = window.innerHeight - rect.bottom < menuHeight + gap;
    setPosition({
      top: placeTop ? rect.top - gap : rect.bottom + gap,
      left: rect.left,
      width: Math.max(rect.width, 148),
      placement: placeTop ? "top" : "bottom",
    });
  }

  useEffect(() => {
    if (!open) return;
    updatePosition();

    function onDocumentClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape" || event.key === "Tab") {
        setOpen(false);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const selectedOption = options[activeIndex];
        if (selectedOption) {
          onChange(selectedOption.value);
          setOpen(false);
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
  }, [activeIndex, onChange, open, options]);

  function openMenu() {
    const index = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    setActiveIndex(index);
    setOpen(true);
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (!open) openMenu();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-700 outline-none ring-sky-200 transition hover:bg-white/90 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900",
          className,
        )}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-slate-500 transition-transform dark:text-slate-300",
            open && "rotate-180",
          )}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            className={cn(
              "fixed z-[120] max-h-44 overflow-auto rounded-xl border border-white/60 bg-white/90 p-1 shadow-2xl shadow-slate-300/40 backdrop-blur-xl transition-all duration-150 dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-slate-950/50",
              position.placement === "bottom" ? "origin-top" : "origin-bottom",
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
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                    isActive
                      ? "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-100"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {isSelected ? <Check size={14} /> : null}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

