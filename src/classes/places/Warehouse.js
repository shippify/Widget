import errors, { generateError } from './../../errors'

class Warehouse {
  constructor(warehouseId) {
    if (typeof warehouseId === 'string' && warehouseId) {
      this.warehouseId = warehouseId
    } else {
      throw generateError(errors.invalidValue('warehouseId', warehouseId))
    }
  }

  getLocation({ apiToken } = {}, cb) {
    if (typeof apiToken !== 'string' || !apiToken) return cb(new Error('Must include shippify\'s API token.'))
    const { warehouseId } = this
    const url = new URL('https://api.shippify.co')
    url.pathname = `/warehouses/${warehouseId}/id`
    fetch(url, {
      headers: {
        'Authorization': `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(({ code, payload }) => {
      if (code === 'OK') {
        const { latitude, longitude, address } = payload.data.depot.location
        cb(null, { latitude, longitude, address })
      } else if (code === 'AU') return cb(generateError(errors.unauthenticated()))
      else if (code === 'AX' || code === 'NR') return cb(generateError(errors.unauthenticated()))
      else return cb(generateError(errors.unknownError()))
    }, error => cb(generateError(errors.unknownError(error))))
  }
}

export default Warehouse
