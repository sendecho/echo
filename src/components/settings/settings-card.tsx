import { ReactNode } from 'react'

interface SettingsCardProps {
  name: string
  description: string
  children: ReactNode
}

export function SettingsCard({ name, description, children }: SettingsCardProps) {
  return (
    <section className="border-b border-border pb-12">
      <div className="grid grid-cols-3 gap-24">
        <div>
          <h2 className="text-lg font-semibold mb-2">{name}</h2>
          <p className="text-base text-muted-foreground">{description}</p>
        </div>
        <div className="col-span-2">
          {children}
        </div>
      </div>
    </section>
  )
}