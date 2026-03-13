export type CategoryField = {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select'
  options?: string[]
}

export type Category = {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  is_preset: boolean
  fields: CategoryField[]
  created_at: string
}

export type Activity = {
  id: string
  user_id: string
  category_id: string
  title: string
  date: string
  date_end: string | null
  rating: number | null
  notes: string | null
  fields: Record<string, string | number>
  tags: string[]
  image_url: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export type ActivityFilters = {
  category_id?: string
  search?: string
  rating?: number
  date_from?: string
  date_to?: string
  tags?: string[]
  missing_field?: string
}
