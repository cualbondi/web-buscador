import iconUrl from '@/assets/marker-icon.png'
import iconRetinaUrl from '@/assets/marker-icon-2x.png'
import shadowUrl from '@/assets/marker-shadow.png'
import stopIconUrl from '@/assets/marker-stop.png'
import L from 'leaflet'

export const LocationIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl,
    iconRetinaUrl,
  }),
)

export const StopIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl: stopIconUrl,
    iconRetinaUrl: stopIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const AIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl,
    iconRetinaUrl,
  }),
)

export const BIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl,
    iconRetinaUrl,
  }),
)
