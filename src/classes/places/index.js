export { default as Address } from './Address'
export { default as LatLng } from './LatLng'
export { default as Warehouse } from './Warehouse'

export function isPlace(place) {
  return typeof place === 'object' && place !== null && typeof place.getLocation === 'function'
}
