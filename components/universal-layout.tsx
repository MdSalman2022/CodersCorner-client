"use client";

import { MediumHeader } from "@/components/medium-header";
import { MediumSidebar } from "@/components/medium-sidebar";

interface UniversalLayoutProps {
  children: React.ReactNode;
}

export function UniversalLayout({ children }: UniversalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header - Universal across all pages */}
      <MediumHeader />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
