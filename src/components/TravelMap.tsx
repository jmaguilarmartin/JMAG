import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { getCountryAlpha3, getCountryCoords } from '../data/countries'
import { getCityCoords } from '../data/cities'
import type { Activity } from '../types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type TripMarker = {
  name: string
  coordinates: [number, number]
  trips: number
  country: string
}

type CityMarker = {
  name: string
  coordinates: [number, number]
  trips: number
  country: string
}

type Props = {
  activities: Activity[]
}

export function TravelMap({ activities }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  // Build set of visited country codes, country markers and city markers
  const visitedCountries = new Set<string>()
  const countryMarkerMap = new Map<string, TripMarker>()
  const cityMarkerMap = new Map<string, CityMarker>()

  for (const activity of activities) {
    const country = (activity.fields?.country as string) || ''
    const destination = (activity.fields?.destination as string) || ''

    const alpha3 = getCountryAlpha3(country)
    if (alpha3) visitedCountries.add(alpha3)

    // Try city-level coordinates from destination field
    const cityCoords = getCityCoords(destination)
    if (cityCoords) {
      const key = `${destination}`.toLowerCase()
      const existing = cityMarkerMap.get(key)
      if (existing) {
        existing.trips += 1
      } else {
        cityMarkerMap.set(key, {
          name: destination,
          coordinates: cityCoords,
          trips: 1,
          country,
        })
      }
    }

    // Country-level marker as fallback when no city coords
    const countryCoords = getCountryCoords(country)
    if (countryCoords && !cityCoords) {
      const key = `${destination || activity.title}-${country}`.toLowerCase()
      const existing = countryMarkerMap.get(key)
      if (existing) {
        existing.trips += 1
      } else {
        countryMarkerMap.set(key, {
          name: destination || activity.title,
          coordinates: countryCoords,
          trips: 1,
          country,
        })
      }
    }
  }

  const countryMarkers = Array.from(countryMarkerMap.values())
  const cityMarkers = Array.from(cityMarkerMap.values())

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden">
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isVisited = visitedCountries.has(geo.properties.ISO_A3) ||
                  visitedCountries.has(geo.id)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => {
                      if (isVisited) {
                        setTooltip({
                          text: geo.properties.NAME,
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill: isVisited ? '#06b6d4' : '#e5e7eb',
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: isVisited ? '#0891b2' : '#d1d5db',
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isVisited ? '#0e7490' : '#d1d5db',
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Country-level markers (fallback when city not found) */}
          {countryMarkers.map((marker, i) => (
            <Marker
              key={`country-${i}`}
              coordinates={marker.coordinates}
              onMouseEnter={(e) =>
                setTooltip({
                  text: `${marker.name} (${marker.country}) — ${marker.trips} viaje${marker.trips > 1 ? 's' : ''}`,
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                r={4}
                fill="#f97316"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: 'pointer' }}
              />
            </Marker>
          ))}

          {/* City-level markers */}
          {cityMarkers.map((marker, i) => (
            <Marker
              key={`city-${i}`}
              coordinates={marker.coordinates}
              onMouseEnter={(e) =>
                setTooltip({
                  text: `${marker.name}${marker.country ? ` (${marker.country})` : ''} — ${marker.trips} viaje${marker.trips > 1 ? 's' : ''}`,
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                r={4}
                fill="#f43f5e"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: 'pointer' }}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
        >
          {tooltip.text}
        </div>
      )}

      {activities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <p className="text-gray-400 text-sm">
            Aun no hay viajes registrados. Anade tu primer viaje para verlo en el mapa.
          </p>
        </div>
      )}
    </div>
  )
}
