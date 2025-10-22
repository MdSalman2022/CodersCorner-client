"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  PenTool,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface MediumHeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function MediumHeader({ onMobileMenuToggle }: MediumHeaderProps = {}) {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
  };

  const isAdmin = user?.roleName === "admin";

  const UserMenuItems = () => (
    <>
      <DropdownMenuItem asChild>
        <Link href={`/profile/${user?.id}`} className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>
      {/* <DropdownMenuItem asChild>
        <Link href="/settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </DropdownMenuItem> */}
      {isAdmin && (
        <DropdownMenuItem asChild>
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-600 focus:text-red-600"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 h-16 items-center">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onMobileMenuToggle) {
                  onMobileMenuToggle();
                }
              }}
              className="md:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              {/* <Image
                src={coderscornerLogo}
                alt="Coders Corner"
                width={120}
                height={40}
              /> */}
              <span className="font-bold text-xl hidden sm:block">
                Coders Corner
              </span>
            </Link>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="flex justify-center">
            <form
              onSubmit={handleSearch}
              className="hidden md:flex max-w-md w-full"
            >
              <div className="relative w-full">
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
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end space-x-2 md:space-x-4">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(true)}
              className="md:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link href="/write" prefetch={true}>
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </Link>
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>

            {user ? (
              <>
                {/* Desktop Dropdown */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>
                            {user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <UserMenuItems />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Drawer */}
                <div className="md:hidden">
                  <Sheet open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>
                            {user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image ?? undefined} />
                            <AvatarFallback>
                              {user.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          asChild
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Link href={`/profile/${user.id}`}>
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                        {/* <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          asChild
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Link href="/settings">
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                        </Button> */}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                            asChild
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Link href="/admin">
                              <Shield className="h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login" prefetch={true}>
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
