import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Category, CategoryField } from '../types'

const PRESET_CATEGORIES = [
  { name: 'Libros', icon: 'book-open', color: '#8b5cf6', fields: [
    { key: 'author', label: 'Autor', type: 'text' },
    { key: 'genre', label: 'Genero', type: 'text' },
    { key: 'pages', label: 'Paginas', type: 'number' },
  ]},
  { name: 'Conciertos', icon: 'music', color: '#ec4899', fields: [
    { key: 'artist', label: 'Artista', type: 'text' },
    { key: 'venue', label: 'Lugar', type: 'text' },
    { key: 'city', label: 'Ciudad', type: 'text' },
  ]},
  { name: 'Viajes', icon: 'plane', color: '#06b6d4', fields: [
    { key: 'destination', label: 'Destino', type: 'text' },
    { key: 'country', label: 'Pais', type: 'text' },
  ]},
  { name: 'Peliculas', icon: 'film', color: '#f59e0b', fields: [
    { key: 'director', label: 'Director', type: 'text' },
    { key: 'genre', label: 'Genero', type: 'text' },
    { key: 'year', label: 'Ano', type: 'number' },
  ]},
  { name: 'Series', icon: 'tv', color: '#10b981', fields: [
    { key: 'seasons', label: 'Temporadas', type: 'number' },
    { key: 'platform', label: 'Plataforma', type: 'text' },
    { key: 'genre', label: 'Genero', type: 'text' },
  ]},
  { name: 'Restaurantes', icon: 'utensils', color: '#f97316', fields: [
    { key: 'cuisine', label: 'Tipo de cocina', type: 'text' },
    { key: 'city', label: 'Ciudad', type: 'text' },
    { key: 'price_range', label: 'Rango de precio', type: 'text' },
  ]},
] as const

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const seededRef = useRef(false)

  const seedPresetsIfNeeded = useCallback(async (existing: Category[]) => {
    if (!user || seededRef.current) return existing
    seededRef.current = true

    const presetNames = new Set(existing.filter(c => c.is_preset).map(c => c.name))
    const missing = PRESET_CATEGORIES.filter(p => !presetNames.has(p.name))

    if (missing.length === 0) {
      // Also fix existing presets that have empty fields
      const needsUpdate = existing.filter(
        c => c.is_preset && (!c.fields || c.fields.length === 0)
      )
      for (const cat of needsUpdate) {
        const preset = PRESET_CATEGORIES.find(p => p.name === cat.name)
        if (preset) {
          await supabase
            .from('categories')
            .update({ fields: preset.fields })
            .eq('id', cat.id)
        }
      }
      if (needsUpdate.length > 0) {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .order('is_preset', { ascending: false })
          .order('name')
        return (data as Category[]) ?? existing
      }
      return existing
    }

    await supabase.from('categories').insert(
      missing.map(p => ({
        user_id: user.id,
        name: p.name,
        icon: p.icon,
        color: p.color,
        is_preset: true,
        fields: p.fields,
      }))
    )

    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('is_preset', { ascending: false })
      .order('name')
    return (data as Category[]) ?? existing
  }, [user])

  const fetchCategories = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('is_preset', { ascending: false })
      .order('name')
    const fetched = (data as Category[]) ?? []
    const final = await seedPresetsIfNeeded(fetched)
    setCategories(final)
    setLoading(false)
  }, [user, seedPresetsIfNeeded])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = async (name: string, icon: string, color: string, fields: CategoryField[]) => {
    if (!user) return
    const { error } = await supabase
      .from('categories')
      .insert({ user_id: user.id, name, icon, color, fields, is_preset: false })
    if (!error) await fetchCategories()
    return error
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
    if (!error) await fetchCategories()
    return error
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    if (!error) await fetchCategories()
    return error
  }

  return { categories, loading, addCategory, updateCategory, deleteCategory, refetch: fetchCategories }
}
