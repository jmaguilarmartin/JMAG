import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { CategoryIcon, availableIcons } from '../components/CategoryIcon'
import type { CategoryField } from '../types'

const presetColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f59e0b', '#f97316', '#10b981', '#06b6d4',
  '#3b82f6', '#64748b',
]

export function Categories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('folder')
  const [color, setColor] = useState('#6366f1')
  const [fields, setFields] = useState<CategoryField[]>([])
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setName('')
    setIcon('folder')
    setColor('#6366f1')
    setFields([])
    setEditId(null)
    setShowForm(false)
  }

  const startEdit = (id: string) => {
    const cat = categories.find(c => c.id === id)
    if (!cat) return
    setEditId(id)
    setName(cat.name)
    setIcon(cat.icon)
    setColor(cat.color)
    setFields(cat.fields)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editId) {
      await updateCategory(editId, { name, icon, color, fields })
    } else {
      await addCategory(name, icon, color, fields)
    }
    setSaving(false)
    resetForm()
  }

  const addField = () => {
    setFields([...fields, { key: `field_${Date.now()}`, label: '', type: 'text' }])
  }

  const updateField = (index: number, updates: Partial<CategoryField>) => {
    setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f))
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleDelete = async (id: string) => {
    const cat = categories.find(c => c.id === id)
    if (!confirm(`Eliminar la categoria "${cat?.name}"? Se eliminaran todas sus actividades.`)) return
    await deleteCategory(id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 mt-1">Gestiona los tipos de actividades</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
          >
            <Plus size={18} />
            Nueva categoria
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {editId ? 'Editar categoria' : 'Nueva categoria'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Podcasts, Deportes, Recetas..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all ${
                      icon === ic
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <CategoryIcon icon={ic} size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Campos personalizados
                </label>
                <button
                  type="button"
                  onClick={addField}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <Plus size={14} /> Anadir campo
                </button>
              </div>
              {fields.length > 0 ? (
                <div className="space-y-2">
                  {fields.map((field, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(i, { label: e.target.value, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                        placeholder="Nombre del campo"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(i, { type: e.target.value as CategoryField['type'] })}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Numero</option>
                        <option value="date">Fecha</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeField(i)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Campos adicionales especificos para esta categoria
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {categories.length > 0 ? (
          categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                <CategoryIcon icon={cat.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">
                  {cat.fields.length} campos &middot; {cat.is_preset ? 'Predefinida' : 'Personalizada'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(cat.id)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-400">
            No hay categorias. Crea una para empezar.
          </div>
        )}
      </div>
    </div>
  )
}
