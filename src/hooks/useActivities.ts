import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Activity, ActivityFilters } from '../types'

export function useActivities(filters?: ActivityFilters) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)

  const fetchActivities = useCallback(async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('activities')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }
    if (filters?.rating) {
      query = query.eq('rating', filters.rating)
    }
    if (filters?.date_from) {
      query = query.gte('date', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('date', filters.date_to)
    }

    const { data, count: totalCount } = await query
    setActivities((data as Activity[]) ?? [])
    setCount(totalCount ?? 0)
    setLoading(false)
  }, [user, filters?.category_id, filters?.search, filters?.rating, filters?.date_from, filters?.date_to])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const addActivity = async (activity: Omit<Activity, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'category'>) => {
    if (!user) return
    const { error } = await supabase
      .from('activities')
      .insert({ ...activity, user_id: user.id })
    if (!error) await fetchActivities()
    return error
  }

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    const { error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
    if (!error) await fetchActivities()
    return error
  }

  const deleteActivity = async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
    if (!error) await fetchActivities()
    return error
  }

  return { activities, loading, count, addActivity, updateActivity, deleteActivity, refetch: fetchActivities }
}
