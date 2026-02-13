import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Activity as ActivityIcon, Star, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { useActivities } from '../hooks/useActivities'
import { useCategories } from '../hooks/useCategories'
import { StatsCard } from '../components/StatsCard'
import { CategoryIcon } from '../components/CategoryIcon'
import { StarRating } from '../components/StarRating'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function Dashboard() {
  const { activities, loading: loadingActivities } = useActivities()
  const { categories, loading: loadingCategories } = useCategories()

  const stats = useMemo(() => {
    const totalActivities = activities.length
    const avgRating = activities.filter(a => a.rating).reduce((sum, a) => sum + (a.rating ?? 0), 0)
      / (activities.filter(a => a.rating).length || 1)
    const thisYear = activities.filter(a => a.date.startsWith(new Date().getFullYear().toString()))
    const thisMonth = activities.filter(a => {
      const d = new Date(a.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    return { totalActivities, avgRating, thisYear: thisYear.length, thisMonth: thisMonth.length }
  }, [activities])

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const a of activities) {
      counts.set(a.category_id, (counts.get(a.category_id) ?? 0) + 1)
    }
    return categories
      .map(c => ({ name: c.name, value: counts.get(c.id) ?? 0, color: c.color }))
      .filter(c => c.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [activities, categories])

  const monthlyData = useMemo(() => {
    const months = new Map<string, number>()
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = format(d, 'yyyy-MM')
      const label = format(d, 'MMM', { locale: es })
      months.set(key, 0)
      months.set(`label-${key}`, label as unknown as number)
    }
    for (const a of activities) {
      const key = a.date.substring(0, 7)
      if (months.has(key)) {
        months.set(key, (months.get(key) ?? 0) + 1)
      }
    }
    const result: { month: string; actividades: number }[] = []
    for (const [key, value] of months) {
      if (!key.startsWith('label-')) {
        result.push({ month: months.get(`label-${key}`) as unknown as string, actividades: value })
      }
    }
    return result
  }, [activities])

  const recentActivities = useMemo(() => {
    return activities.slice(0, 5)
  }, [activities])

  if (loadingActivities || loadingCategories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen de tus actividades</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total actividades"
          value={stats.totalActivities}
          icon={<ActivityIcon size={24} />}
          color="#6366f1"
        />
        <StatsCard
          title="Valoracion media"
          value={stats.avgRating.toFixed(1)}
          icon={<Star size={24} />}
          color="#f59e0b"
        />
        <StatsCard
          title="Este ano"
          value={stats.thisYear}
          icon={<TrendingUp size={24} />}
          color="#10b981"
        />
        <StatsCard
          title="Este mes"
          value={stats.thisMonth}
          icon={<Calendar size={24} />}
          color="#ec4899"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividades por mes</h3>
          {monthlyData.some(d => d.actividades > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="actividades" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              Sin datos todavia
            </div>
          )}
        </div>

        {/* Category pie chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Por categoria</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-gray-600">{c.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-gray-400">
              Sin datos todavia
            </div>
          )}
        </div>
      </div>

      {/* Recent activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Actividades recientes</h3>
          <Link to="/activities" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        {recentActivities.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}/edit`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: activity.category?.color ?? '#6366f1' }}
                >
                  <CategoryIcon icon={activity.category?.icon ?? 'folder'} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-400">
                    {activity.category?.name} &middot; {format(new Date(activity.date), 'd MMM yyyy', { locale: es })}
                  </p>
                </div>
                {activity.rating && (
                  <StarRating value={activity.rating} size={14} readonly />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <p>No tienes actividades todavia</p>
            <Link to="/activities/new" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
              Registra tu primera actividad
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
