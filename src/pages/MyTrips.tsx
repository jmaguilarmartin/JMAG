import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, MapPin, Calendar, Plus, X } from 'lucide-react'
import { TravelMap } from '../components/TravelMap'
import { StarRating } from '../components/StarRating'
import { useActivities } from '../hooks/useActivities'
import { useCategories } from '../hooks/useCategories'
import { getCountryAlpha3 } from '../data/countries'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function MyTrips() {
  const { categories } = useCategories()
  const travelCategory = useMemo(
    () => categories.find((c) => c.name === 'Viajes'),
    [categories]
  )

  const { activities: trips, loading } = useActivities(
    travelCategory ? { category_id: travelCategory.id } : undefined
  )

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(prev => prev === countryCode ? null : countryCode)
  }

  const filteredTrips = useMemo(() => {
    if (!selectedCountry) return trips
    return trips.filter(t => {
      const country = (t.fields?.country as string) || ''
      const alpha3 = getCountryAlpha3(country)
      return alpha3 === selectedCountry
    })
  }, [trips, selectedCountry])

  const selectedCountryName = useMemo(() => {
    if (!selectedCountry) return null
    const trip = trips.find(t => {
      const country = (t.fields?.country as string) || ''
      return getCountryAlpha3(country) === selectedCountry
    })
    return trip ? (trip.fields?.country as string) : null
  }, [selectedCountry, trips])

  // Stats
  const countriesVisited = useMemo(() => {
    const set = new Set<string>()
    for (const trip of trips) {
      const country = trip.fields?.country as string
      if (country) {
        const alpha3 = getCountryAlpha3(country)
        set.add(alpha3 || country)
      }
    }
    return set.size
  }, [trips])

  const totalTrips = trips.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plane className="text-cyan-500" size={28} />
            Mis Viajes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explora tus aventuras por el mundo
          </p>
        </div>
        <Link
          to="/activities/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Nuevo viaje
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total viajes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalTrips}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Paises visitados</p>
          <p className="text-2xl font-bold text-cyan-600 mt-1">{countriesVisited}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Mejor valorado</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {trips.length > 0
              ? trips.reduce((best, t) => ((t.rating ?? 0) > (best.rating ?? 0) ? t : best), trips[0]).title
              : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Ultimo viaje</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {trips.length > 0 ? trips[0].title : '-'}
          </p>
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Mapa de viajes</h2>
        <TravelMap
          activities={trips}
          onCountryClick={handleCountryClick}
          selectedCountry={selectedCountry}
        />
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" />
            Pais visitado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            Ciudad
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
            Destino
          </span>
        </div>
      </div>

      {/* Trip list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedCountry
              ? `Viajes a ${selectedCountryName} (${filteredTrips.length})`
              : `Todos los viajes (${totalTrips})`}
          </h2>
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 px-2.5 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <X size={14} />
              Ver todos
            </button>
          )}
        </div>
        {filteredTrips.length === 0 && !selectedCountry ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Plane className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">Aun no tienes viajes registrados.</p>
            <Link
              to="/activities/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <Plus size={16} />
              Registrar mi primer viaje
            </Link>
          </div>
        ) : filteredTrips.length === 0 && selectedCountry ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No hay viajes registrados en {selectedCountryName}.</p>
            <button
              onClick={() => setSelectedCountry(null)}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todos los viajes
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredTrips.map((trip) => (
              <Link
                key={trip.id}
                to={`/activities/${trip.id}/edit`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-cyan-300 hover:shadow-sm transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{trip.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                    {trip.fields?.destination && (
                      <span>{trip.fields.destination as string}</span>
                    )}
                    {trip.fields?.country && (
                      <span className="font-medium text-cyan-600">
                        {trip.fields.country as string}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(trip.date), 'd MMM yyyy', { locale: es })}
                      {trip.date_end && (
                        <> — {format(new Date(trip.date_end), 'd MMM yyyy', { locale: es })}</>
                      )}
                    </span>
                  </div>
                  {trip.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {trip.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {trip.rating && (
                  <div className="shrink-0">
                    <StarRating value={trip.rating} size={14} readonly />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
