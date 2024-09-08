"use client";

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from './ui/badge';
import { getRecentBroadcasts } from '@/lib/supabase/queries/contacts';
import Link from 'next/link';

interface List {
  id: number;
  name: string;
}

interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  created_at: string;
  lists: {
    list: List;
  }[];
}

interface Broadcast {
  id: string;
  sent_at: string;
  email: {
    subject: string;
  }
}

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const contact = row.original;
      const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
      const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();


      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent hover:cursor-pointer">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${contact.email}`} alt={fullName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span>{contact.email}</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ContactDetails contact={contact} />
          </SheetContent>
        </Sheet>
      );
    },
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
  },
  {
    accessorKey: 'lists',
    header: 'Lists',
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {contact.lists?.map(list => (
            <Badge key={list.list.id} variant="secondary">
              {list.list.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const contact = row.original;
      return <span>{contact.created_at}</span>;
      // this causes hydration error
      // return <span>{new Date(contact.created_at).toLocaleDateString()}</span>;
    },
  },
];

function ContactDetails({ contact }: { contact: Contact }) {
  const [recentBroadcasts, setRecentBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    // Fetch recent broadcasts for the contact
    // TODO: replace with actual data fetching logic from supabase
    const fetchBroadcasts = async () => {
      const broadcasts = await getRecentBroadcasts(contact.id);
      setRecentBroadcasts(broadcasts);
    };
    fetchBroadcasts();
  }, [contact.id]);

  return (
    <div>
      <SheetHeader>
        <SheetTitle>Contact Details</SheetTitle>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-semibold">Name</h3>
          <p>{`${contact.first_name || ''} ${contact.last_name || ''}`.trim()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Email</h3>
          <p>{contact.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Phone Number</h3>
          <p>{contact.phone_number}</p>
        </div>
        <div>
          <h3 className="font-semibold">Lists</h3>
          <div className="flex flex-wrap gap-2">
            {contact.lists && contact.lists.length > 0 ? (
              contact.lists.map(list => (
                <Badge key={list.list.id} variant="secondary">
                  {list.list.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No lists</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Recent Broadcasts</h3>
        {recentBroadcasts.length > 0 ? (
          <ul className="space-y-2">
            {recentBroadcasts.map((broadcast) => (
              <li key={broadcast.id} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition p-2 px-4 text-sm rounded">
                <Link href={`/dashboard/broadcasts/${broadcast.id}`} aria-label={`View email: ${broadcast?.email?.subject}`}>
                  <p className="font-medium">{broadcast?.email?.subject}</p>
                  <p className="text-xs text-gray-500">{new Date(broadcast?.sent_at).toLocaleDateString()}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent broadcasts</p>
        )}
      </div>
    </div>
  );
}

export default function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const [data, setData] = useState(contacts);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <Input
        placeholder="Search contacts..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm mb-4"
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}