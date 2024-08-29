import React, { Suspense } from 'react';
import Image from 'next/image';
import { UserMenu } from './user-menu';
import { SidebarNav } from './sidebar-nav';

export function Sidebar() {

  return (
    <div className="w-64 bg-background border-r">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="ml-2 font-semibold text-lg">Circles</span>
        </div>
        <Suspense>
          <UserMenu />
        </Suspense>
      </div>

      <SidebarNav />
    </div>
  );
}