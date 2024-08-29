import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { getUser } from '@/lib/supabase/queries/user.cached';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getUser();
  console.log(user);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}