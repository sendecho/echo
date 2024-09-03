"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SecondaryMenu({ items }) {
  const pathname = usePathname();

  return (
    <nav className="py-4 w-64">
      <ul className="flex space-x-6 text-sm overflow-auto scrollbar-hide">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              prefetch
              href={item.path}
              className={cn(
                "text-[#606060]",
                pathname === item.path &&
                "text-primary font-medium underline underline-offset-8"
              )}
            >
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}