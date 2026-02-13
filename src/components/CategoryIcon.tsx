import {
  BookOpen, Music, Plane, Film, Tv, UtensilsCrossed,
  Folder, Dumbbell, Gamepad2, GraduationCap, Heart, Camera
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'book-open': BookOpen,
  'music': Music,
  'plane': Plane,
  'film': Film,
  'tv': Tv,
  'utensils': UtensilsCrossed,
  'folder': Folder,
  'dumbbell': Dumbbell,
  'gamepad': Gamepad2,
  'graduation': GraduationCap,
  'heart': Heart,
  'camera': Camera,
}

export const availableIcons = Object.keys(iconMap)

type Props = {
  icon: string
  size?: number
  className?: string
}

export function CategoryIcon({ icon, size = 20, className }: Props) {
  const IconComponent = iconMap[icon] ?? Folder
  return <IconComponent size={size} className={className} />
}
