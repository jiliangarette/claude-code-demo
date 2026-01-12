import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  ExternalLink,
  EyeOff,
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Testimonials',
    href: '/dashboard/testimonials',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()
  const { profile } = useProfile()

  const profileUrl = profile?.slug ? `/p/${profile.slug}` : null
  const isPublished = profile?.is_published

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', isActive && 'bg-secondary')}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </div>
      <div className="mt-auto p-4 border-t">
        {isPublished && profileUrl ? (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Profile
            </Button>
          </a>
        ) : (
          <Button variant="outline" className="w-full justify-start" disabled>
            <EyeOff className="mr-2 h-4 w-4" />
            {profile?.slug ? 'Profile Not Published' : 'Loading...'}
          </Button>
        )}
      </div>
    </div>
  )
}
