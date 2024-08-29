import { ListManager } from '@/components/list-manager'

export default async function ListsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mailing Lists</h1>
      <ListManager />
    </div>
  )
}
