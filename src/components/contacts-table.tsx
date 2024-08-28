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

interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  created_at: string;
}

interface Broadcast {
  id: string;
  title: string;
  sentAt: string;
}

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
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
                <span>{fullName}</span>
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
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
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
    // This is a placeholder - replace with actual data fetching logic
    const fetchBroadcasts = async () => {
      // Replace this with your actual API call
      const broadcasts = await fetch(`/api/broadcasts?contactId=${contact.id}`).then(res => res.json());
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
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Recent Broadcasts</h3>
        {recentBroadcasts.length > 0 ? (
          <ul className="space-y-2">
            {recentBroadcasts.map((broadcast) => (
              <li key={broadcast.id} className="bg-gray-100 p-2 rounded">
                <p className="font-medium">{broadcast.title}</p>
                <p className="text-sm text-gray-500">{new Date(broadcast.sentAt).toLocaleDateString()}</p>
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