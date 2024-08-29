"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createListAction, updateListAction, deleteListAction } from '@/actions/list-actions';
import { fetchContacts } from '@/lib/supabase/queries/contacts';
import { MultiSelect } from '@/components/ui/multi-select';
import { fetchContactsForList, fetchLists } from '@/lib/supabase/queries/lists';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const listSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  contactIds: z.array(z.number()).optional(),
});

type ListFormValues = z.infer<typeof listSchema>;

interface List {
  id: number;
  name: string;
  description: string | null;
  unique_identifier: string;
  contactCount: number;
}

interface Contact {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export function ListManager() {
  const [lists, setLists] = useState<List[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  const form = useForm<ListFormValues>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: '',
      description: '',
      contactIds: [],
    },
  });

  const { execute: executeCreate, status: createStatus } = useAction(createListAction, {
    onSuccess: () => {
      toast({ title: 'List created successfully' });
      handleCloseModal();
      refreshLists();
    },
    onError: (error) => toast({ title: 'Error', description: error.error.serverError || 'An error occurred', variant: 'destructive' }),
  });

  const { execute: executeUpdate, status: updateStatus } = useAction(updateListAction, {
    onSuccess: () => {
      toast({ title: 'List updated successfully' });
      handleCloseModal();
      refreshLists();
    },
    onError: (error) => toast({ title: 'Error', description: error.error.serverError || 'An error occurred', variant: 'destructive' }),
  });

  const { execute: executeDelete, status: deleteStatus } = useAction(deleteListAction, {
    onSuccess: () => {
      toast({ title: 'List deleted successfully' });
      refreshLists();
    },
    onError: (error) => toast({ title: 'Error', description: error.error.serverError || 'An error occurred', variant: 'destructive' }),
  });

  useEffect(() => {
    refreshLists();
    refreshContacts();
  }, []);

  async function refreshLists() {
    const fetchedLists = await fetchLists();
    setLists(fetchedLists);
  }

  async function refreshContacts() {
    const fetchedContacts = await fetchContacts();
    setContacts(fetchedContacts);
  }

  function onSubmit(data: ListFormValues) {
    const contactIds = Array.from(selectedContacts).map(Number);
    if (editingList) {
      executeUpdate({ id: editingList.id, ...data, contactIds });
    } else {
      executeCreate({ ...data, contactIds });
    }
  }

  async function handleOpenModal(list?: List) {
    if (list) {
      setEditingList(list);
      form.reset({
        name: list.name,
        description: list.description || '',
      });
      try {
        const contacts = await fetchContactsForList(list.id);
        setSelectedContacts(new Set(contacts.map(contact => contact.id.toString())));
      } catch (error) {
        console.error('Error fetching contacts for list:', error);
        toast({ title: 'Error', description: 'Failed to fetch contacts for list', variant: 'destructive' });
      }
    } else {
      setEditingList(null);
      form.reset({
        name: '',
        description: '',
      });
      setSelectedContacts(new Set());
    }
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setEditingList(null);
    form.reset();
    setSelectedContacts(new Set());
    setIsModalOpen(false);
  }

  console.log(lists)

  return (
    <div className="space-y-8">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => handleOpenModal()}>Add New List</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingList ? 'Edit List' : 'Create New List'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Contacts</FormLabel>
                <MultiSelect
                  title="Select Contacts"
                  options={contacts.map(contact => ({
                    label: `${contact.first_name} ${contact.last_name} (${contact.email})`,
                    value: contact.id.toString(),
                  }))}
                  selectedValues={selectedContacts}
                  onSelectionChange={setSelectedContacts}
                />
              </FormItem>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createStatus === 'executing' || updateStatus === 'executing'}>
                  {editingList ? 'Update' : 'Create'} List
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Existing Lists</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>List Name</TableHead>
              <TableHead>Number of Contacts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell>{list.name}</TableCell>
                <TableCell>{list.contactCount}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleOpenModal(list)}>Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() => executeDelete({ id: list.id })}
                      disabled={deleteStatus === 'executing'}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}