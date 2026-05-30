import { LayoutDashboard, Building2, Users, Settings, MapPin, ShieldCheck, UserPlus, Tag } from 'lucide-react'
import { PERMISSIONS } from './permissions'

// Konfigurim i përbashkët i menusë. `permission` = leja minimale për ta parë zërin.
export const NAV_ITEMS = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard',          permission: PERMISSIONS.dashboard.view },
  { to: '/tenants',        icon: MapPin,           label: 'Qytetet',            permission: PERMISSIONS.tenants.view },
  { to: '/institutions',   icon: Building2,        label: 'Institucionet',      permission: PERMISSIONS.institutions.view },
  { to: '/categories',     icon: Tag,              label: 'Kategoritë',         permission: PERMISSIONS.categories.view },
  { to: '/workers',        icon: Users,            label: 'Punëtorët',          permission: PERMISSIONS.workers.view },
  { to: '/roles',          icon: ShieldCheck,      label: 'Menaxhimi i Roleve', permission: PERMISSIONS.administrators.view },
  { to: '/administrators', icon: UserPlus,         label: 'Shto Administrator', permission: PERMISSIONS.administrators.view },
  { to: '/system',         icon: Settings,         label: 'Sistemi',            permission: PERMISSIONS.system.view },
]

// Rruga e parë që përdoruesi ka leje ta shohë (për redirect kur s'ka qasje).
export function firstAllowedRoute(hasPermission) {
  const item = NAV_ITEMS.find(i => hasPermission(i.permission))
  return item?.to ?? '/profile'
}
