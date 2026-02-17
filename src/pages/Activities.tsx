import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useActivities } from '../hooks/useActivities'
import { useCategories } from '../hooks/useCategories'
import { StarRating } from '../components/StarRating'
import { CategoryIcon } from '../components/CategoryIcon'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ActivityFilters } from '../types'

function getInitialFilters(params: URLSearchParams): ActivityFilters {
  const f: ActivityFilters = {}
  if (params.get('date_from')) f.date_from = params.get('date_from')!
  if (params.get('date_to')) f.date_to = params.get('date_to')!
  if (params.get('category_id')) f.category_id = params.get('category_id')!
  return f
}

export function Activities() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<ActivityFilters>(() => getInitialFilters(searchParams))
  const [showFilters, setShowFilters] = useState(() => Object.keys(getInitialFilters(searchParams)).length > 0)
  const { activities, loading, deleteActivity } = useActivities(filters)
  const { categories } = useCategories()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Seguro que quieres eliminar esta actividad?')) return
    setDeleting(id)
    await deleteActivity(id)
    setDeleting(null)
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasFilters = filters.category_id || filters.search || filters.rating || filters.date_from || filters.date_to

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actividades</h1>
          <p className="text-gray-500 mt-1">{activities.length} registros</p>
        </div>
        <Link
          to="/activities/new"
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nueva actividad</span>
        </Link>
      </div>

      {/* Search & filter bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              value={filters.search ?? ''}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value || undefined }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1.5 ${
              showFilters || hasFilters
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
                <select
                  value={filters.category_id ?? ''}
                  onChange={(e) => setFilters(f => ({ ...f, category_id: e.target.value || undefined }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Valoracion minima</label>
                <select
                  value={filters.rating ?? ''}
                  onChange={(e) => setFilters(f => ({ ...f, rating: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Cualquiera</option>
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} estrellas</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
                <input
                  type="date"
                  value={filters.date_from ?? ''}
                  onChange={(e) => setFilters(f => ({ ...f, date_from: e.target.value || undefined }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
                <input
                  type="date"
                  value={filters.date_to ?? ''}
                  onChange={(e) => setFilters(f => ({ ...f, date_to: e.target.value || undefined }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <X size={12} /> Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Activity list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : activities.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: activity.category?.color ?? '#6366f1' }}
              >
                <CategoryIcon icon={activity.category?.icon ?? 'folder'} size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-400">
                    {activity.category?.name}
                  </span>
                  <span className="text-xs text-gray-300">&middot;</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(activity.date), 'd MMM yyyy', { locale: es })}
                  </span>
                  {activity.tags.length > 0 && (
                    <>
                      <span className="text-xs text-gray-300">&middot;</span>
                      {activity.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {activity.rating && (
                <div className="hidden sm:block shrink-0">
                  <StarRating value={activity.rating} size={14} readonly />
                </div>
              )}

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/activities/${activity.id}/edit`}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                >
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(activity.id)}
                  disabled={deleting === activity.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <p className="text-gray-400 mb-3">
            {hasFilters ? 'No se encontraron actividades con esos filtros' : 'No tienes actividades todavia'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Limpiar filtros
            </button>
          ) : (
            <Link to="/activities/new" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Registra tu primera actividad
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
