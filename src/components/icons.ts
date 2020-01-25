import stopIconUrl from '@/assets/marker-stop.png'
import downIconUrl from '@/assets/marker-stop.png'
import upIconUrl from '@/assets/marker-stop.png'
import { DivIcon, icon, Icon } from 'leaflet'

export const geoLocationIcon = new DivIcon({
  className: 'location-marker',
})

export const miniStopIcon = new DivIcon({
  className: 'ministop-marker',
})

export const StopIconA = new DivIcon({
  className: 'stop-marker-a',
})

export const StopIconB = new DivIcon({
  className: 'stop-marker-b',
})

export const StopIconT = new DivIcon({
  className: 'stop-marker-t',
})

export const StopIcon = icon(
  Object.assign({}, Icon.Default.prototype.options, {
    iconUrl: stopIconUrl,
    iconRetinaUrl: stopIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const DownIcon = icon(
  Object.assign({}, Icon.Default.prototype.options, {
    iconUrl: downIconUrl,
    iconRetinaUrl: downIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const UpIcon = icon(
  Object.assign({}, Icon.Default.prototype.options, {
    iconUrl: upIconUrl,
    iconRetinaUrl: upIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -5],
  }),
)

export const AIcon = new DivIcon({
  className: 'markerAB markerA',
  popupAnchor: [0, -40],
})

export const BIcon = new DivIcon({
  className: 'markerAB markerB',
  popupAnchor: [0, -40],
})

export const AIconDragging = new DivIcon({
  className: 'markerAB markerA drag',
  popupAnchor: [0, -40],
})

export const BIconDragging = new DivIcon({
  className: 'markerAB markerB drag',
  popupAnchor: [0, -40],
})
