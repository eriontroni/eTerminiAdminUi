import { Outlet } from 'react-router-dom'
import { Building2, Users, BarChart3, ShieldCheck } from 'lucide-react'

const features = [
  { icon: Building2, title: 'Institucionet', desc: 'Mbaj katalogun publik të saktë dhe të dobishëm.' },
  { icon: Users, title: 'Punëtorët', desc: 'Cakto ekipet dhe shërbimet në vendin e duhur.' },
  { icon: BarChart3, title: 'Pamja e sistemit', desc: 'Shiko aktivitetin që kërkon vëmendje sot.' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#101820]">
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] flex-col relative overflow-hidden bg-[#17212b] p-10 xl:p-14 shrink-0 border-r border-white/10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(245,242,235,.18) 50%, transparent 51%), linear-gradient(0deg, transparent 49%, rgba(245,242,235,.18) 50%, transparent 51%)', backgroundSize: '48px 48px' }} />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9473d] flex items-center justify-center">
              <span className="text-white font-bold">eT</span>
            </div>
            <div>
              <p className="text-white font-semibold text-lg leading-none">eTermini</p>
              <p className="text-[#d8d1c5] text-[10px] mt-1 uppercase tracking-[.2em]">Admin Panel</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <p className="text-[#f1c46a] text-xs font-semibold uppercase tracking-[.18em] mb-4">Puna e përditshme</p>
            <h1 className="text-5xl xl:text-6xl font-semibold text-white leading-[.95] mb-5">Mbaje shërbimin në lëvizje.</h1>
            <p className="text-[#c4ccca] text-base leading-relaxed">Një panel i qartë për njerëzit që kujdesen që çdo termin të ketë një vend.</p>
            <div className="mt-10 space-y-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 py-3 border-t border-white/10">
                  <Icon className="w-4 h-4 text-[#f1c46a] mt-1 shrink-0" />
                  <div><p className="text-white text-sm font-semibold">{title}</p><p className="text-[#aeb5b7] text-xs mt-1">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-5 sm:p-10 bg-[#f5f2eb]">
        <div className="w-full max-w-md"><Outlet /></div>
      </div>
    </div>
  )
}
