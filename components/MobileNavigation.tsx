"use client";

import { useRef } from "react";

interface NavigationItem {
  href: string;
  label: string;
}

interface MobileNavigationProps {
  items: NavigationItem[];
}

export default function MobileNavigation({ items }: MobileNavigationProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={menuRef} className="relative md:hidden">
      <summary className="cursor-pointer list-none rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-volt hover:text-white focus:outline-none focus:ring-2 focus:ring-volt">
        Menú
      </summary>
      <nav
        aria-label="Navegación principal móvil"
        className="absolute right-0 top-12 flex min-w-52 flex-col gap-1 border border-white/10 bg-abyss p-2 shadow-xl shadow-black/30"
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => {
              if (menuRef.current) {
                menuRef.current.open = false;
              }
            }}
            className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-volt"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
