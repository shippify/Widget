import { isPlace } from './places'
import { platforms, vehicleTypes } from './../constants'
import errors, { generateError } from './../errors'

class OrderManager {
  constructor({ id, platform, pickupPlace, items, fixedPrice, specialInstructions }, { credentials: { apiId, apiSecret }, googleMapsAPIKey }) {
    if (typeof apiId !== 'string' || !apiId || typeof apiSecret !== 'string' || !apiSecret) {
      throw generateError(errors.invalidValue('options.credentials', { apiId, apiSecret }))
    }
    if (typeof id !== 'string' || !id) {
      throw generateError(errors.invalidValue('order.id', id))
    }
    if (typeof platform !== 'undefined' && Object.keys(platforms).map(key => platforms[key]).indexOf(platform) === -1) {
      throw generateError(errors.invalidValue('order.platform', platform))
    }
    if (!Array.isArray(items) || !items.length) {
      throw generateError(errors.invalidValue('order.items', items))
    }
    if (typeof pickupPlace !== 'undefined' && !isPlace(pickupPlace)) {
      throw generateError(errors.invalidValue('order.pickupPlace', pickupPlace))
    }
    if (typeof fixedPrice !== 'undefined') {
      if (typeof fixedPrice !== 'object') {
        throw generateError(errors.invalidValue('order.fixedPrice', fixedPrice))
      } else if (typeof fixedPrice.value !== 'number' || fixedPrice.value < 0) {
        throw generateError(errors.invalidValue('order.fixedPrice.value', fixedPrice.value))
      }
      try {
        Number(1).toLocaleString([], { currency: fixedPrice.currencyCode, style: 'currency' })
      } catch (error) {
        throw generateError(errors.invalidValue('order.fixedPrice.currencyCode', fixedPrice.currencyCode))
      }
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
    this.fixedPrice = fixedPrice
  }

  calculatePrice(latitude, longitude, cb) {
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      throw generateError(errors.invalidValue('order.location.latitude', latitude))
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      throw generateError(errors.invalidValue('order.location.longitude', longitude))
    }
    if (this.fixedPrice) return cb(null, Number(this.fixedPrice.value).toLocaleString([], { currency: this.fixedPrice.currencyCode, style: 'currency' }))
    const { apiToken, items, pickupPlace, googleMapsAPIKey } = this
    pickupPlace.getLocation({ googleMapsAPIKey, apiToken }, (error, pickupLocation) => {
      if (error) return cb(error)
      const url = new URL('https://api.shippify.co')
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
          return cb(null, { value: price, currencySymbol: currency })
        } else {
          return cb(new Error(errFlag))
        }
      },
      error => cb(error))
    })
  }

  generateOrder({ contact, location: deliveryLocation, vehicleType, specialInstructions }, cb) {
    if (typeof contact !== 'object' || contact === null) return cb(generateError(errors.invalidValue('order.contact', contact)))

    const { name, email, phone } = contact
    if (typeof name !== 'string' || !name) return cb(generateError(errors.invalidValue('order.contact.name', name)))

    if (typeof phone !== 'string' || !phone) return cb(generateError(errors.invalidValue('order.contact.phone', phone)))

    if (typeof email !== 'undefined' && (typeof email !== 'string' || !email)) return cb(generateError(errors.invalidValue('order.contact.email', email)))

    if (typeof vehicleType !== 'undefined' && Object.keys(vehicleTypes).map(key => vehicleTypes[key]).indexOf(vehicleType) === -1) return cb(generateError(errors.invalidValue('options.vehicleType', vehicleType)))

    if (typeof specialInstructions !== 'undefined' && (typeof specialInstructions !== 'string' || !specialInstructions)) return cb(generateError(errors.invalidValue('order.specialInstructions', specialInstructions)))

    if (typeof deliveryLocation !== 'object' || deliveryLocation === null) return cb(generateError(errors.invalidValue('order.location', deliveryLocation)))

    const { address, latitude, longitude } = deliveryLocation
    if (typeof address !== 'string' || !address) return cb(generateError(errors.invalidValue('order.location.address', address)))

    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) return cb(generateError(errors.invalidValue('order.location.latitude', latitude)))

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) return cb(generateError(errors.invalidValue('order.location.longitude', longitude)))

    const { apiToken, id, platform, items, fixedPrice, pickupPlace, specialInstructions: pickupInstructions, googleMapsAPIKey } = this
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
        },
        price: fixedPrice ? fixedPrice.value : undefined
      }
      const url = new URL('https://api.shippify.co')
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
      .then(response => {
        if (response.status === 401) return cb(generateError(errors.unauthenticated()))
        return response.json()
        .then(json => {
          console.log(json)
          if (json.code === 'OK') return cb(null, json.payload.order)
          else return cb(generateError(errors.unknownError(new Error(json.code))))
        })
      }, error => cb(generateError(errors.unknownError(error))))
    })
  }
}

export default OrderManager
