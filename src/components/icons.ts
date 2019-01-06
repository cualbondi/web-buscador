import stopIconUrl from '@/assets/marker-stop.png'
import downIconUrl from '@/assets/marker-stop.png'
import upIconUrl from '@/assets/marker-stop.png'
import { L } from 'vue2-leaflet'

export const geoLocationIcon = new L.DivIcon({
  className: 'location-marker',
})

export const StopIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl: stopIconUrl,
    iconRetinaUrl: stopIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const DownIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl: downIconUrl,
    iconRetinaUrl: downIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const UpIcon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl: upIconUrl,
    iconRetinaUrl: upIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const AIcon = new L.DivIcon({
  className: 'markerAB markerA',
  popupAnchor: [0, -40],
})

export const BIcon = new L.DivIcon({
  className: 'markerAB markerB',
  popupAnchor: [0, -40],
})

export const AIconDragging = new L.DivIcon({
  className: 'markerAB markerA drag',
  popupAnchor: [0, -40],
})

export const BIconDragging = new L.DivIcon({
  className: 'markerAB markerB drag',
  popupAnchor: [0, -40],
})
