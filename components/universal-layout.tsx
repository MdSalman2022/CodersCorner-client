"use client";

import { useState } from "react";
import { MediumHeader } from "@/components/medium-header";
import { MediumSidebar } from "@/components/medium-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Home as HomeIcon } from "lucide-react";

interface UniversalLayoutProps {
  children: React.ReactNode;
}

export function UniversalLayout({ children }: UniversalLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header - Universal across all pages */}
      <MediumHeader
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={mobileMenuOpen}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 overflow-y-auto">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Navigation
            </SheetTitle>
          </SheetHeader>
          <div className="px-6 pb-6">
            <MediumSidebar
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
