declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, CSSProperties, MouseEvent } from 'react'

  interface ProjectionConfig {
    rotate?: [number, number, number]
    center?: [number, number]
    scale?: number
  }

  interface ComposableMapProps {
    projectionConfig?: ProjectionConfig
    projection?: string
    width?: number
    height?: number
    style?: CSSProperties
    children?: ReactNode
  }

  interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    children?: ReactNode
  }

  interface GeographyStyleProps {
    fill?: string
    stroke?: string
    strokeWidth?: number
    outline?: string
    cursor?: string
  }

  interface GeographyStyles {
    default?: GeographyStyleProps
    hover?: GeographyStyleProps
    pressed?: GeographyStyleProps
  }

  interface GeoProperties {
    NAME: string
    ISO_A3: string
    [key: string]: unknown
  }

  interface GeoObject {
    rsmKey: string
    properties: GeoProperties
    id: string
  }

  interface GeographyProps {
    geography: GeoObject
    style?: GeographyStyles
    onMouseEnter?: (event: MouseEvent) => void
    onMouseLeave?: (event: MouseEvent) => void
    onClick?: (event: MouseEvent) => void
  }

  interface GeographiesChildrenProps {
    geographies: GeoObject[]
  }

  interface GeographiesProps {
    geography: string
    children: (data: GeographiesChildrenProps) => ReactNode
  }

  interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    onMouseEnter?: (event: MouseEvent) => void
    onMouseLeave?: (event: MouseEvent) => void
    onClick?: (event: MouseEvent) => void
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<MarkerProps>
}
