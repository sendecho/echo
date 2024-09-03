"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { BarChart, List, LogOut, Settings, User } from 'lucide-react';


import { Home, Users, Send, Settings as SettingsIcon } from 'lucide-react';

const sidebarItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Broadcasts', href: '/dashboard/broadcasts', icon: Send },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Lists', href: '/dashboard/lists', icon: List },
  // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
];


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-1">
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
    </div>
  );
}