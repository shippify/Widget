import OrderManager from './OrderManager'
import errors, { generateError } from './../errors'
import html from './../widget.html.js'

class Widget {
  constructor(orderManager, node) {
    if (!(orderManager instanceof OrderManager)) {
      throw generateError(errors.invalidValue('orderManager', orderManager))
    }
    if (!window.document.body.contains(node)) {
      throw generateError(errors.invalidValue('node', node))
    }
    this.orderManager = orderManager
    this.node = node
    this.order = {
      contact: {}
    }
    this.node.innerHTML = html
    this.onVehicleTypeChangeListener = window.document.getElementById('shpy-vehicle-type-select').addEventListener('change', event => {
      this.order.vehicleType = event.target.value ? event.target.value : undefined
    })
    this.onDeliveryAddressChangeListener = window.document.getElementById('shpy-delivery-address-input').addEventListener('keyup', event => {
      this.order.delivery.address = event.target.value ? event.target.value : undefined
    })
    this.onContactNameChangeListener = window.document.getElementById('shpy-delivery-contact-name-input').addEventListener('keyup', event => {
      this.order.contact.name = event.target.value ? event.target.value : undefined
    })
    this.onContactEmailChangeListener = window.document.getElementById('shpy-delivery-contact-email-input').addEventListener('keyup', event => {
      this.order.contact.email = event.target.value ? event.target.value : undefined
    })
    this.onContactPhoneChangeListener = window.document.getElementById('shpy-delivery-contact-phone-input').addEventListener('keyup', event => {
      this.order.contact.phone = event.target.value ? event.target.value : undefined
    })
    this.onSpecialInstructionsChangeListener = window.document.getElementById('shpy-delivery-special_instructions-input').addEventListener('keyup', event => {
      this.order.specialInstructions = event.target.value ? event.target.value : undefined
    })
    try {
      this.onOrderButtonClickListener = window.document.getElementById('shpy-order-button').addEventListener('click', () => {
        this.orderManager.generateOrder(this.order, (error, order) => {
          console.log(error)
          console.log(order)
        })
      })
    } catch (error) {
      console.log(error)
    }

    this.map = new window.google.maps.Map(window.document.getElementById('shpy-map-container'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    })
  }

  destroy() {
    this.order = null

    this.map = null

    this.onDeliveryAddressChangeListener.remove()
    this.onDeliveryAddressChangeListener = null
    this.onContactNameChangeListener.remove()
    this.onContactNameChangeListener = null
    this.onContactEmailChangeListener.remove()
    this.onContactEmailChangeListener = null
    this.onContactPhoneChangeListener.remove()
    this.onContactPhoneChangeListener = null
    this.onSpecialInstructionsChangeListener.remove()
    this.onSpecialInstructionsChangeListener = null

    this.node.innerHTML = ''
    this.node = null

    this.orderManager = null
  }
}

export default Widget
