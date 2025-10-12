import { MediumHeader } from "@/components/medium-header";
import { MediumSidebar } from "@/components/medium-sidebar";
import { MediumRightSidebar } from "@/components/medium-right-sidebar";
import { MediumFeed } from "@/components/medium-feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MediumHeader />
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <MediumSidebar />
          <MediumFeed />
          <MediumRightSidebar />
        </div>
      </div>
    </div>
  );
}
