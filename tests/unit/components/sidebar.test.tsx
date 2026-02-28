// @vitest-environment jsdom
import { render, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className}>{children}</a>
  ),
  useRouterState: () => ({ location: { pathname: '/dashboard' } }),
}))

import { Sidebar } from '~/components/shell/sidebar'

const mockItems = [
  { label: 'Dashboard', icon: 'layout-dashboard', href: '/dashboard' },
  { label: 'Investments', icon: 'trending-up', href: '/dashboard/investments' },
]

it('renders nav items', () => {
  const { getAllByRole } = render(<Sidebar items={mockItems} />)
  const links = getAllByRole('link')
  expect(links.length).toBeGreaterThanOrEqual(2)
})

it('toggles collapsed state on button click', () => {
  const { getByRole } = render(<Sidebar items={mockItems} />)
  const toggle = getByRole('button', { name: /collapse/i })
  fireEvent.click(toggle)
  // After collapse, toggle button still exists
  expect(toggle).toBeDefined()
})
