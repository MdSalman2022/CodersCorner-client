"use client";

import { useState } from "react";
import { MediumHeader } from "@/components/medium-header";
import { MediumSidebar } from "@/components/medium-sidebar";
import { MediumRightSidebar } from "@/components/medium-right-sidebar";
import { MediumFeed } from "@/components/medium-feed";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Home as HomeIcon, TrendingUp } from "lucide-react";

interface HomePageWrapperProps {
  children: React.ReactNode;
}

export function HomePageWrapper({ children }: HomePageWrapperProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Drawer - Contains both left and right sidebars */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Navigation
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 pb-6">
            {/* Left Sidebar Content */}
            <div className="mb-8">
              <MediumSidebar />
            </div>

            {/* Divider */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Discover
              </h3>
            </div>

            {/* Right Sidebar Content */}
            <MediumRightSidebar isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
            <div className="p-6">
              <MediumSidebar />
            </div>
          </div>

          {/* Main Feed - Full width on mobile, adjusted on desktop */}
          <div className="flex-1 lg:max-w-none xl:max-w-4xl">{children}</div>

          {/* Desktop Right Sidebar - Hidden on mobile */}
          <div className="hidden xl:block">
            <MediumRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
