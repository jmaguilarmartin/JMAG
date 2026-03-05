import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, ArrowRight, Check, AlertCircle } from 'lucide-react'
// @ts-ignore
import * as XLSX from 'xlsx'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCategories } from '../hooks/useCategories'
import { CategoryIcon } from '../components/CategoryIcon'

type ExcelRow = Record<string, string>

// System fields that can be mapped
const SYSTEM_FIELDS = [
  { key: 'title', label: 'Titulo', required: true },
  { key: 'type', label: 'Tipo / Categoria', required: false },
  { key: 'date', label: 'Fecha inicio', required: true },
  { key: 'time_start', label: 'Hora inicio', required: false },
  { key: 'date_end', label: 'Fecha fin', required: false },
  { key: 'time_end', label: 'Hora fin', required: false },
  { key: 'description', label: 'Descripcion', required: false },
] as const

type FieldMapping = Record<string, string> // system field key -> excel column name

export function ImportActivities() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { categories } = useCategories()

  // Step management
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1: File upload
  const [excelColumns, setExcelColumns] = useState<string[]>([])
  const [excelRows, setExcelRows] = useState<ExcelRow[]>([])
  const [fileName, setFileName] = useState('')

  // Step 1b: Column mapping
  const [mapping, setMapping] = useState<FieldMapping>({})

  // Step 2: Row selection & category assignment
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [rowCategories, setRowCategories] = useState<Record<number, string>>({}) // row index -> category_id

  // Step 3: Import
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null)
  const [error, setError] = useState('')

  // Unique types found in excel to help category mapping
  const uniqueTypes = useMemo(() => {
    if (!mapping.type) return []
    const types = new Set<string>()
    excelRows.forEach(row => {
      const val = row[mapping.type]?.trim()
      if (val) types.add(val)
    })
    return Array.from(types)
  }, [excelRows, mapping.type])

  // Global type->category mapping (applied per type, can be overridden per row)
  const [typeCategoryMap, setTypeCategoryMap] = useState<Record<string, string>>({})

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError('')

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: '' })

        if (json.length === 0) {
          setError('El archivo no contiene datos')
          return
        }

        const cols = Object.keys(json[0])
        setExcelColumns(cols)
        setExcelRows(json.map((row: Record<string, unknown>) => {
          const clean: ExcelRow = {}
          for (const key of cols) {
            clean[key] = String(row[key] ?? '')
          }
          return clean
        }))

        // Auto-map columns by name similarity
        const autoMapping: FieldMapping = {}
        for (const field of SYSTEM_FIELDS) {
          const match = cols.find(c => {
            const cl = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (field.key === 'title') return cl.includes('titulo') || cl.includes('title') || cl.includes('nombre')
            if (field.key === 'type') return cl.includes('tipo') || cl.includes('type') || cl.includes('categoria')
            if (field.key === 'date') return cl.includes('fecha inicio') || cl.includes('fecha') || cl === 'date'
            if (field.key === 'time_start') return cl.includes('hora inicio') || cl === 'hora'
            if (field.key === 'date_end') return cl.includes('fecha fin')
            if (field.key === 'time_end') return cl.includes('hora fin')
            if (field.key === 'description') return cl.includes('descripcion') || cl.includes('description') || cl.includes('notas')
            return false
          })
          if (match) autoMapping[field.key] = match
        }
        setMapping(autoMapping)
        setSelectedRows(new Set())
        setRowCategories({})
        setTypeCategoryMap({})
      } catch {
        setError('Error al leer el archivo. Asegurate de que es un archivo Excel valido (.xlsx, .xls, .csv)')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const canGoToStep2 = mapping.title && mapping.date && excelRows.length > 0

  const handleGoToStep2 = () => {
    if (!canGoToStep2) return
    // Pre-select all rows
    setSelectedRows(new Set(excelRows.map((_, i) => i)))
    // Pre-assign categories from type mapping
    const cats: Record<number, string> = {}
    excelRows.forEach((row, i) => {
      const type = row[mapping.type]?.trim()
      if (type && typeCategoryMap[type]) {
        cats[i] = typeCategoryMap[type]
      }
    })
    setRowCategories(cats)
    setStep(2)
  }

  const toggleRow = (idx: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedRows.size === excelRows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(excelRows.map((_, i) => i)))
    }
  }

  const setRowCategory = (idx: number, categoryId: string) => {
    setRowCategories(prev => ({ ...prev, [idx]: categoryId }))
  }

  // Apply type->category mapping to all rows of that type
  const applyTypeCategoryToRows = (type: string, categoryId: string) => {
    setTypeCategoryMap(prev => ({ ...prev, [type]: categoryId }))
    const newCats = { ...rowCategories }
    excelRows.forEach((row, i) => {
      const rowType = row[mapping.type]?.trim()
      if (rowType === type) {
        newCats[i] = categoryId
      }
    })
    setRowCategories(newCats)
  }

  const selectedWithCategory = useMemo(() => {
    return Array.from(selectedRows).filter(i => rowCategories[i])
  }, [selectedRows, rowCategories])

  const canImport = selectedWithCategory.length > 0

  const parseDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0]
    // Try various formats
    // Excel serial number
    const serial = Number(dateStr)
    if (!isNaN(serial) && serial > 10000) {
      const excelEpoch = new Date(1899, 11, 30)
      const d = new Date(excelEpoch.getTime() + serial * 86400000)
      return d.toISOString().split('T')[0]
    }
    // Try ISO / standard formats
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
    // Try dd/mm/yyyy
    const parts = dateStr.split(/[/\-.]/)
    if (parts.length === 3) {
      const [a, b, c] = parts.map(Number)
      if (c > 100) return `${c}-${String(b).padStart(2, '0')}-${String(a).padStart(2, '0')}`
      if (a > 100) return `${a}-${String(b).padStart(2, '0')}-${String(c).padStart(2, '0')}`
    }
    return new Date().toISOString().split('T')[0]
  }

  const handleImport = async () => {
    if (!user || !canImport) return
    setImporting(true)
    setError('')

    let success = 0
    let errors = 0

    for (const idx of selectedWithCategory) {
      const row = excelRows[idx]
      const categoryId = rowCategories[idx]

      const title = row[mapping.title]?.trim() || 'Sin titulo'
      const dateVal = parseDate(row[mapping.date] || '')
      const dateEndVal = mapping.date_end ? parseDate(row[mapping.date_end] || '') : null
      const notes = mapping.description ? (row[mapping.description]?.trim() || null) : null

      const activityData = {
        user_id: user.id,
        category_id: categoryId,
        title,
        date: dateVal,
        date_end: dateEndVal || null,
        rating: null,
        notes,
        fields: {} as Record<string, string>,
        tags: [],
      }

      // Store time info in notes if available
      const timeStart = mapping.time_start ? row[mapping.time_start]?.trim() : ''
      const timeEnd = mapping.time_end ? row[mapping.time_end]?.trim() : ''
      if (timeStart || timeEnd) {
        const timeInfo = [timeStart && `Hora inicio: ${timeStart}`, timeEnd && `Hora fin: ${timeEnd}`]
          .filter(Boolean)
          .join(' | ')
        activityData.notes = activityData.notes ? `${activityData.notes}\n${timeInfo}` : timeInfo
      }

      const { error: insertError } = await supabase.from('activities').insert(activityData)
      if (insertError) {
        errors++
      } else {
        success++
      }
    }

    setImportResult({ success, errors })
    setImporting(false)
    setStep(3)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/activities')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Volver a actividades
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Importar actividades</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { n: 1, label: 'Archivo y mapeo' },
            { n: 2, label: 'Seleccionar filas' },
            { n: 3, label: 'Resultado' },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === n
                    ? 'bg-primary-600 text-white'
                    : step > n
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > n ? <Check size={14} /> : n}
              </div>
              <span className={`text-xs font-medium ${step === n ? 'text-primary-700' : 'text-gray-400'}`}>
                {label}
              </span>
              {n < 3 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* STEP 1: File upload + column mapping */}
        {step === 1 && (
          <div className="space-y-6">
            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona un archivo Excel o CSV
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                <label className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Seleccionar archivo
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <p className="text-xs text-gray-500 mt-2">
                    {fileName} — {excelRows.length} filas encontradas
                  </p>
                )}
              </div>
            </div>

            {/* Column mapping */}
            {excelColumns.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Relacion de campos
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Asigna cada campo del sistema a una columna de tu archivo Excel
                </p>
                <div className="grid gap-3">
                  {SYSTEM_FIELDS.map(field => (
                    <div key={field.key} className="flex items-center gap-3">
                      <div className="w-40 shrink-0">
                        <span className="text-sm text-gray-700 font-medium">
                          {field.label}
                          {field.required && <span className="text-red-400 ml-0.5">*</span>}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 shrink-0" />
                      <select
                        value={mapping[field.key] ?? ''}
                        onChange={(e) => setMapping(m => ({ ...m, [field.key]: e.target.value || '' }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">— No asignar —</option>
                        {excelColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Type to category mapping */}
            {uniqueTypes.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Relacion de tipos con categorias
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Asigna cada tipo encontrado en el Excel a una categoria del sistema. Podras cambiarlo por fila en el siguiente paso.
                </p>
                <div className="grid gap-2">
                  {uniqueTypes.map(type => (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-40 shrink-0">
                        <span className="text-sm bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium inline-block">
                          {type}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 shrink-0" />
                      <select
                        value={typeCategoryMap[type] ?? ''}
                        onChange={(e) => applyTypeCategoryToRows(type, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">— Seleccionar categoria —</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {excelRows.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Vista previa (primeras 3 filas)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        {SYSTEM_FIELDS.filter(f => mapping[f.key]).map(f => (
                          <th key={f.key} className="px-3 py-2 text-left text-gray-600 font-medium border-b">
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelRows.slice(0, 3).map((row, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          {SYSTEM_FIELDS.filter(f => mapping[f.key]).map(f => (
                            <td key={f.key} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                              {row[mapping[f.key]] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGoToStep2}
                disabled={!canGoToStep2}
                className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Row selection & category per row */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Selecciona las filas a importar y asigna la categoria del sistema a cada una.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2.5 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === excelRows.length}
                        onChange={toggleAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Titulo</th>
                    {mapping.type && (
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Tipo Excel</th>
                    )}
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Fecha inicio</th>
                    {mapping.time_start && (
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Hora inicio</th>
                    )}
                    {mapping.date_end && (
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Fecha fin</th>
                    )}
                    {mapping.time_end && (
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Hora fin</th>
                    )}
                    {mapping.description && (
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase">Descripcion</th>
                    )}
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-600 uppercase min-w-[180px]">
                      Categoria
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {excelRows.map((row, idx) => {
                    const isSelected = selectedRows.has(idx)
                    const categoryId = rowCategories[idx] ?? ''
                    const cat = categories.find(c => c.id === categoryId)
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-gray-100 transition-colors ${
                          isSelected ? 'bg-primary-50/30' : 'opacity-50'
                        }`}
                      >
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(idx)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[200px] truncate">
                          {row[mapping.title] || '—'}
                        </td>
                        {mapping.type && (
                          <td className="px-3 py-2.5 text-gray-600 text-xs">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">
                              {row[mapping.type] || '—'}
                            </span>
                          </td>
                        )}
                        <td className="px-3 py-2.5 text-gray-600 text-xs">{row[mapping.date] || '—'}</td>
                        {mapping.time_start && (
                          <td className="px-3 py-2.5 text-gray-600 text-xs">{row[mapping.time_start] || '—'}</td>
                        )}
                        {mapping.date_end && (
                          <td className="px-3 py-2.5 text-gray-600 text-xs">{row[mapping.date_end] || '—'}</td>
                        )}
                        {mapping.time_end && (
                          <td className="px-3 py-2.5 text-gray-600 text-xs">{row[mapping.time_end] || '—'}</td>
                        )}
                        {mapping.description && (
                          <td className="px-3 py-2.5 text-gray-600 text-xs max-w-[200px] truncate">
                            {row[mapping.description] || '—'}
                          </td>
                        )}
                        <td className="px-3 py-2.5">
                          <select
                            value={categoryId}
                            onChange={(e) => setRowCategory(idx, e.target.value)}
                            className={`w-full px-2 py-1.5 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-primary-500 ${
                              categoryId ? 'border-gray-300' : 'border-red-300 bg-red-50'
                            }`}
                          >
                            <option value="">— Categoria —</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          {cat && (
                            <div className="flex items-center gap-1 mt-1">
                              <div
                                className="w-4 h-4 rounded flex items-center justify-center text-white"
                                style={{ backgroundColor: cat.color }}
                              >
                                <CategoryIcon icon={cat.icon} size={10} />
                              </div>
                              <span className="text-[10px] text-gray-500">{cat.name}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                {selectedWithCategory.length} de {excelRows.length} filas listas para importar
                {selectedRows.size > selectedWithCategory.length && (
                  <span className="text-amber-600 ml-2">
                    ({selectedRows.size - selectedWithCategory.length} sin categoria asignada)
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Atras
                </button>
                <button
                  onClick={handleImport}
                  disabled={!canImport || importing}
                  className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Importar {selectedWithCategory.length} actividades
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Result */}
        {step === 3 && importResult && (
          <div className="text-center py-8 space-y-4">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              importResult.errors === 0 ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {importResult.errors === 0 ? (
                <Check className="text-green-600" size={32} />
              ) : (
                <AlertCircle className="text-amber-600" size={32} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Importacion completada</h2>
              <p className="text-sm text-gray-600 mt-1">
                {importResult.success} actividades importadas correctamente
                {importResult.errors > 0 && (
                  <span className="text-red-500"> — {importResult.errors} con errores</span>
                )}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setStep(1)
                  setExcelColumns([])
                  setExcelRows([])
                  setFileName('')
                  setMapping({})
                  setImportResult(null)
                }}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
              >
                Importar mas
              </button>
              <button
                onClick={() => navigate('/activities')}
                className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
              >
                Ver actividades
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
