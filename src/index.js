import Widget from './classes/Widget'
import OrderManager from './classes/OrderManager'
import { Address, LatLng, Warehouse } from './classes/places'
import { platforms, vehicleTypes } from './constants'
import errors from './errors'

window.shippify = {
  integrations: {
    platforms,
    errors,
    places: {
      Address,
      LatLng,
      Warehouse,
    },
    OrderManager,
    Widget,
  }
}

  var pickupPlace = new window.shippify.integrations.places.Address('Guayaquil, EC')
  var orderManagerOptions = {
    credentials: {
      apiId: 'a',
      apiSecret: 's'
    }
  }

  try {
    var orderManager = new window.shippify.integrations.OrderManager({
      id: 'order-reference-id',
      platform: window.shippify.integrations.platforms.VTEX,
      pickupPlace,
    }, orderManagerOptions)

    new window.shippify.integrations.Widget(orderManager, document.getElementById('root'))
    orderManager.generateOrder({ id: 'order-reference-id', contact: { name: 'json', phone: '23' }, location: { address: 'john', latitude: 90, longitude: -180 }, vehicleType: vehicleTypes.CAR }, (error, json) => {
      console.log(error)
      console.log(json)
    })
    console.log(orderManager)
  } catch (error) {
    console.log(error.meta)
  }
