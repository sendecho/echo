"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarChart, List, LogOut, Settings, User } from 'lucide-react';
import Image from 'next/image';

import { createClient } from '@/lib/supabase/client';

import { Home, Users, Send, Settings as SettingsIcon } from 'lucide-react';

const sidebarItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Broadcasts', href: '/dashboard/broadcasts', icon: Send },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Lists', href: '/dashboard/lists', icon: List },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
];

interface UserMenuProps {
  userImage?: string;
  userName: string;
}

const supabase = createClient();

function UserMenu({ userImage, userName }: UserMenuProps) {

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/account">
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={async () => {
          const { error } = await supabase.auth.signOut();
          if (!error) {
            router.push('/login');
          }
        }}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-background border-r">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="ml-2 font-semibold text-lg">Circles</span>
        </div>
        <UserMenu userName="User" />
      </div>
      <ScrollArea className="h-[calc(100vh-64px)] py-6">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.href === '/dashboard' ? (pathname === item.href ? 'secondary' : 'ghost') : (pathname.startsWith(item.href) ? 'secondary' : 'ghost')}
                  className={cn(
                    'w-full justify-start',
                    item.href === '/dashboard' ? (pathname === item.href && 'bg-muted') : (pathname.startsWith(item.href) && 'bg-muted')
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}