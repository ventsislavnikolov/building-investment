import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text">Building Investment Platform</h1>
        <p className="mt-2 text-muted">Coming soon — M2 Marketing Site</p>
      </div>
    </div>
  )
}
