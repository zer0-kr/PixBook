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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-full w-60 flex-col border-r-3 border-brown bg-cream-dark">
      {/* Logo */}
      <div className="border-b-3 border-brown p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">📚</span>
          <div>
            <h1 className="font-pixel text-sm text-brown">픽북</h1>
            <p className="mt-0.5 text-[10px] text-brown-light tracking-wide">나만의 독서 타워</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-colors ${
                    isActive
                      ? "pixel-border bg-pixel-blue text-white"
                      : "text-brown hover:bg-cream"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t-3 border-brown p-3 text-center text-xs text-brown-lighter">
        v0.1.0
      </div>
    </aside>
  );
}
