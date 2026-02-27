"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { ToastProvider } from "@/components/ui/PixelToast";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    ["/library", "/tower", "/characters", "/stats", "/profile", "/search"].forEach(
      (route) => router.prefetch(route)
    );
  }, [router]);

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
