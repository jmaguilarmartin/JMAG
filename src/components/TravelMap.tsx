import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { getCountryAlpha3, getCountryCoords } from '../data/countries'
import type { Activity } from '../types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type TripMarker = {
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

  // Build set of visited country codes and markers
  const visitedCountries = new Set<string>()
  const markerMap = new Map<string, TripMarker>()

  for (const activity of activities) {
    const country = (activity.fields?.country as string) || ''
    const destination = (activity.fields?.destination as string) || activity.title

    const alpha3 = getCountryAlpha3(country)
    if (alpha3) visitedCountries.add(alpha3)

    const coords = getCountryCoords(country)
    if (coords) {
      const key = `${destination}-${country}`.toLowerCase()
      const existing = markerMap.get(key)
      if (existing) {
        existing.trips += 1
      } else {
        markerMap.set(key, {
          name: destination,
          coordinates: coords,
          trips: 1,
          country,
        })
      }
    }
  }

  const markers = Array.from(markerMap.values())

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

          {markers.map((marker, i) => (
            <Marker
              key={i}
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
