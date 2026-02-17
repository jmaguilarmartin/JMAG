// Coordinates for common travel destination cities
// Used by TravelMap to place city-level markers

type CityInfo = {
  lat: number
  lng: number
}

const cities: Record<string, CityInfo> = {
  // Spain
  'madrid': { lat: 40.42, lng: -3.70 },
  'barcelona': { lat: 41.39, lng: 2.17 },
  'sevilla': { lat: 37.39, lng: -5.98 },
  'seville': { lat: 37.39, lng: -5.98 },
  'valencia': { lat: 39.47, lng: -0.38 },
  'malaga': { lat: 36.72, lng: -4.42 },
  'málaga': { lat: 36.72, lng: -4.42 },
  'bilbao': { lat: 43.26, lng: -2.93 },
  'granada': { lat: 37.18, lng: -3.60 },
  'san sebastian': { lat: 43.32, lng: -1.98 },
  'san sebastián': { lat: 43.32, lng: -1.98 },
  'donostia': { lat: 43.32, lng: -1.98 },
  'zaragoza': { lat: 41.65, lng: -0.88 },
  'palma de mallorca': { lat: 39.57, lng: 2.65 },
  'palma': { lat: 39.57, lng: 2.65 },
  'alicante': { lat: 38.35, lng: -0.48 },
  'cordoba': { lat: 37.88, lng: -4.77 },
  'córdoba': { lat: 37.88, lng: -4.77 },
  'salamanca': { lat: 40.97, lng: -5.66 },
  'santiago de compostela': { lat: 42.88, lng: -8.54 },
  'toledo': { lat: 39.86, lng: -4.02 },
  'ibiza': { lat: 38.91, lng: 1.43 },
  'tenerife': { lat: 28.29, lng: -16.63 },
  'las palmas': { lat: 28.10, lng: -15.41 },
  'cadiz': { lat: 36.53, lng: -6.29 },
  'cádiz': { lat: 36.53, lng: -6.29 },
  'murcia': { lat: 37.98, lng: -1.13 },
  'valladolid': { lat: 41.65, lng: -4.72 },
  'gijon': { lat: 43.54, lng: -5.66 },
  'gijón': { lat: 43.54, lng: -5.66 },
  'oviedo': { lat: 43.36, lng: -5.85 },
  'santander': { lat: 43.46, lng: -3.80 },
  'pamplona': { lat: 42.81, lng: -1.64 },
  'vitoria': { lat: 42.85, lng: -2.67 },
  'logroño': { lat: 42.47, lng: -2.45 },
  'leon': { lat: 42.60, lng: -5.57 },
  'león': { lat: 42.60, lng: -5.57 },
  'burgos': { lat: 42.34, lng: -3.70 },
  'marbella': { lat: 36.51, lng: -4.89 },

  // France
  'paris': { lat: 48.86, lng: 2.35 },
  'parís': { lat: 48.86, lng: 2.35 },
  'lyon': { lat: 45.76, lng: 4.84 },
  'marsella': { lat: 43.30, lng: 5.37 },
  'marseille': { lat: 43.30, lng: 5.37 },
  'niza': { lat: 43.71, lng: 7.26 },
  'nice': { lat: 43.71, lng: 7.26 },
  'burdeos': { lat: 44.84, lng: -0.58 },
  'bordeaux': { lat: 44.84, lng: -0.58 },
  'estrasburgo': { lat: 48.57, lng: 7.75 },
  'strasbourg': { lat: 48.57, lng: 7.75 },
  'toulouse': { lat: 43.60, lng: 1.44 },
  'montpellier': { lat: 43.61, lng: 3.88 },

  // Italy
  'roma': { lat: 41.90, lng: 12.50 },
  'rome': { lat: 41.90, lng: 12.50 },
  'milan': { lat: 45.46, lng: 9.19 },
  'milán': { lat: 45.46, lng: 9.19 },
  'venecia': { lat: 45.44, lng: 12.32 },
  'venice': { lat: 45.44, lng: 12.32 },
  'florencia': { lat: 43.77, lng: 11.25 },
  'florence': { lat: 43.77, lng: 11.25 },
  'napoles': { lat: 40.85, lng: 14.27 },
  'nápoles': { lat: 40.85, lng: 14.27 },
  'naples': { lat: 40.85, lng: 14.27 },
  'turin': { lat: 45.07, lng: 7.69 },
  'turín': { lat: 45.07, lng: 7.69 },
  'bolonia': { lat: 44.49, lng: 11.34 },
  'bologna': { lat: 44.49, lng: 11.34 },
  'palermo': { lat: 38.12, lng: 13.36 },
  'genova': { lat: 44.41, lng: 8.93 },
  'pisa': { lat: 43.72, lng: 10.40 },
  'verona': { lat: 45.44, lng: 10.99 },
  'amalfi': { lat: 40.63, lng: 14.60 },
  'cinque terre': { lat: 44.13, lng: 9.71 },
  'siena': { lat: 43.32, lng: 11.33 },

  // Germany
  'berlin': { lat: 52.52, lng: 13.41 },
  'berlín': { lat: 52.52, lng: 13.41 },
  'munich': { lat: 48.14, lng: 11.58 },
  'múnich': { lat: 48.14, lng: 11.58 },
  'hamburgo': { lat: 53.55, lng: 9.99 },
  'hamburg': { lat: 53.55, lng: 9.99 },
  'frankfurt': { lat: 50.11, lng: 8.68 },
  'colonia': { lat: 50.94, lng: 6.96 },
  'cologne': { lat: 50.94, lng: 6.96 },
  'dusseldorf': { lat: 51.23, lng: 6.77 },
  'düsseldorf': { lat: 51.23, lng: 6.77 },
  'stuttgart': { lat: 48.78, lng: 9.18 },
  'dresde': { lat: 51.05, lng: 13.74 },
  'dresden': { lat: 51.05, lng: 13.74 },

  // UK
  'londres': { lat: 51.51, lng: -0.13 },
  'london': { lat: 51.51, lng: -0.13 },
  'edimburgo': { lat: 55.95, lng: -3.19 },
  'edinburgh': { lat: 55.95, lng: -3.19 },
  'manchester': { lat: 53.48, lng: -2.24 },
  'liverpool': { lat: 53.41, lng: -2.98 },
  'glasgow': { lat: 55.86, lng: -4.25 },
  'oxford': { lat: 51.75, lng: -1.25 },
  'cambridge': { lat: 52.21, lng: 0.12 },
  'bath': { lat: 51.38, lng: -2.36 },
  'bristol': { lat: 51.45, lng: -2.59 },

  // Portugal
  'lisboa': { lat: 38.72, lng: -9.14 },
  'lisbon': { lat: 38.72, lng: -9.14 },
  'oporto': { lat: 41.16, lng: -8.63 },
  'porto': { lat: 41.16, lng: -8.63 },
  'faro': { lat: 37.02, lng: -7.94 },
  'funchal': { lat: 32.65, lng: -16.91 },

  // Netherlands
  'amsterdam': { lat: 52.37, lng: 4.90 },
  'ámsterdam': { lat: 52.37, lng: 4.90 },
  'rotterdam': { lat: 51.92, lng: 4.48 },
  'la haya': { lat: 52.08, lng: 4.30 },
  'the hague': { lat: 52.08, lng: 4.30 },
  'utrecht': { lat: 52.09, lng: 5.12 },

  // Belgium
  'bruselas': { lat: 50.85, lng: 4.35 },
  'brussels': { lat: 50.85, lng: 4.35 },
  'brujas': { lat: 51.21, lng: 3.22 },
  'bruges': { lat: 51.21, lng: 3.22 },
  'amberes': { lat: 51.22, lng: 4.40 },
  'antwerp': { lat: 51.22, lng: 4.40 },
  'gante': { lat: 51.05, lng: 3.72 },
  'ghent': { lat: 51.05, lng: 3.72 },

  // Switzerland
  'zurich': { lat: 47.38, lng: 8.54 },
  'zúrich': { lat: 47.38, lng: 8.54 },
  'ginebra': { lat: 46.20, lng: 6.14 },
  'geneva': { lat: 46.20, lng: 6.14 },
  'berna': { lat: 46.95, lng: 7.45 },
  'bern': { lat: 46.95, lng: 7.45 },
  'lucerna': { lat: 47.05, lng: 8.31 },
  'lucerne': { lat: 47.05, lng: 8.31 },
  'interlaken': { lat: 46.69, lng: 7.87 },

  // Austria
  'viena': { lat: 48.21, lng: 16.37 },
  'vienna': { lat: 48.21, lng: 16.37 },
  'salzburgo': { lat: 47.80, lng: 13.04 },
  'salzburg': { lat: 47.80, lng: 13.04 },
  'innsbruck': { lat: 47.26, lng: 11.39 },

  // Greece
  'atenas': { lat: 37.98, lng: 23.73 },
  'athens': { lat: 37.98, lng: 23.73 },
  'santorini': { lat: 36.39, lng: 25.46 },
  'mykonos': { lat: 37.45, lng: 25.33 },
  'creta': { lat: 35.24, lng: 24.90 },
  'crete': { lat: 35.24, lng: 24.90 },
  'tesalonica': { lat: 40.64, lng: 22.94 },
  'thessaloniki': { lat: 40.64, lng: 22.94 },
  'rodas': { lat: 36.43, lng: 28.22 },
  'rhodes': { lat: 36.43, lng: 28.22 },
  'corfu': { lat: 39.62, lng: 19.92 },
  'corfú': { lat: 39.62, lng: 19.92 },

  // Nordics
  'estocolmo': { lat: 59.33, lng: 18.07 },
  'stockholm': { lat: 59.33, lng: 18.07 },
  'oslo': { lat: 59.91, lng: 10.75 },
  'copenhague': { lat: 55.68, lng: 12.57 },
  'copenhagen': { lat: 55.68, lng: 12.57 },
  'helsinki': { lat: 60.17, lng: 24.94 },
  'reikiavik': { lat: 64.15, lng: -21.94 },
  'reykjavik': { lat: 64.15, lng: -21.94 },
  'bergen': { lat: 60.39, lng: 5.32 },

  // Eastern Europe
  'praga': { lat: 50.08, lng: 14.42 },
  'prague': { lat: 50.08, lng: 14.42 },
  'budapest': { lat: 47.50, lng: 19.04 },
  'varsovia': { lat: 52.23, lng: 21.01 },
  'warsaw': { lat: 52.23, lng: 21.01 },
  'cracovia': { lat: 50.06, lng: 19.94 },
  'krakow': { lat: 50.06, lng: 19.94 },
  'dubrovnik': { lat: 42.65, lng: 18.09 },
  'split': { lat: 43.51, lng: 16.44 },
  'zagreb': { lat: 45.81, lng: 15.98 },
  'bucarest': { lat: 44.43, lng: 26.10 },
  'bucharest': { lat: 44.43, lng: 26.10 },
  'sofia': { lat: 42.70, lng: 23.32 },
  'belgrado': { lat: 44.79, lng: 20.47 },
  'belgrade': { lat: 44.79, lng: 20.47 },
  'bratislava': { lat: 48.15, lng: 17.11 },
  'liubliana': { lat: 46.06, lng: 14.51 },
  'ljubljana': { lat: 46.06, lng: 14.51 },
  'tallin': { lat: 59.44, lng: 24.75 },
  'tallinn': { lat: 59.44, lng: 24.75 },
  'riga': { lat: 56.95, lng: 24.11 },
  'vilna': { lat: 54.69, lng: 25.28 },
  'vilnius': { lat: 54.69, lng: 25.28 },

  // Turkey
  'estambul': { lat: 41.01, lng: 28.98 },
  'istanbul': { lat: 41.01, lng: 28.98 },
  'capadocia': { lat: 38.64, lng: 34.83 },
  'cappadocia': { lat: 38.64, lng: 34.83 },
  'antalya': { lat: 36.90, lng: 30.69 },

  // Russia
  'moscu': { lat: 55.76, lng: 37.62 },
  'moscú': { lat: 55.76, lng: 37.62 },
  'moscow': { lat: 55.76, lng: 37.62 },
  'san petersburgo': { lat: 59.93, lng: 30.32 },
  'saint petersburg': { lat: 59.93, lng: 30.32 },

  // USA
  'nueva york': { lat: 40.71, lng: -74.01 },
  'new york': { lat: 40.71, lng: -74.01 },
  'los angeles': { lat: 34.05, lng: -118.24 },
  'los ángeles': { lat: 34.05, lng: -118.24 },
  'chicago': { lat: 41.88, lng: -87.63 },
  'miami': { lat: 25.76, lng: -80.19 },
  'san francisco': { lat: 37.77, lng: -122.42 },
  'las vegas': { lat: 36.17, lng: -115.14 },
  'washington': { lat: 38.91, lng: -77.04 },
  'washington dc': { lat: 38.91, lng: -77.04 },
  'boston': { lat: 42.36, lng: -71.06 },
  'seattle': { lat: 47.61, lng: -122.33 },
  'orlando': { lat: 28.54, lng: -81.38 },
  'houston': { lat: 29.76, lng: -95.37 },
  'dallas': { lat: 32.78, lng: -96.80 },
  'denver': { lat: 39.74, lng: -104.99 },
  'atlanta': { lat: 33.75, lng: -84.39 },
  'filadelfia': { lat: 39.95, lng: -75.17 },
  'philadelphia': { lat: 39.95, lng: -75.17 },
  'san diego': { lat: 32.72, lng: -117.16 },
  'nueva orleans': { lat: 29.95, lng: -90.07 },
  'new orleans': { lat: 29.95, lng: -90.07 },
  'hawaii': { lat: 21.31, lng: -157.86 },
  'honolulu': { lat: 21.31, lng: -157.86 },
  'portland': { lat: 45.52, lng: -122.68 },
  'austin': { lat: 30.27, lng: -97.74 },
  'nashville': { lat: 36.16, lng: -86.78 },

  // Canada
  'toronto': { lat: 43.65, lng: -79.38 },
  'vancouver': { lat: 49.28, lng: -123.12 },
  'montreal': { lat: 45.50, lng: -73.57 },
  'ottawa': { lat: 45.42, lng: -75.70 },
  'quebec': { lat: 46.81, lng: -71.21 },
  'calgary': { lat: 51.05, lng: -114.07 },

  // Mexico
  'ciudad de mexico': { lat: 19.43, lng: -99.13 },
  'cdmx': { lat: 19.43, lng: -99.13 },
  'mexico city': { lat: 19.43, lng: -99.13 },
  'cancun': { lat: 21.16, lng: -86.85 },
  'cancún': { lat: 21.16, lng: -86.85 },
  'playa del carmen': { lat: 20.63, lng: -87.08 },
  'tulum': { lat: 20.21, lng: -87.46 },
  'guadalajara': { lat: 20.67, lng: -103.35 },
  'oaxaca': { lat: 17.07, lng: -96.73 },
  'merida': { lat: 20.97, lng: -89.62 },
  'mérida': { lat: 20.97, lng: -89.62 },
  'puerto vallarta': { lat: 20.65, lng: -105.23 },
  'cabo san lucas': { lat: 22.89, lng: -109.91 },
  'los cabos': { lat: 22.89, lng: -109.91 },

  // Caribbean
  'la habana': { lat: 23.11, lng: -82.37 },
  'havana': { lat: 23.11, lng: -82.37 },
  'punta cana': { lat: 18.58, lng: -68.41 },
  'santo domingo': { lat: 18.49, lng: -69.97 },
  'san juan': { lat: 18.47, lng: -66.11 },
  'kingston': { lat: 18.00, lng: -76.79 },

  // Central America
  'san jose': { lat: 9.93, lng: -84.08 },
  'san josé': { lat: 9.93, lng: -84.08 },
  'ciudad de panama': { lat: 8.98, lng: -79.52 },
  'panama city': { lat: 8.98, lng: -79.52 },

  // South America
  'buenos aires': { lat: -34.60, lng: -58.38 },
  'rio de janeiro': { lat: -22.91, lng: -43.17 },
  'río de janeiro': { lat: -22.91, lng: -43.17 },
  'sao paulo': { lat: -23.55, lng: -46.63 },
  'são paulo': { lat: -23.55, lng: -46.63 },
  'bogota': { lat: 4.71, lng: -74.07 },
  'bogotá': { lat: 4.71, lng: -74.07 },
  'medellin': { lat: 6.25, lng: -75.56 },
  'medellín': { lat: 6.25, lng: -75.56 },
  'cartagena': { lat: 10.39, lng: -75.51 },
  'lima': { lat: -12.05, lng: -77.04 },
  'cusco': { lat: -13.53, lng: -71.97 },
  'cuzco': { lat: -13.53, lng: -71.97 },
  'machu picchu': { lat: -13.16, lng: -72.55 },
  'santiago': { lat: -33.45, lng: -70.67 },
  'santiago de chile': { lat: -33.45, lng: -70.67 },
  'montevideo': { lat: -34.91, lng: -56.16 },
  'quito': { lat: -0.18, lng: -78.47 },
  'la paz': { lat: -16.50, lng: -68.15 },
  'caracas': { lat: 10.48, lng: -66.90 },
  'asuncion': { lat: -25.26, lng: -57.58 },
  'asunción': { lat: -25.26, lng: -57.58 },
  'bariloche': { lat: -41.13, lng: -71.31 },
  'iguazu': { lat: -25.60, lng: -54.57 },
  'iguazú': { lat: -25.60, lng: -54.57 },
  'valparaiso': { lat: -33.05, lng: -71.62 },
  'valparaíso': { lat: -33.05, lng: -71.62 },

  // Japan
  'tokio': { lat: 35.68, lng: 139.69 },
  'tokyo': { lat: 35.68, lng: 139.69 },
  'kioto': { lat: 35.01, lng: 135.77 },
  'kyoto': { lat: 35.01, lng: 135.77 },
  'osaka': { lat: 34.69, lng: 135.50 },
  'hiroshima': { lat: 34.40, lng: 132.46 },
  'nara': { lat: 34.69, lng: 135.80 },

  // China
  'pekin': { lat: 39.90, lng: 116.41 },
  'pekín': { lat: 39.90, lng: 116.41 },
  'beijing': { lat: 39.90, lng: 116.41 },
  'shanghai': { lat: 31.23, lng: 121.47 },
  'shanghái': { lat: 31.23, lng: 121.47 },
  'hong kong': { lat: 22.40, lng: 114.11 },

  // Southeast Asia
  'bangkok': { lat: 13.76, lng: 100.50 },
  'bali': { lat: -8.34, lng: 115.09 },
  'singapur': { lat: 1.35, lng: 103.82 },
  'singapore': { lat: 1.35, lng: 103.82 },
  'kuala lumpur': { lat: 3.14, lng: 101.69 },
  'hanoi': { lat: 21.03, lng: 105.85 },
  'ho chi minh': { lat: 10.82, lng: 106.63 },
  'siem reap': { lat: 13.36, lng: 103.86 },
  'manila': { lat: 14.60, lng: 120.98 },
  'yakarta': { lat: -6.21, lng: 106.85 },
  'jakarta': { lat: -6.21, lng: 106.85 },
  'phuket': { lat: 7.88, lng: 98.39 },
  'chiang mai': { lat: 18.79, lng: 98.98 },

  // South Asia
  'nueva delhi': { lat: 28.61, lng: 77.21 },
  'new delhi': { lat: 28.61, lng: 77.21 },
  'delhi': { lat: 28.70, lng: 77.10 },
  'mumbai': { lat: 19.08, lng: 72.88 },
  'bombay': { lat: 19.08, lng: 72.88 },
  'goa': { lat: 15.30, lng: 74.12 },
  'jaipur': { lat: 26.92, lng: 75.79 },
  'agra': { lat: 27.18, lng: 78.02 },
  'colombo': { lat: 6.93, lng: 79.85 },
  'katmandu': { lat: 27.72, lng: 85.32 },
  'kathmandu': { lat: 27.72, lng: 85.32 },

  // Korea
  'seul': { lat: 37.57, lng: 126.98 },
  'seoul': { lat: 37.57, lng: 126.98 },
  'busan': { lat: 35.18, lng: 129.08 },

  // Middle East
  'dubai': { lat: 25.20, lng: 55.27 },
  'abu dhabi': { lat: 24.45, lng: 54.65 },
  'abu dabi': { lat: 24.45, lng: 54.65 },
  'doha': { lat: 25.29, lng: 51.53 },
  'tel aviv': { lat: 32.09, lng: 34.78 },
  'jerusalen': { lat: 31.77, lng: 35.23 },
  'jerusalén': { lat: 31.77, lng: 35.23 },
  'jerusalem': { lat: 31.77, lng: 35.23 },
  'amman': { lat: 31.95, lng: 35.93 },
  'ammán': { lat: 31.95, lng: 35.93 },
  'petra': { lat: 30.33, lng: 35.44 },

  // Africa
  'marrakech': { lat: 31.63, lng: -8.01 },
  'marrakesh': { lat: 31.63, lng: -8.01 },
  'fez': { lat: 34.03, lng: -5.00 },
  'casablanca': { lat: 33.57, lng: -7.59 },
  'el cairo': { lat: 30.04, lng: 31.24 },
  'cairo': { lat: 30.04, lng: 31.24 },
  'ciudad del cabo': { lat: -33.92, lng: 18.42 },
  'cape town': { lat: -33.92, lng: 18.42 },
  'johannesburgo': { lat: -26.20, lng: 28.05 },
  'johannesburg': { lat: -26.20, lng: 28.05 },
  'nairobi': { lat: -1.29, lng: 36.82 },
  'dar es salaam': { lat: -6.79, lng: 39.28 },
  'dakar': { lat: 14.72, lng: -17.47 },
  'tunez': { lat: 36.81, lng: 10.18 },
  'tunis': { lat: 36.81, lng: 10.18 },

  // Oceania
  'sydney': { lat: -33.87, lng: 151.21 },
  'sídney': { lat: -33.87, lng: 151.21 },
  'melbourne': { lat: -37.81, lng: 144.96 },
  'auckland': { lat: -36.85, lng: 174.76 },
  'queenstown': { lat: -45.03, lng: 168.66 },

  // Ireland
  'dublin': { lat: 53.35, lng: -6.27 },
  'dublín': { lat: 53.35, lng: -6.27 },
  'galway': { lat: 53.27, lng: -9.06 },
  'cork': { lat: 51.90, lng: -8.47 },
}

export function lookupCity(name: string): CityInfo | undefined {
  if (!name) return undefined
  const normalized = name.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (cities[normalized]) return cities[normalized]
  const direct = cities[name.toLowerCase().trim()]
  if (direct) return direct
  for (const [key, value] of Object.entries(cities)) {
    if (normalized === key.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
      return value
    }
  }
  return undefined
}

export function getCityCoords(name: string): [number, number] | undefined {
  const info = lookupCity(name)
  if (!info) return undefined
  return [info.lng, info.lat]
}
