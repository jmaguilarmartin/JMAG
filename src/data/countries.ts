// Mapping of country names (Spanish) to ISO Alpha-3 codes and approximate coordinates
// Used by TravelMap to highlight visited countries and place markers

type CountryInfo = {
  alpha3: string
  lat: number
  lng: number
}

const countries: Record<string, CountryInfo> = {
  // Europe
  'españa': { alpha3: 'ESP', lat: 40.46, lng: -3.75 },
  'spain': { alpha3: 'ESP', lat: 40.46, lng: -3.75 },
  'francia': { alpha3: 'FRA', lat: 46.23, lng: 2.21 },
  'france': { alpha3: 'FRA', lat: 46.23, lng: 2.21 },
  'italia': { alpha3: 'ITA', lat: 41.87, lng: 12.57 },
  'italy': { alpha3: 'ITA', lat: 41.87, lng: 12.57 },
  'alemania': { alpha3: 'DEU', lat: 51.17, lng: 10.45 },
  'germany': { alpha3: 'DEU', lat: 51.17, lng: 10.45 },
  'portugal': { alpha3: 'PRT', lat: 39.40, lng: -8.22 },
  'reino unido': { alpha3: 'GBR', lat: 55.38, lng: -3.44 },
  'united kingdom': { alpha3: 'GBR', lat: 55.38, lng: -3.44 },
  'uk': { alpha3: 'GBR', lat: 55.38, lng: -3.44 },
  'inglaterra': { alpha3: 'GBR', lat: 55.38, lng: -3.44 },
  'irlanda': { alpha3: 'IRL', lat: 53.14, lng: -7.69 },
  'ireland': { alpha3: 'IRL', lat: 53.14, lng: -7.69 },
  'paises bajos': { alpha3: 'NLD', lat: 52.13, lng: 5.29 },
  'holanda': { alpha3: 'NLD', lat: 52.13, lng: 5.29 },
  'netherlands': { alpha3: 'NLD', lat: 52.13, lng: 5.29 },
  'belgica': { alpha3: 'BEL', lat: 50.50, lng: 4.47 },
  'belgium': { alpha3: 'BEL', lat: 50.50, lng: 4.47 },
  'suiza': { alpha3: 'CHE', lat: 46.82, lng: 8.23 },
  'switzerland': { alpha3: 'CHE', lat: 46.82, lng: 8.23 },
  'austria': { alpha3: 'AUT', lat: 47.52, lng: 14.55 },
  'grecia': { alpha3: 'GRC', lat: 39.07, lng: 21.82 },
  'greece': { alpha3: 'GRC', lat: 39.07, lng: 21.82 },
  'suecia': { alpha3: 'SWE', lat: 60.13, lng: 18.64 },
  'sweden': { alpha3: 'SWE', lat: 60.13, lng: 18.64 },
  'noruega': { alpha3: 'NOR', lat: 60.47, lng: 8.47 },
  'norway': { alpha3: 'NOR', lat: 60.47, lng: 8.47 },
  'dinamarca': { alpha3: 'DNK', lat: 56.26, lng: 9.50 },
  'denmark': { alpha3: 'DNK', lat: 56.26, lng: 9.50 },
  'finlandia': { alpha3: 'FIN', lat: 61.92, lng: 25.75 },
  'finland': { alpha3: 'FIN', lat: 61.92, lng: 25.75 },
  'islandia': { alpha3: 'ISL', lat: 64.96, lng: -19.02 },
  'iceland': { alpha3: 'ISL', lat: 64.96, lng: -19.02 },
  'polonia': { alpha3: 'POL', lat: 51.92, lng: 19.15 },
  'poland': { alpha3: 'POL', lat: 51.92, lng: 19.15 },
  'republica checa': { alpha3: 'CZE', lat: 49.82, lng: 15.47 },
  'czech republic': { alpha3: 'CZE', lat: 49.82, lng: 15.47 },
  'chequia': { alpha3: 'CZE', lat: 49.82, lng: 15.47 },
  'hungria': { alpha3: 'HUN', lat: 47.16, lng: 19.50 },
  'hungary': { alpha3: 'HUN', lat: 47.16, lng: 19.50 },
  'croacia': { alpha3: 'HRV', lat: 45.10, lng: 15.20 },
  'croatia': { alpha3: 'HRV', lat: 45.10, lng: 15.20 },
  'rumania': { alpha3: 'ROU', lat: 45.94, lng: 24.97 },
  'romania': { alpha3: 'ROU', lat: 45.94, lng: 24.97 },
  'bulgaria': { alpha3: 'BGR', lat: 42.73, lng: 25.49 },
  'eslovaquia': { alpha3: 'SVK', lat: 48.67, lng: 19.70 },
  'slovakia': { alpha3: 'SVK', lat: 48.67, lng: 19.70 },
  'eslovenia': { alpha3: 'SVN', lat: 46.15, lng: 14.99 },
  'slovenia': { alpha3: 'SVN', lat: 46.15, lng: 14.99 },
  'serbia': { alpha3: 'SRB', lat: 44.02, lng: 21.01 },
  'montenegro': { alpha3: 'MNE', lat: 42.71, lng: 19.37 },
  'albania': { alpha3: 'ALB', lat: 41.15, lng: 20.17 },
  'macedonia del norte': { alpha3: 'MKD', lat: 41.51, lng: 21.75 },
  'north macedonia': { alpha3: 'MKD', lat: 41.51, lng: 21.75 },
  'bosnia': { alpha3: 'BIH', lat: 43.92, lng: 17.68 },
  'bosnia y herzegovina': { alpha3: 'BIH', lat: 43.92, lng: 17.68 },
  'luxemburgo': { alpha3: 'LUX', lat: 49.82, lng: 6.13 },
  'luxembourg': { alpha3: 'LUX', lat: 49.82, lng: 6.13 },
  'malta': { alpha3: 'MLT', lat: 35.94, lng: 14.38 },
  'chipre': { alpha3: 'CYP', lat: 35.13, lng: 33.43 },
  'cyprus': { alpha3: 'CYP', lat: 35.13, lng: 33.43 },
  'estonia': { alpha3: 'EST', lat: 58.60, lng: 25.01 },
  'letonia': { alpha3: 'LVA', lat: 56.88, lng: 24.60 },
  'latvia': { alpha3: 'LVA', lat: 56.88, lng: 24.60 },
  'lituania': { alpha3: 'LTU', lat: 55.17, lng: 23.88 },
  'lithuania': { alpha3: 'LTU', lat: 55.17, lng: 23.88 },
  'turquia': { alpha3: 'TUR', lat: 38.96, lng: 35.24 },
  'turkey': { alpha3: 'TUR', lat: 38.96, lng: 35.24 },
  'rusia': { alpha3: 'RUS', lat: 61.52, lng: 105.32 },
  'russia': { alpha3: 'RUS', lat: 61.52, lng: 105.32 },
  'ucrania': { alpha3: 'UKR', lat: 48.38, lng: 31.17 },
  'ukraine': { alpha3: 'UKR', lat: 48.38, lng: 31.17 },

  // Americas
  'estados unidos': { alpha3: 'USA', lat: 37.09, lng: -95.71 },
  'usa': { alpha3: 'USA', lat: 37.09, lng: -95.71 },
  'eeuu': { alpha3: 'USA', lat: 37.09, lng: -95.71 },
  'united states': { alpha3: 'USA', lat: 37.09, lng: -95.71 },
  'canada': { alpha3: 'CAN', lat: 56.13, lng: -106.35 },
  'canadá': { alpha3: 'CAN', lat: 56.13, lng: -106.35 },
  'mexico': { alpha3: 'MEX', lat: 23.63, lng: -102.55 },
  'méxico': { alpha3: 'MEX', lat: 23.63, lng: -102.55 },
  'cuba': { alpha3: 'CUB', lat: 21.52, lng: -77.78 },
  'republica dominicana': { alpha3: 'DOM', lat: 18.74, lng: -70.16 },
  'dominican republic': { alpha3: 'DOM', lat: 18.74, lng: -70.16 },
  'puerto rico': { alpha3: 'PRI', lat: 18.22, lng: -66.59 },
  'jamaica': { alpha3: 'JAM', lat: 18.11, lng: -77.30 },
  'costa rica': { alpha3: 'CRI', lat: 9.75, lng: -83.75 },
  'panama': { alpha3: 'PAN', lat: 8.54, lng: -80.78 },
  'panamá': { alpha3: 'PAN', lat: 8.54, lng: -80.78 },
  'guatemala': { alpha3: 'GTM', lat: 15.78, lng: -90.23 },
  'honduras': { alpha3: 'HND', lat: 15.20, lng: -86.24 },
  'el salvador': { alpha3: 'SLV', lat: 13.79, lng: -88.90 },
  'nicaragua': { alpha3: 'NIC', lat: 12.87, lng: -85.21 },
  'colombia': { alpha3: 'COL', lat: 4.57, lng: -74.30 },
  'venezuela': { alpha3: 'VEN', lat: 6.42, lng: -66.59 },
  'ecuador': { alpha3: 'ECU', lat: -1.83, lng: -78.18 },
  'peru': { alpha3: 'PER', lat: -9.19, lng: -75.02 },
  'perú': { alpha3: 'PER', lat: -9.19, lng: -75.02 },
  'bolivia': { alpha3: 'BOL', lat: -16.29, lng: -63.59 },
  'brasil': { alpha3: 'BRA', lat: -14.24, lng: -51.93 },
  'brazil': { alpha3: 'BRA', lat: -14.24, lng: -51.93 },
  'chile': { alpha3: 'CHL', lat: -35.68, lng: -71.54 },
  'argentina': { alpha3: 'ARG', lat: -38.42, lng: -63.62 },
  'uruguay': { alpha3: 'URY', lat: -32.52, lng: -55.77 },
  'paraguay': { alpha3: 'PRY', lat: -23.44, lng: -58.44 },

  // Asia
  'japon': { alpha3: 'JPN', lat: 36.20, lng: 138.25 },
  'japan': { alpha3: 'JPN', lat: 36.20, lng: 138.25 },
  'china': { alpha3: 'CHN', lat: 35.86, lng: 104.20 },
  'corea del sur': { alpha3: 'KOR', lat: 35.91, lng: 127.77 },
  'south korea': { alpha3: 'KOR', lat: 35.91, lng: 127.77 },
  'india': { alpha3: 'IND', lat: 20.59, lng: 78.96 },
  'tailandia': { alpha3: 'THA', lat: 15.87, lng: 100.99 },
  'thailand': { alpha3: 'THA', lat: 15.87, lng: 100.99 },
  'vietnam': { alpha3: 'VNM', lat: 14.06, lng: 108.28 },
  'indonesia': { alpha3: 'IDN', lat: -0.79, lng: 113.92 },
  'malasia': { alpha3: 'MYS', lat: 4.21, lng: 101.98 },
  'malaysia': { alpha3: 'MYS', lat: 4.21, lng: 101.98 },
  'filipinas': { alpha3: 'PHL', lat: 12.88, lng: 121.77 },
  'philippines': { alpha3: 'PHL', lat: 12.88, lng: 121.77 },
  'singapur': { alpha3: 'SGP', lat: 1.35, lng: 103.82 },
  'singapore': { alpha3: 'SGP', lat: 1.35, lng: 103.82 },
  'camboya': { alpha3: 'KHM', lat: 12.57, lng: 104.99 },
  'cambodia': { alpha3: 'KHM', lat: 12.57, lng: 104.99 },
  'sri lanka': { alpha3: 'LKA', lat: 7.87, lng: 80.77 },
  'nepal': { alpha3: 'NPL', lat: 28.39, lng: 84.12 },
  'israel': { alpha3: 'ISR', lat: 31.05, lng: 34.85 },
  'jordania': { alpha3: 'JOR', lat: 30.59, lng: 36.24 },
  'jordan': { alpha3: 'JOR', lat: 30.59, lng: 36.24 },
  'emiratos arabes unidos': { alpha3: 'ARE', lat: 23.42, lng: 53.85 },
  'emiratos arabes': { alpha3: 'ARE', lat: 23.42, lng: 53.85 },
  'uae': { alpha3: 'ARE', lat: 23.42, lng: 53.85 },
  'qatar': { alpha3: 'QAT', lat: 25.35, lng: 51.18 },
  'oman': { alpha3: 'OMN', lat: 21.47, lng: 55.98 },
  'omán': { alpha3: 'OMN', lat: 21.47, lng: 55.98 },
  'iran': { alpha3: 'IRN', lat: 32.43, lng: 53.69 },
  'irán': { alpha3: 'IRN', lat: 32.43, lng: 53.69 },

  // Africa
  'marruecos': { alpha3: 'MAR', lat: 31.79, lng: -7.09 },
  'morocco': { alpha3: 'MAR', lat: 31.79, lng: -7.09 },
  'egipto': { alpha3: 'EGY', lat: 26.82, lng: 30.80 },
  'egypt': { alpha3: 'EGY', lat: 26.82, lng: 30.80 },
  'sudafrica': { alpha3: 'ZAF', lat: -30.56, lng: 22.94 },
  'south africa': { alpha3: 'ZAF', lat: -30.56, lng: 22.94 },
  'tunez': { alpha3: 'TUN', lat: 33.89, lng: 9.54 },
  'tunisia': { alpha3: 'TUN', lat: 33.89, lng: 9.54 },
  'kenia': { alpha3: 'KEN', lat: -0.02, lng: 37.91 },
  'kenya': { alpha3: 'KEN', lat: -0.02, lng: 37.91 },
  'tanzania': { alpha3: 'TZA', lat: -6.37, lng: 34.89 },
  'senegal': { alpha3: 'SEN', lat: 14.50, lng: -14.45 },
  'ghana': { alpha3: 'GHA', lat: 7.95, lng: -1.02 },
  'nigeria': { alpha3: 'NGA', lat: 9.08, lng: 8.68 },
  'etiopia': { alpha3: 'ETH', lat: 9.15, lng: 40.49 },
  'ethiopia': { alpha3: 'ETH', lat: 9.15, lng: 40.49 },
  'mozambique': { alpha3: 'MOZ', lat: -18.67, lng: 35.53 },
  'namibia': { alpha3: 'NAM', lat: -22.96, lng: 18.49 },
  'botswana': { alpha3: 'BWA', lat: -22.33, lng: 24.68 },
  'botsuana': { alpha3: 'BWA', lat: -22.33, lng: 24.68 },
  'madagascar': { alpha3: 'MDG', lat: -18.77, lng: 46.87 },
  'mauricio': { alpha3: 'MUS', lat: -20.35, lng: 57.55 },
  'mauritius': { alpha3: 'MUS', lat: -20.35, lng: 57.55 },

  // Oceania
  'australia': { alpha3: 'AUS', lat: -25.27, lng: 133.78 },
  'nueva zelanda': { alpha3: 'NZL', lat: -40.90, lng: 174.89 },
  'new zealand': { alpha3: 'NZL', lat: -40.90, lng: 174.89 },
  'fiji': { alpha3: 'FJI', lat: -17.71, lng: 178.07 },
}

export function lookupCountry(name: string): CountryInfo | undefined {
  if (!name) return undefined
  const normalized = name.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
  // Try exact match first
  if (countries[normalized]) return countries[normalized]
  // Try without accent normalization (some keys have accents)
  const direct = countries[name.toLowerCase().trim()]
  if (direct) return direct
  // Try partial match
  for (const [key, value] of Object.entries(countries)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }
  return undefined
}

export function getCountryAlpha3(name: string): string | undefined {
  return lookupCountry(name)?.alpha3
}

export function getCountryCoords(name: string): [number, number] | undefined {
  const info = lookupCountry(name)
  if (!info) return undefined
  return [info.lng, info.lat]
}
