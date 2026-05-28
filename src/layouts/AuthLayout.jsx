import { Outlet } from 'react-router-dom'
import { ShieldCheck, Building2, Users, BarChart3 } from 'lucide-react'

const features = [
  { icon: Building2,  title: 'Menaxho Institucionet',  desc: 'Krijo, edito dhe aktivizo/çaktivizo institucionet.' },
  { icon: Users,      title: 'Menaxho Punëtorët',      desc: 'Shto dhe cakto punëtorë sipas departamentit.' },
  { icon: BarChart3,  title: 'Statistika në Real-time', desc: 'Shiko statistikat e sistemit dhe aktivitetin e fundit.' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 p-10 shrink-0">
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-a absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="orb-b absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="orb-c absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg">eTermini</span>
              <span className="text-blue-300/70 text-xs block uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Menaxho<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Sistemin
              </span>
            </h1>
            <p className="text-blue-200/70 text-base leading-relaxed max-w-xs">
              Paneli administrativ për menaxhimin e plotë të platformës eTermini.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-blue-200/60 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
