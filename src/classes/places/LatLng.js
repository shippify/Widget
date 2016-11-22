import errors, { generateError } from './../../errors'

class LatLng {
  constructor(latitude, longitude) {
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      throw generateError(errors.invalidValue('latitude', latitude))
    }
    if (typeof longitude !== 'number' || latitude < -180 || latitude > 180) {
      throw generateError(errors.invalidValue('longitude', longitude))
    }
    this.latitude = latitude
    this.longitude = longitude
  }

  getLocation({ googleMapsAPIKey } = {}, cb) {
    const { latitude, longitude } = this
    const url = new URL('https://maps.googleapis.com')
    url.pathname = '/maps/api/geocode/json'
    url.searchParams.append('latlng', `${latitude},${longitude}`)
    if (googleMapsAPIKey) {
      url.searchParams.append('key', googleMapsAPIKey)
    }
    fetch(url)
    .then(response => response.json())
    .then(({ status, results }) => {
      if (status === 'OK') {
        const { formatted_address: address, geometry: { location: { lat, lng } } } = results[0]
        cb(null, { latitude: lat, longitude: lng, address })
      } else {
        cb(new Error(status))
      }
    }, error => cb(error))
  }
}

export default LatLng
