"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  PenTool,
  Bell,
  User,
  Home,
  BookOpen,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function MediumHeader() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                CC
              </span>
            </div>
            <span className="font-bold text-xl">Coders Corner</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/write">
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </Link>
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            {user ? (
              <Link href={`/profile/${user.id}`}>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
