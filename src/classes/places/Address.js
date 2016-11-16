import errors, { generateError } from './../../errors'

class Address {
  constructor(value) {
    if (typeof value === 'string' && value) {
      this.address = value
    } else {
      throw generateError(errors.invalidValue('value', value))
    }
  }

  getLocation({ googleMapsAPIKey } = {}, cb) {
    const { address } = this
    const url = new URL('https://maps.googleapis.com')
    url.pathname = '/maps/api/geocode/json'
    url.searchParams.append('address', address)
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
    }, error => {
      cb(error)
    })
  }
}

export default Address
