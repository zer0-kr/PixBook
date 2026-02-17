"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/search", label: "검색", icon: "🔍" },
  { href: "/stats", label: "통계", icon: "📊" },
  { href: "/library", label: "서재", icon: "📚" },
  { href: "/tower", label: "책 탑", icon: "🏗️" },
  { href: "/characters", label: "캐릭터", icon: "👾" },
  { href: "/profile", label: "프로필", icon: "👤" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t-3 border-brown bg-cream-dark">
      <ul className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 text-center ${
                  isActive
                    ? "text-pixel-blue"
                    : "text-brown-lighter hover:text-brown"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
