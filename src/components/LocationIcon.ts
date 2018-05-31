import iconUrl from '@/assets/marker-icon.png'
import iconRetinaUrl from '@/assets/marker-icon-2x.png'
import shadowUrl from '@/assets/marker-shadow.png'
import L from 'leaflet'

const icon = L.icon(
  Object.assign({}, L.Icon.Default.prototype.options, {
    iconUrl,
    shadowUrl,
    iconRetinaUrl,
  }),
)
export default icon
