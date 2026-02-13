import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCategories } from '../hooks/useCategories'
import { StarRating } from '../components/StarRating'
import { CategoryIcon } from '../components/CategoryIcon'
import type { Activity } from '../types'

export function ActivityForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { categories, loading: loadingCategories } = useCategories()
  const isEditing = Boolean(id)

  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dateEnd, setDateEnd] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [notes, setNotes] = useState('')
  const [fields, setFields] = useState<Record<string, string | number>>({})
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedCategory = categories.find(c => c.id === categoryId)

  // Load activity data for editing
  useEffect(() => {
    if (!id || !user) return
    setLoading(true)
    supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const activity = data as Activity
          setCategoryId(activity.category_id)
          setTitle(activity.title)
          setDate(activity.date)
          setDateEnd(activity.date_end ?? '')
          setRating(activity.rating ?? 0)
          setNotes(activity.notes ?? '')
          setFields(activity.fields)
          setTags(activity.tags)
        }
        setLoading(false)
      })
  }, [id, user])

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !categoryId) return

    setSaving(true)
    setError('')

    const activityData = {
      category_id: categoryId,
      title,
      date,
      date_end: dateEnd || null,
      rating: rating || null,
      notes: notes || null,
      fields,
      tags,
    }

    let err
    if (isEditing) {
      const result = await supabase
        .from('activities')
        .update(activityData)
        .eq('id', id!)
      err = result.error
    } else {
      const result = await supabase
        .from('activities')
        .insert({ ...activityData, user_id: user.id })
      err = result.error
    }

    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      navigate('/activities')
    }
  }

  if (loading || loadingCategories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Editar actividad' : 'Nueva actividad'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(c.id)
                    setFields({})
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    categoryId === c.id
                      ? 'border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    <CategoryIcon icon={c.icon} size={14} />
                  </div>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titulo
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={selectedCategory ? `Nombre del ${selectedCategory.name.toLowerCase().slice(0, -1)}` : 'Titulo de la actividad'}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>

          {/* Category-specific fields */}
          {selectedCategory && selectedCategory.fields.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCategory.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={fields[field.key] ?? ''}
                    onChange={(e) => setFields(f => ({
                      ...f,
                      [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                    }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="date-end" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                id="date-end"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valoracion
            </label>
            <StarRating value={rating} onChange={setRating} size={28} />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Escribe y pulsa Enter"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Anadir
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary-900">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas <span className="text-gray-400">(opcional)</span>
            </label>
            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tus impresiones, resena, recuerdos..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !categoryId}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Save size={16} />
              {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
