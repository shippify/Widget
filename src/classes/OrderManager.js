import { isPlace } from './places'
import { platforms, vehicleTypes } from './../constants'
import errors, { generateError } from './../errors'

class OrderManager {
  constructor({ id, platform, pickupPlace, items, specialInstructions }, { credentials: { apiId, apiSecret }, googleMapsAPIKey }) {
    if (typeof apiId !== 'string' || !apiId || typeof apiSecret !== 'string' || !apiSecret) {
      throw generateError(errors.invalidValue('options.credentials', { apiId, apiSecret }))
    }
    if (typeof id !== 'string' || !id) {
      throw generateError(errors.invalidValue('order.id', id))
    }
    if (typeof platform !== 'undefined' && Object.keys(platforms).map(key => platforms[key]).indexOf(platform) === -1) {
      throw generateError(errors.invalidValue('order.platform', platform))
    }
    if (!Array.isArray(items)) {
      throw generateError(errors.invalidValue('order.items', items))
    }
    if (typeof pickupPlace !== 'undefined' && !isPlace(pickupPlace)) {
      throw generateError(errors.invalidValue('order.pickupPlace', pickupPlace))
    }
    if (typeof specialInstructions !== 'undefined' && (typeof specialInstructions !== 'string' || !specialInstructions)) {
      throw generateError(errors.invalidValue('order.specialInstructions', specialInstructions))
    }
    if (typeof googleMapsAPIKey !== 'undefined' && (typeof googleMapsAPIKey !== 'string' || !googleMapsAPIKey)) {
      throw generateError(errors.invalidValue('options.googleMapsAPIKey', googleMapsAPIKey))
    }
    this.apiToken = btoa(`${apiId}:${apiSecret}`)
    this.id = id
    this.platform = platform
    this.items = items
    this.pickupPlace = pickupPlace || { getLocation: (options, cb) => cb(null) }
    this.specialInstructions = specialInstructions
    this.googleMapsAPIKey = googleMapsAPIKey
  }

  calculateFee(latitude, longitude, cb) {
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      throw generateError(errors.invalidValue('order.location.latitude', latitude))
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      throw generateError(errors.invalidValue('order.location.longitude', longitude))
    }
    const { apiToken, items, pickupPlace, googleMapsAPIKey } = this
    pickupPlace.getLocation({ googleMapsAPIKey, apiToken }, (error, pickupLocation) => {
      if (error) return cb(error)
      const url = new URL('http://staging.shippify.co')
      url.pathname = '/task/fare'
      const data = [
        {
          pickup_location: {
            lat: pickupLocation.latitude,
            lng: pickupLocation.longitude
          },
          delivery_location: {
            lat: latitude,
            lng: longitude,
          },
          items: items.map(item => ({
            size: item.size,
            qty: item.quantity
          }))
        }
      ]
      url.searchParams.append('data', JSON.stringify(data))
      fetch(url, {
        headers: {
          'Authorization': `Basic ${apiToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(({ errFlag, errMsg, price, currency }) => {
        if (errFlag === 0) {
          return cb(null, { fee: price, currencySymbol: currency })
        } else {
          return cb(new Error(errFlag))
        }
      },
      error => cb(error))
    })
  }

  generateOrder({ contact, location: deliveryLocation, vehicleType, specialInstructions }, cb) {
    if (typeof contact !== 'object' || contact === null) {
      throw generateError(errors.invalidValue('order.contact', contact))
    }
    const { name, email, phone } = contact
    if (typeof name !== 'string' || !name) {
      throw generateError(errors.invalidValue('order.contact.name', name))
    }
    if (typeof phone !== 'string' || !phone) {
      throw generateError(errors.invalidValue('order.contact.phone', phone))
    }
    if (typeof email !== 'undefined' && (typeof email !== 'string' || !email)) {
      throw generateError(errors.invalidValue('order.contact.email', email))
    }
    if (typeof vehicleType !== 'undefined' && Object.keys(vehicleTypes).map(key => vehicleTypes[key]).indexOf(vehicleType) === -1) {
      throw generateError(errors.invalidValue('options.vehicleType', vehicleType))
    }
    if (typeof specialInstructions !== 'undefined' && (typeof specialInstructions !== 'string' || !specialInstructions)) {
      throw generateError(errors.invalidValue('order.specialInstructions', specialInstructions))
    }
    if (typeof location !== 'object' || location === null) {
      throw generateError(errors.invalidValue('order.location', location))
    }
    const { address, latitude, longitude } = deliveryLocation
    if (typeof address !== 'string' || !address) {
      throw generateError(errors.invalidValue('order.location.address', address))
    }
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      throw generateError(errors.invalidValue('order.location.latitude', latitude))
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      throw generateError(errors.invalidValue('order.location.longitude', longitude))
    }
    const { apiToken, id, platform, items, pickupPlace, specialInstructions: pickupInstructions, googleMapsAPIKey } = this
    pickupPlace.getLocation({ googleMapsAPIKey, apiToken }, (error, pickupLocation) => {
      if (error) return cb(error)
      const order = {
        id,
        platform,
        vehicleType,
        items,
        pickup: {
          location: pickupLocation,
          specialInstructions: pickupInstructions,
        },
        delivery: {
          location: deliveryLocation,
          contact,
          specialInstructions,
        }
      }
      const url = new URL('http://staging.shippify.co')
      url.pathname = '/orders'
      const body = { order }
      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(json => {
        if (json.code !== 'OK') return cb(json)
        return cb(null, json.payload.order)
      }, error => cb(error))
    })
  }
}

export default OrderManager
