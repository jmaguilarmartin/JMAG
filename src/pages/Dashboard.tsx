import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Activity as ActivityIcon, Star, Calendar, TrendingUp, ArrowRight, ChevronLeft, ChevronRight, Mic2, MapPin, PartyPopper, User, Building2, Globe, Ruler, Navigation } from 'lucide-react'
import { useActivities } from '../hooks/useActivities'
import { useCategories } from '../hooks/useCategories'
import { StatsCard } from '../components/StatsCard'
import { CategoryIcon } from '../components/CategoryIcon'
import { StarRating } from '../components/StarRating'
import { format, lastDayOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { lookupCity } from '../data/cities'

const HOME_COORDS = { lat: 40.42, lng: -3.70 } // Madrid

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatKm(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(1).replace('.', ',')}k km`
  return `${Math.round(km)} km`
}

export function Dashboard() {
  const { activities, loading: loadingActivities } = useActivities()
  const { categories, loading: loadingCategories } = useCategories()
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

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

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    years.add(new Date().getFullYear())
    for (const a of activities) {
      years.add(new Date(a.date).getFullYear())
    }
    return Array.from(years).sort()
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

  const activeCategories = useMemo(() => {
    const yearActivities = activities.filter(a => a.date.startsWith(selectedYear.toString()))
    const usedCategoryIds = new Set(yearActivities.map(a => a.category_id))
    return categories.filter(c => usedCategoryIds.has(c.id))
  }, [activities, categories, selectedYear])

  const monthlyData = useMemo(() => {
    const result: Record<string, string | number>[] = []
    for (let m = 0; m < 12; m++) {
      const d = new Date(selectedYear, m, 1)
      const yearMonth = format(d, 'yyyy-MM')
      const label = format(d, 'MMM', { locale: es })
      const monthActivities = activities.filter(a => a.date.substring(0, 7) === yearMonth)
      const row: Record<string, string | number> = { month: label, yearMonth }
      for (const cat of activeCategories) {
        row[cat.name] = monthActivities.filter(a => a.category_id === cat.id).length
      }
      result.push(row)
    }
    return result
  }, [activities, selectedYear, activeCategories])

  const handleBarClick = (data: { yearMonth: string }) => {
    if (!data?.yearMonth) return
    const d = new Date(data.yearMonth + '-01')
    const dateFrom = format(d, 'yyyy-MM-dd')
    const dateTo = format(lastDayOfMonth(d), 'yyyy-MM-dd')
    navigate(`/activities?date_from=${dateFrom}&date_to=${dateTo}`)
  }

  const recentActivities = useMemo(() => {
    return activities.slice(0, 5)
  }, [activities])

  const categoryIndicators = useMemo(() => {
    const catByName = Object.fromEntries(categories.map(c => [c.name, c]))
    const currentYear = new Date().getFullYear().toString()

    // Conciertos
    const conciertosCat = catByName['Conciertos']
    const conciertos = conciertosCat ? activities.filter(a => a.category_id === conciertosCat.id) : []
    const conciertoStats = {
      artistas: new Set(conciertos.map(a => String(a.fields?.artist ?? '')).filter(Boolean)).size,
      ciudades: new Set(conciertos.map(a => String(a.fields?.city ?? '')).filter(Boolean)).size,
      festivales: conciertos.filter(a =>
        String(a.fields?.venue ?? '').toLowerCase().includes('festival') ||
        a.title.toLowerCase().includes('festival')
      ).length,
    }

    // Teatros
    const teatrosCat = catByName['Teatros']
    const teatros = teatrosCat ? activities.filter(a => a.category_id === teatrosCat.id) : []
    const teatroStats = {
      actores: new Set(teatros.map(a => String(a.fields?.actor ?? '')).filter(Boolean)).size,
      ciudades: new Set(teatros.map(a => String(a.fields?.city ?? '')).filter(Boolean)).size,
      venues: new Set(teatros.map(a => String(a.fields?.venue ?? '')).filter(Boolean)).size,
    }

    // Viajes
    const viajesCat = catByName['Viajes']
    const viajes = viajesCat ? activities.filter(a => a.category_id === viajesCat.id) : []
    const viajesThisYear = viajes.filter(a => a.date.startsWith(currentYear))

    const calcKm = (list: typeof viajes) =>
      list.reduce((sum, a) => {
        const dest = String(a.fields?.destination ?? '')
        const city = lookupCity(dest)
        if (!city) return sum
        return sum + haversineKm(HOME_COORDS.lat, HOME_COORDS.lng, city.lat, city.lng) * 2
      }, 0)

    const viajeStats = {
      destinos: new Set(viajes.map(a => String(a.fields?.destination ?? '')).filter(Boolean)).size,
      paises: new Set(viajes.map(a => String(a.fields?.country ?? '')).filter(Boolean)).size,
      kmTotales: calcKm(viajes),
      kmEsteAnyo: calcKm(viajesThisYear),
    }

    return {
      conciertos: conciertoStats,
      hasConciertoData: conciertos.length > 0,
      teatros: teatroStats,
      hasTeatroData: teatros.length > 0,
      viajes: viajeStats,
      hasViajeData: viajes.length > 0,
    }
  }, [activities, categories])

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Actividades por mes</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedYear(y => y - 1)}
                disabled={selectedYear <= availableYears[0]}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[4ch] text-center">{selectedYear}</span>
              <button
                onClick={() => setSelectedYear(y => y + 1)}
                disabled={selectedYear >= new Date().getFullYear()}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          {activeCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  itemSorter={(item) => -(Number(item.value) || 0)}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                  iconType="circle"
                  iconSize={8}
                />
                {activeCategories.map((cat, i) => (
                  <Bar
                    key={cat.id}
                    dataKey={cat.name}
                    stackId="stack"
                    fill={cat.color}
                    cursor="pointer"
                    radius={i === activeCategories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    onClick={(_: unknown, index: number) => handleBarClick(monthlyData[index] as { yearMonth: string })}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              Sin datos en {selectedYear}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2 text-center">Haz clic en un mes para ver sus actividades</p>
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

      {/* Category-specific indicators */}
      {(categoryIndicators.hasConciertoData || categoryIndicators.hasTeatroData || categoryIndicators.hasViajeData) && (
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Indicadores por categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {/* Conciertos */}
            {categoryIndicators.hasConciertoData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ backgroundColor: '#ec4899' }}>
                  <CategoryIcon icon="music" size={16} />
                  <span className="text-sm font-semibold">Conciertos</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  <div className="flex flex-col items-center gap-1 p-4">
                    <Mic2 size={18} className="text-pink-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.conciertos.artistas}</span>
                    <span className="text-xs text-gray-500 text-center">Artistas</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <MapPin size={18} className="text-pink-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.conciertos.ciudades}</span>
                    <span className="text-xs text-gray-500 text-center">Ciudades</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <PartyPopper size={18} className="text-pink-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.conciertos.festivales}</span>
                    <span className="text-xs text-gray-500 text-center">Festivales</span>
                  </div>
                </div>
              </div>
            )}

            {/* Teatros */}
            {categoryIndicators.hasTeatroData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ backgroundColor: '#7c3aed' }}>
                  <CategoryIcon icon="theater" size={16} />
                  <span className="text-sm font-semibold">Teatros</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  <div className="flex flex-col items-center gap-1 p-4">
                    <User size={18} className="text-violet-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.teatros.actores}</span>
                    <span className="text-xs text-gray-500 text-center">Actores</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <MapPin size={18} className="text-violet-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.teatros.ciudades}</span>
                    <span className="text-xs text-gray-500 text-center">Ciudades</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <Building2 size={18} className="text-violet-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.teatros.venues}</span>
                    <span className="text-xs text-gray-500 text-center">Teatros</span>
                  </div>
                </div>
              </div>
            )}

            {/* Viajes */}
            {categoryIndicators.hasViajeData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ backgroundColor: '#06b6d4' }}>
                  <CategoryIcon icon="plane" size={16} />
                  <span className="text-sm font-semibold">Viajes</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  <div className="flex flex-col items-center gap-1 p-4 border-b border-gray-100">
                    <Navigation size={18} className="text-cyan-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.viajes.destinos}</span>
                    <span className="text-xs text-gray-500 text-center">Destinos</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4 border-b border-gray-100">
                    <Globe size={18} className="text-cyan-400" />
                    <span className="text-xl font-bold text-gray-900">{categoryIndicators.viajes.paises}</span>
                    <span className="text-xs text-gray-500 text-center">Países</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <Ruler size={18} className="text-cyan-400" />
                    <span className="text-xl font-bold text-gray-900">{formatKm(categoryIndicators.viajes.kmTotales)}</span>
                    <span className="text-xs text-gray-500 text-center">Km totales</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <Calendar size={18} className="text-cyan-400" />
                    <span className="text-xl font-bold text-gray-900">{formatKm(categoryIndicators.viajes.kmEsteAnyo)}</span>
                    <span className="text-xs text-gray-500 text-center">Km este año</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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
