import Widget from './classes/Widget'
import OrderManager from './classes/OrderManager'
import { Address, LatLng, Warehouse } from './classes/places'
import { platforms, vehicleTypes } from './constants'
import errors from './errors'

import bike from './images/icon_v_bike.svg';
import car from './images/icon_v_car.svg';
import moto from './images/icon_v_moto.svg';
import van from './images/icon_v_van.svg';
import truck from './images/icon_v_truck.svg';

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
 }
 const orderManagerOptions = {
   credentials: {
     apiId: 'my-shippify-api-id',
     apiSecret: 'my-shippify-api-secret'
   },
   // googleMapsAPIKey: 'my-google-maps-api-key'
 }
 const orderManager = new shippify.integrations.OrderManager(orderTemplate, orderManagerOptions)

const shippifyWidgetContainer = document.getElementById('root')
const widget = new shippify.integrations.Widget(orderManager, shippifyWidgetContainer)
