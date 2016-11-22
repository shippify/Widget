import Widget from './classes/Widget'
import OrderManager from './classes/OrderManager'
import { Address, LatLng, Warehouse } from './classes/places'
import { platforms, vehicleTypes } from './constants'
import errors from './errors'

import './style.css';

window.shippify = {
  vehicleTypes,
  errors,
  places: {
    Address,
    LatLng,
    Warehouse,
  },
  integrations: {
    platforms,
    OrderManager,
    Widget,
  }
}
 const { shippify } = window

 const pickupPlace = new shippify.places.Address('Av. 9 de Octubre, Guayaquil, EC')
 const orderTemplate = {
   id: 'my-platform-reference-id',
   platform: shippify.integrations.platforms.VTEX,
   pickupPlace,
   items: [
     { name: 'Dog', size: 3, quantity: 10 }
   ],
 }
 const orderManagerOptions = {
   credentials: {
     apiId: 'i7p0cengnryk96fzip9442t9',
     apiSecret: 'ivl7uv01q46j38fr'
   },
   // googleMapsAPIKey: 'my-google-maps-api-key'
 }
 const orderManager = new shippify.integrations.OrderManager(orderTemplate, orderManagerOptions)

const shippifyWidgetContainer = document.getElementById('root')
const widget = new shippify.integrations.Widget(orderManager, shippifyWidgetContainer, {
  excludedFields: ['email']
})
