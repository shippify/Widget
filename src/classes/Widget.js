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

    const { document, google } = window
    const mapContainer = document.getElementById('shpy-map-container')
    const deliveryLocationInput = document.getElementById('shpy-delivery-address-input')

    const map = new google.maps.Map(mapContainer, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 13
    })
    const searchBox = new google.maps.places.SearchBox(deliveryLocationInput)
    const marker = new google.maps.Marker({ map })

    this.onMapBoundsChangeListener = map.addListener('idle', () => {
      searchBox.setBounds(map.getBounds())
    })
    this.onSearchBoxPlaceChangeListener = searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces()
      if (!places.length) return
      const place = places[0]
      if (!place.geometry) return
      const { formatted_address: address, geometry: { location: { lat, lng } } } = place
      const location = {
        address,
        latitude: lat(),
        longitude: lng()
      }
      this.order.location = location

      map.setCenter(place.geometry.location)
      map.setZoom(13)
      marker.setPosition(place.geometry.location)
    })

    this.map = map
    this.searchBox = searchBox
    this.marker = marker

    const vehicleTypeSelect = document.getElementById('shpy-vehicle-type-select')
    const contactNameInput = document.getElementById('shpy-delivery-contact-name-input')
    const contactEmailInput = document.getElementById('shpy-delivery-contact-email-input')
    const contactPhoneInput = document.getElementById('shpy-delivery-contact-phone-input')
    const specialInstructionsInput = document.getElementById('shpy-delivery-special_instructions-input')
    const orderButton = document.getElementById('shpy-order-button')

    this.onVehicleTypeChangeListener = vehicleTypeSelect.addEventListener('change', event => {
      this.order.vehicleType = event.target.value ? event.target.value : undefined
    })
    this.onContactNameChangeListener = contactNameInput.addEventListener('keyup', event => {
      this.order.contact.name = event.target.value ? event.target.value : undefined
    })
    this.onContactEmailChangeListener = contactEmailInput.addEventListener('keyup', event => {
      this.order.contact.email = event.target.value ? event.target.value : undefined
    })
    this.onContactPhoneChangeListener = contactPhoneInput.addEventListener('keyup', event => {
      this.order.contact.phone = event.target.value ? event.target.value : undefined
    })
    this.onSpecialInstructionsChangeListener = specialInstructionsInput.addEventListener('keyup', event => {
      this.order.specialInstructions = event.target.value ? event.target.value : undefined
    })
    this.onOrderButtonClickListener = orderButton.addEventListener('click', () => {
      try {
        this.orderManager.generateOrder(this.order, (error, success) => {
          console.log(error)
          if (error) return
          console.log(success)
        })
      } catch (error) {
        console.log(error)
      }
    })
  }

  destroy() {
    this.order = null

    this.onSearchBoxPlaceChangeListener.remove()
    this.onSearchBoxPlaceChangeListener = null
    this.onMapBoundsChangeListener.remove()
    this.onMapBoundsChangeListener = null

    this.marker.setMap(null)
    this.marker = null
    this.searchBox = null
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
