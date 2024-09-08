import { LogoutButton } from "@/components/logout-button";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed container top-0 left-0 right-0 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-semibold">Echo</h1>
        <LogoutButton />
      </header>
      <main className="container flex-grow flex items-center justify-center pt-16">
        {children}
      </main>
    </div>
  )
}