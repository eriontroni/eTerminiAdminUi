import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Pencil, Power, Trash2, ArrowLeft, Layers, Plus, Save, X } from 'lucide-react'
import StatusBadge   from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DataTable     from '../../components/ui/DataTable'
import { useToast }       from '../../components/ui/Toast'
import { useAuth }        from '../../context/AuthContext'
import { PERMISSIONS }    from '../../lib/permissions'
import { getInstitution } from '../../api/institutionsApi'
import {
  getServicesByInstitution,
  getServiceById,
  createService,
  updateService,
  toggleServiceActive,
  deleteService,
} from '../../api/servicesApi'

const emptyCreate = { name: '', description: '', durationMinutes: 30 }

export default function InstitutionServicesList() {
  const { institutionId } = useParams()
  const [institutionName, setInstitutionName] = useState('')
  const [services, setServices]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')

  // Create modal
  const [showCreate, setShowCreate]   = useState(false)
  const [createForm, setCreateForm]   = useState(emptyCreate)
  const [creating, setCreating]       = useState(false)
  const [createError, setCreateError] = useState(null)

  // Edit modal
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm]     = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [updating, setUpdating]     = useState(false)
  const [editError, setEditError]   = useState(null)

  // Confirm dialogs
  const [confirmToggle, setConfirmToggle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [actioning, setActioning]         = useState(false)

  const navigate          = useNavigate()
  const { addToast }      = useToast()
  const { hasPermission } = useAuth()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [instRes, svcRes] = await Promise.all([
        getInstitution(institutionId),
        getServicesByInstitution(institutionId, true),
      ])
      setInstitutionName(instRes.data.name)
      setServices(svcRes.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Ngarkimi dështoi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [institutionId])

  // ── Create ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setCreateForm(emptyCreate)
    setCreateError(null)
    setShowCreate(true)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)
    try {
      const { data } = await createService({
        institutionId,
        name:            createForm.name,
        description:     createForm.description,
        durationMinutes: Number(createForm.durationMinutes),
      })
      setServices(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setShowCreate(false)
      addToast('Shërbimi u krijua me sukses!')
    } catch (err) {
      setCreateError(err.response?.data?.message ?? err.message)
    } finally {
      setCreating(false)
    }
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = async (service) => {
    setEditTarget(service)
    setEditForm(null)
    setEditError(null)
    setEditLoading(true)
    try {
      const { data } = await getServiceById(service.id)
      setEditForm({
        name:            data.name,
        description:     data.description ?? '',
        durationMinutes: data.durationMinutes,
      })
    } catch {
      setEditError('Ngarkimi dështoi.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setEditError(null)
    try {
      const { data } = await updateService(editTarget.id, {
        name:            editForm.name,
        description:     editForm.description,
        durationMinutes: Number(editForm.durationMinutes),
      })
      setServices(prev => prev.map(s => s.id === editTarget.id ? data : s))
      setEditTarget(null)
      addToast('Shërbimi u përditësua me sukses!')
    } catch (err) {
      setEditError(err.response?.data?.message ?? err.message)
    } finally {
      setUpdating(false)
    }
  }

  // ── Toggle ───────────────────────────────────────────────────────────────
  const handleToggle = async () => {
    setActioning(true)
    try {
      const { data } = await toggleServiceActive(confirmToggle.id)
      setServices(prev => prev.map(s => s.id === confirmToggle.id ? data : s))
      addToast(`Shërbimi u ${confirmToggle.isActive ? 'çaktivizua' : 'aktivizua'} me sukses.`)
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setActioning(false)
      setConfirmToggle(null)
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setActioning(true)
    try {
      await deleteService(confirmDelete.id)
      setServices(prev => prev.filter(s => s.id !== confirmDelete.id))
      addToast('Shërbimi u fshi me sukses.')
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setActioning(false)
      setConfirmDelete(null)
    }
  }

  const setC = (key) => (e) => setCreateForm(f => ({ ...f, [key]: e.target.value }))
  const setE = (key) => (e) => setEditForm(f => ({ ...f, [key]: e.target.value }))

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      key: 'name', label: 'Emri',
      render: s => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-900">{s.name}</span>
        </div>
      ),
    },
    { key: 'durationMinutes', label: 'Kohëzgjatja', render: s => <span className="text-slate-500">{s.durationMinutes} min</span> },
    { key: 'isActive', label: 'Statusi', render: s => <StatusBadge active={s.isActive} /> },
    {
      key: 'actions', label: '',
      render: s => (
        <div className="flex items-center gap-1 justify-end">
          {hasPermission(PERMISSIONS.services.createUpdate) && (
            <>
              <button
                onClick={() => openEdit(s)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edito"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmToggle(s)}
                className={`p-1.5 rounded-lg transition-colors ${s.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                title={s.isActive ? 'Çaktivizo' : 'Aktivizo'}
              >
                <Power className="w-4 h-4" />
              </button>
            </>
          )}
          {hasPermission(PERMISSIONS.services.delete) && (
            <button
              onClick={() => setConfirmDelete(s)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Fshi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/institutions')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shërbimet</h1>
            {institutionName && <p className="text-slate-500 text-sm mt-0.5">{institutionName}</p>}
          </div>
        </div>
        {hasPermission(PERMISSIONS.services.createUpdate) && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Shto Shërbim
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko sipas emrit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
        />
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Nuk u gjet asnjë shërbim."
      />

      {/* ── Create Modal ──────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Shto Shërbim</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{createError}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={setC('name')}
                  required
                  placeholder="P.sh. Konsultë e përgjithshme"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Përshkrimi</label>
                <textarea
                  value={createForm.description}
                  onChange={setC('description')}
                  rows={2}
                  placeholder="Përshkrim i shkurtër i shërbimit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kohëzgjatja: <span className="text-blue-600 font-semibold">{createForm.durationMinutes} min</span>
                </label>
                <input
                  type="range" min={5} max={120} step={5}
                  value={createForm.durationMinutes}
                  onChange={e => setCreateForm(f => ({ ...f, durationMinutes: parseInt(e.target.value, 10) }))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5 min</span><span>120 min</span></div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                  Anulo
                </button>
                <button type="submit" disabled={creating} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                  {creating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Ruaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edito Shërbimin</h2>
              <button onClick={() => setEditTarget(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{editError}</div>}

            {editLoading || !editForm ? (
              <div className="py-10 flex items-center justify-center text-slate-400 text-sm">Duke ngarkuar...</div>
            ) : (
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={setE('name')}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Përshkrimi</label>
                  <textarea
                    value={editForm.description}
                    onChange={setE('description')}
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Kohëzgjatja: <span className="text-blue-600 font-semibold">{editForm.durationMinutes} min</span>
                  </label>
                  <input
                    type="range" min={5} max={120} step={5}
                    value={editForm.durationMinutes}
                    onChange={e => setEditForm(f => ({ ...f, durationMinutes: parseInt(e.target.value, 10) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5 min</span><span>120 min</span></div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                    Anulo
                  </button>
                  <button type="submit" disabled={updating} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                    {updating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Ruaj Ndryshimet
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {confirmToggle && (
        <ConfirmDialog
          title={confirmToggle.isActive ? 'Çaktivizo Shërbimin' : 'Aktivizo Shërbimin'}
          message={`A jeni i sigurt që dëshironi të ${confirmToggle.isActive ? 'çaktivizoni' : 'aktivizoni'} shërbimin "${confirmToggle.name}"?`}
          onConfirm={handleToggle}
          onCancel={() => setConfirmToggle(null)}
          loading={actioning}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Fshi Shërbimin"
          message={`A jeni i sigurt që dëshironi të fshini shërbimin "${confirmDelete.name}"? Ky veprim është i pakthyeshëm.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={actioning}
        />
      )}
    </div>
  )
}
