import errors, { generateError } from './../../errors'

class FullLocation {
  constructor(address, latitude, longitude) {
    if (typeof address !== 'string' || !address) {
      throw generateError(errors.invalidValue('address', address))
    }
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      throw generateError(errors.invalidValue('latitude', latitude))
    }
    if (typeof longitude !== 'number' || latitude < -180 || latitude > 180) {
      throw generateError(errors.invalidValue('longitude', longitude))
    }
    this.address = address
    this.latitude = latitude
    this.longitude = longitude
  }

  getLocation({} = {}, cb) {
    const { address, latitude, longitude } = this
    cb(null, { address, latitude, longitude })
  }
}

export default FullLocation
