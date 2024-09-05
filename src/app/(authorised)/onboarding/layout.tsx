import { SignOut } from "@/components/logout-button";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <header>
        <h1>Echo</h1>
      </header>
      {children}
    </div>
  )
}