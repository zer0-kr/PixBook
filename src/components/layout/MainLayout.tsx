"use client";

import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { ToastProvider } from "@/components/ui/PixelToast";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 md:ml-60 pb-16 md:pb-0 overflow-x-hidden">
          {children}
        </main>

        <MobileNav />
      </div>
    </ToastProvider>
  );
}
