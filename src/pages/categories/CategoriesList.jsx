import { useState } from 'react'
import { Plus, Pencil, Trash2, Tag, Save } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal         from '../../components/ui/Modal'
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { PERMISSIONS } from '../../lib/permissions'

export default function CategoriesList() {
  const { categories, loading, error, create, update, remove } = useCategories()
  const { hasPermission } = useAuth()
  const { addToast }      = useToast()

  const [confirm, setConfirm]   = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing]   = useState(null)   // { id?, name, description } ose null
  const [saving, setSaving]     = useState(false)
  const [formError, setFormError] = useState(null)

  const canCreate = hasPermission(PERMISSIONS.categories.createUpdate)
  const canDelete = hasPermission(PERMISSIONS.categories.delete)

  const openCreate = () => { setFormError(null); setEditing({ name: '', description: '' }) }
  const openEdit   = (c) => { setFormError(null); setEditing({ id: c.id, name: c.name, description: c.description ?? '' }) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editing.name.trim()) { setFormError('Emri i kategorisë është i detyrueshëm.'); return }
    setSaving(true)
    setFormError(null)
    try {
      const payload = { name: editing.name.trim(), description: editing.description.trim() || undefined }
      if (editing.id) {
        await update(editing.id, payload)
        addToast('Kategoria u përditësua me sukses!')
      } else {
        await create(payload)
        addToast('Kategoria u krijua me sukses!')
      }
      setEditing(null)
    } catch (err) {
      setFormError(err.response?.data?.message ?? err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await remove(confirm.id)
      addToast(`Kategoria "${confirm.name}" u fshi me sukses.`)
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setDeleting(false)
      setConfirm(null)
    }
  }

  const columns = [
    {
      key: 'name', label: 'Emri',
      render: c => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <Tag className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <span className="font-semibold text-slate-900">{c.name}</span>
        </div>
      )
    },
    { key: 'description', label: 'Përshkrimi', render: c => <span className="text-slate-500">{c.description || '—'}</span> },
    {
      key: 'actions', label: '',
      render: c => (
        <div className="flex items-center gap-2 justify-end">
          {canCreate && (
            <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edito">
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => setConfirm(c)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Fshi">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kategoritë</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} kategori gjithsej</p>
        </div>
        {canCreate && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Shto Kategori
          </button>
        )}
      </div>

      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <DataTable columns={columns} data={categories} loading={loading} emptyMessage="Nuk u gjet asnjë kategori." />

      {editing && (
        <Modal title={editing.id ? 'Edito Kategorinë' : 'Shto Kategori'} onClose={() => setEditing(null)} size="md">
          <form onSubmit={handleSave} className="space-y-4">
            {formError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{formError}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri *</label>
              <input
                value={editing.name}
                onChange={e => setEditing(s => ({ ...s, name: e.target.value }))}
                required
                placeholder="p.sh. Shëndetësi, Policia..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Përshkrimi</label>
              <input
                value={editing.description}
                onChange={e => setEditing(s => ({ ...s, description: e.target.value }))}
                placeholder="Përshkrim i shkurtër (opsional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Anulo
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all">
                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Ruaj
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title="Fshi Kategorinë"
          message={`A jeni i sigurt që dëshironi të fshini kategorinë "${confirm.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
