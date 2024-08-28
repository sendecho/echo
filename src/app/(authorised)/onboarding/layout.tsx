import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {children}
    </div>
  )
}