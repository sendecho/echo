import { SecondaryMenu } from "@/components/secondary-menu";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondaryMenu items={[{ path: '/dashboard/account', label: 'Account' }]} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}