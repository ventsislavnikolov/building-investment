import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  ArrowLeftRight,
  Coins,
  Heart,
  FolderOpen,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '~/lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': LayoutDashboard,
  'trending-up': TrendingUp,
  wallet: Wallet,
  'arrow-left-right': ArrowLeftRight,
  coins: Coins,
  heart: Heart,
  'folder-open': FolderOpen,
  bell: Bell,
  settings: Settings,
  'help-circle': HelpCircle,
  'log-out': LogOut,
}

export interface NavItem {
  label: string
  icon: string
  href: string
}

interface SidebarProps {
  items: NavItem[]
  bottomItems?: NavItem[]
  onLogout?: () => void
  className?: string
}

export function Sidebar({ items, bottomItems, onLogout, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouterState()
  const pathname = router.location.pathname

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-border transition-all duration-200 overflow-hidden shrink-0',
        collapsed ? 'w-16' : 'w-56',
        className,
      )}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end p-2 border-b border-border">
        <button
          aria-label={collapsed ? 'expand sidebar' : 'collapse sidebar'}
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted/20 text-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary pl-2'
                  : 'text-muted hover:bg-muted/10 hover:text-text',
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-primary' : 'text-muted')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom items */}
      <div className="py-3 px-2 border-t border-border space-y-1">
        {bottomItems?.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? HelpCircle
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-muted/10 hover:text-text transition-colors"
            >
              <Icon className="w-5 h-5 shrink-0 text-muted" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-muted/10 hover:text-text transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0 text-muted" />
            {!collapsed && <span className="truncate">Log out</span>}
          </button>
        )}
      </div>
    </aside>
  )
}
