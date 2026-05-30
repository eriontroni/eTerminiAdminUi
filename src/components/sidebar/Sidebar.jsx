import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck, KeyRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NAV_ITEMS } from '../../lib/navItems'

export default function Sidebar() {
  const { user, logout, hasPermission } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = NAV_ITEMS.filter(item => hasPermission(item.permission))

  const initials = user?.fullName
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'SA'

  return (
    <aside className="w-64 shrink-0 bg-gradient-to-b from-blue-900 to-indigo-950 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-blue-700 font-bold text-sm">eT</span>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none">eTermini</p>
            <p className="text-blue-300/70 text-[10px] mt-0.5 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* SuperAdmin badge */}
      <button
        onClick={() => navigate('/profile')}
        className="px-4 py-3 mx-3 mt-4 mb-2 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-2.5 transition-all text-left w-[calc(100%-24px)] group"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-semibold truncate">{user?.fullName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wide truncate">{user?.roleName ?? user?.role}</span>
          </div>
        </div>
        <KeyRound className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 shrink-0 transition-colors" />
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Dilni
        </button>
      </div>
    </aside>
  )
}
