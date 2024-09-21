'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { importContacts } from '@/actions/import-contacts-action'
import { useToast } from '@/components/ui/use-toast'

export function ImportContactsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (file) {
      setIsLoading(true)
      try {
        const fileContent = await file.text()
        const result = await importContacts({ fileContent })
        if (result?.data) {
          toast({
            title: "Success",
            description: `Imported ${result.data.count} contacts successfully.`,
          })
          setIsOpen(false)
        } else if (result?.validationErrors) {
          toast({
            title: "Validation Error",
            description: "Please check your CSV file format.",
            variant: "destructive",
          })
        } else {
          throw new Error(result?.serverError || "Unknown error occurred")
        }
      } catch (error) {
        console.error('Error importing contacts:', error)
        toast({
          title: "Error",
          description: "Failed to import contacts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const dummyCSVContent = "first_name,last_name,email,phone_number,lists\nJohn,Doe,john@example.com,1234567890,list1,list2\nJane,Smith,jane@example.com,0987654321,list2,list3"

  const downloadDummyCSV = () => {
    const blob = new Blob([dummyCSVContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "dummy_contacts.csv")
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts from CSV</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Please ensure your CSV file has the following columns: first_name, last_name, email, phone_number, lists (comma-separated list IDs)
          </p>
          <Button variant="link" onClick={downloadDummyCSV} className="p-0">
            Download dummy CSV file
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <Button type="submit" disabled={!file || isLoading} className="mt-4">
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}