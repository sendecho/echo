"use client";

import { useEffect, useState } from 'react'
import { fetchLists } from '@/lib/supabase/queries/lists';
import { MultiSelect } from '@/components/ui/multi-select'
import { createClient } from '@/lib/supabase/client';
import { getCurrentUserAccountQuery } from '@/lib/supabase/queries/user';

type List = {
  id: string
  name: string
}

type ListSelectorProps = {
  onChange: (selectedLists: string[]) => void
  selectedLists?: string[]
}

export function ListSelector({ onChange, selectedLists: initialSelectedLists = [] }: ListSelectorProps) {
  const supabase = createClient();
  const [selectedLists, setSelectedLists] = useState<string[]>(initialSelectedLists)
  const [lists, setLists] = useState<List[]>([])

  useEffect(() => {
    async function fetchData() {
      const userData = await getCurrentUserAccountQuery(supabase)
      if (userData?.data?.account_id) {
        const response = await fetchLists(supabase, userData.data.account_id)
        if (response.length > 0) {
          setLists(
            response.map(list => ({
              id: list.id,
              name: list.name || '',
            }))
          )
        }
      }
    }

    if (!lists.length) {
      fetchData()
    }
  }, [])

  return (
    <div className="py-2">
      <MultiSelect
        title="Select lists"
        options={lists.map(list => ({ value: list.id, label: list.name }))}
        selectedValues={new Set(selectedLists)}
        onSelectionChange={(selectedValues) => {
          const newSelectedLists = Array.from(selectedValues);
          setSelectedLists(newSelectedLists);
          onChange(newSelectedLists);
        }}
      />
    </div>
  )
}