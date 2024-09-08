import React, { Suspense } from 'react';
import Image from 'next/image';
import { UserMenu } from './user-menu';
import { SidebarNav } from './sidebar-nav';
import { CircleHelpIcon } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Sidebar() {

  return (
    <div className="w-64 h-full flex flex-col bg-background border-r border-border">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="ml-2 font-semibold text-lg">Echo</span>
        </div>
        <Suspense>
          <UserMenu />
        </Suspense>
      </div>

      <SidebarNav />

      <div className='border-t border-border text-muted-foreground text-sm mt-auto p-2'>
        <Link href="mailto:hello@useecho.co" className="flex items-center p-2 hover:bg-stone-100 rounded-md">
          <CircleHelpIcon className="w-4 h-4" />
          <span className="ml-2">Help</span>
        </Link>
        <div className="flex items-center justify-between text-xs px-2 py-2">
          <p>Version 0.0.1</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}