import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { getRole, createRole, updateRole, getPermissionCatalog } from '../../api/rolesApi'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useToast } from '../../components/ui/Toast'
import { PERMISSION_CATALOG } from '../../lib/permissions'
import { useAuth } from '../../context/AuthContext'

export default function RoleForm() {
  const { id }                     = useParams()
  const isEdit                     = Boolean(id)
  const navigate                   = useNavigate()
  const { addToast }               = useToast()
  const { user, refreshSession }   = useAuth()

  const [catalog, setCatalog]   = useState(PERMISSION_CATALOG)
  const [name, setName]         = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [loading, setLoading]   = useState(isEdit)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    getPermissionCatalog()
      .then(r => setCatalog(r.data))
      .catch(() => { /* fallback i lokalit mbetet */ })
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getRole(id)
      .then(r => {
        setName(r.data.name)
        setDescription(r.data.description ?? '')
        setSelected(new Set(r.data.permissions))
      })
      .catch(() => setError('Roli nuk u gjet.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const toggleAction = (code) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  const moduleHasAccess = (mod) => mod.actions.some(a => selected.has(a.code))

  const toggleModule = (mod) => {
    setSelected(prev => {
      const next = new Set(prev)
      const hasAny = mod.actions.some(a => next.has(a.code))
      if (hasAny) {
        mod.actions.forEach(a => next.delete(a.code))
      } else {
        // Aktivizimi i modulit jep të paktën "view" (veprimi i parë).
        next.add(mod.actions[0].code)
      }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Emri i rolit është i detyrueshëm.'); return }
    setSaving(true)
    setError(null)
    const payload = { name: name.trim(), description: description.trim(), permissions: [...selected] }
    try {
      if (isEdit) {
        await updateRole(id, payload)
        if (user?.adminRoleId === id) {
          await refreshSession()
        }
        addToast('Roli u përditësua me sukses!')
      } else {
        await createRole(payload)
        addToast('Roli u krijua me sukses!')
      }
      navigate('/roles')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/roles')} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edito Rolin' : 'Shto rol të ri'}</h1>
            <p className="text-slate-500 text-sm">Të dhënat bazë dhe qasjet për modulet</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Ruaj ndryshimet
        </button>
      </div>

      {error && <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Të dhënat bazë */}
        <section className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6">
          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">1. Të dhënat bazë të rolit</h2>
              <p className="text-slate-500 text-sm mt-1">Emri dhe përshkrimi i rolit. Të njëjtat do të shfaqen në listën e roleve.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Përshkrimi i rolit</label>
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Përshkrimi i rolit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri i rolit *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Emri i rolit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Qasjet */}
        <section className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6">
          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">2. Qasjet</h2>
              <p className="text-slate-500 text-sm mt-1">Aktivizo modulin dhe zgjidh lejet e detajuara për këtë rol.</p>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="hidden sm:grid grid-cols-[1fr_auto] pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <span>Emri i modulit</span>
                <span>Qasje në modul</span>
              </div>

              {catalog.map(mod => {
                const access = moduleHasAccess(mod)
                const hasSub = mod.actions.length > 1
                return (
                  <div key={mod.key} className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-800">{mod.label}</span>
                      <Toggle on={access} onClick={() => toggleModule(mod)} />
                    </div>

                    {access && hasSub && (
                      <div className="mt-3 ml-1 space-y-2">
                        {mod.actions.map(a => (
                          <label key={a.code} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selected.has(a.code)}
                              onChange={() => toggleAction(a.code)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                            />
                            {a.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-blue-600' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  )
}
