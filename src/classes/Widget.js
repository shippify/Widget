import OrderManager from './OrderManager'
import errors, { generateError } from './../errors'
import translations, { messageIds } from './../translations'
import widgetTemplate from './../widget.ejs'

class Widget {
  constructor(orderManager, node, { excludedFields = [], preferredLanguage } = {}) {
    if (!(orderManager instanceof OrderManager)) {
      throw generateError(errors.invalidValue('orderManager', orderManager))
    }
    if (!window.document.body.contains(node)) {
      throw generateError(errors.invalidValue('node', node))
    }
    if (!Array.isArray(excludedFields)) {
      throw generateError(errors.invalidValue('options.excludedFields', excludedFields))
    }
    if (typeof preferredLanguage !== 'undefined' && typeof preferredLanguage !== 'string') {
      throw generateError(errors.invalidValue('options.preferredLanguage', preferredLanguage))
    }
    this.orderManager = orderManager
    this.node = node
    this.order = {
      contact: {}
    }
    const navigatorLanguage = preferredLanguage || (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage
    const languageTwoLetterCode = navigatorLanguage.includes('-') ? navigatorLanguage.split('-')[0] : navigatorLanguage
    const language = Object.keys(translations).indexOf(languageTwoLetterCode) !== -1 ? languageTwoLetterCode : 'en'
    this.node.innerHTML = widgetTemplate({ excludedFields, messageIds, messages: translations[language] })

    const { document, google } = window
    const mapContainer = document.getElementById('shpy-map-container')
    const deliveryLocationInput = document.getElementById('shpy-delivery-address-input')
    const bikeButton = document.getElementById('shpy-bike-button')
    const motoButton = document.getElementById('shpy-moto-button')
    const carButton = document.getElementById('shpy-car-button')
    const vanButton = document.getElementById('shpy-van-button')
    const truckButton = document.getElementById('shpy-truck-button')
    const contactNameInput = document.getElementById('shpy-delivery-contact-name-input')
    const contactEmailInput = document.getElementById('shpy-delivery-contact-email-input')
    const contactPhoneInput = document.getElementById('shpy-delivery-contact-phone-input')
    const specialInstructionsInput = document.getElementById('shpy-delivery-special_instructions-input')
    const deliveryAddressErrorPrompt = document.getElementById('shpy-delivery-address-error')
    const contactNameErrorPrompt = document.getElementById('shpy-contact-name-error')
    const contactEmailErrorPrompt = document.getElementById('shpy-contact-email-error')
    const contactPhoneErrorPrompt = document.getElementById('shpy-contact-phone-error')

    const map = new google.maps.Map(mapContainer, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 15
    })
    const searchBox = new google.maps.places.SearchBox(deliveryLocationInput)
    const marker = new google.maps.Marker({ map, draggable: true })
    const geocoder = new google.maps.Geocoder()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        const position = { lat: latitude, lng: longitude }
        marker.setPosition(position)
        map.setCenter(position)
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const { formatted_address: address, geometry: { location: { lat, lng } } } = results[0]
            const location = {
              address,
              latitude: lat(),
              longitude: lng()
            }
            this.order.location = location
            deliveryLocationInput.value = address
          } else {
            this.order.location = null
            deliveryLocationInput.value = ''
          }
        })
      }, error => console.log(error.code));
    } else {
      console.log('This browser does not support geolocation.');
    }

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
      map.setZoom(15)
      marker.setPosition(place.geometry.location)
    })
    this.onMarkerPositionChangeListener = marker.addListener('dragend', () => {
      const position = marker.getPosition()
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const { formatted_address: address, geometry: { location: { lat, lng } } } = results[0]
          const location = {
            address,
            latitude: lat(),
            longitude: lng()
          }
          this.order.location = location
          deliveryLocationInput.value = address
        } else {
          this.order.location = null
          deliveryLocationInput.value = ''
        }
      })
    })

    this.map = map
    this.searchBox = searchBox
    this.marker = marker

    const deselectVehicleButtons = () => {
      bikeButton.classList.remove('shpy__vehicle-bar__option--selected')
      motoButton.classList.remove('shpy__vehicle-bar__option--selected')
      carButton.classList.remove('shpy__vehicle-bar__option--selected')
      vanButton.classList.remove('shpy__vehicle-bar__option--selected')
      truckButton.classList.remove('shpy__vehicle-bar__option--selected')
    }

    this.onBikeButtonListener = bikeButton.addEventListener('click', event => {
      const isSelected = event.target.classList.contains('shpy__vehicle-bar__option--selected')
      deselectVehicleButtons()
      if (!isSelected) {
        event.target.classList.add('shpy__vehicle-bar__option--selected')
      }
      this.order.vehicleType = !isSelected ? event.target.getAttribute('data-vehicle-type') : undefined
    })
    this.onMotoButtonListener = motoButton.addEventListener('click', event => {
      const isSelected = event.target.classList.contains('shpy__vehicle-bar__option--selected')
      deselectVehicleButtons()
      if (!isSelected) {
        event.target.classList.add('shpy__vehicle-bar__option--selected')
      }
      this.order.vehicleType = !isSelected ? event.target.getAttribute('data-vehicle-type') : undefined
    })
    this.onCarButtonListener = carButton.addEventListener('click', event => {
      const isSelected = event.target.classList.contains('shpy__vehicle-bar__option--selected')
      deselectVehicleButtons()
      if (!isSelected) {
        event.target.classList.add('shpy__vehicle-bar__option--selected')
      }
      this.order.vehicleType = !isSelected ? event.target.getAttribute('data-vehicle-type') : undefined
    })
    this.onVanButtonListener = vanButton.addEventListener('click', event => {
      const isSelected = event.target.classList.contains('shpy__vehicle-bar__option--selected')
      deselectVehicleButtons()
      if (!isSelected) {
        event.target.classList.add('shpy__vehicle-bar__option--selected')
      }
      this.order.vehicleType = !isSelected ? event.target.getAttribute('data-vehicle-type') : undefined
    })
    this.onTruckButtonListener = truckButton.addEventListener('click', event => {
      const isSelected = event.target.classList.contains('shpy__vehicle-bar__option--selected')
      deselectVehicleButtons()
      if (!isSelected) {
        event.target.classList.add('shpy__vehicle-bar__option--selected')
      }
      this.order.vehicleType = !isSelected ? event.target.getAttribute('data-vehicle-type') : undefined
    })
    this.onContactNameChangeListener = contactNameInput.addEventListener('keyup', event => {
      if (event.keyCode == '9') return
      this.order.contact.name = event.target.value ? event.target.value : undefined
      if (event.target.value) {
        contactNameErrorPrompt.classList.add('shpy__message_tooltip--hidden')
      } else {
        contactNameErrorPrompt.classList.remove('shpy__message_tooltip--hidden')
      }
    })
    if (contactEmailInput) {
      const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      this.onContactEmailChangeListener = contactEmailInput.addEventListener('keyup', event => {
        if (event.keyCode == '9') return
        const email = event.target.value
        this.order.contact.email = email ? email : undefined
        if (emailRegex.test(email)) {
          contactEmailErrorPrompt.classList.add('shpy__message_tooltip--hidden')
        } else {
          contactEmailErrorPrompt.classList.remove('shpy__message_tooltip--hidden')
        }
      })
    }
    this.onContactPhoneChangeListener = contactPhoneInput.addEventListener('keyup', event => {
      if (event.keyCode == '9') return
      this.order.contact.phone = event.target.value ? event.target.value : undefined
      if (event.target.value) {
        contactPhoneErrorPrompt.classList.add('shpy__message_tooltip--hidden')
      } else {
        contactPhoneErrorPrompt.classList.remove('shpy__message_tooltip--hidden')
      }
    })
    this.onSpecialInstructionsChangeListener = specialInstructionsInput.addEventListener('keyup', event => {
      this.order.specialInstructions = event.target.value ? event.target.value : undefined
    })
  }

  generateOrder(cb) {
    this.orderManager.generateOrder(this.order, cb);
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

    this.onBikeButtonListener.remove()
    this.onBikeButtonListener = null
    this.onMotoButtonListener.remove()
    this.onMotoButtonListener = null
    this.onCarButtonListener.remove()
    this.onCarButtonListener = null
    this.onVanButtonListener.remove()
    this.onVanButtonListener = null
    this.onTruckButtonListener.remove()
    this.onTruckButtonListener = null

    this.onDeliveryAddressChangeListener.remove()
    this.onDeliveryAddressChangeListener = null
    this.onContactNameChangeListener.remove()
    this.onContactNameChangeListener = null
    if (this.onContactEmailChangeListener) {
      this.onContactEmailChangeListener.remove()
      this.onContactEmailChangeListener = null
    }
    this.onContactPhoneChangeListener.remove()
    this.onContactPhoneChangeListener = null
    this.onSpecialInstructionsChangeListener.remove()
    this.onSpecialInstructionsChangeListener = null

    this.node.innerHTML = ''

    // this.orderManager = null
  }
}

export default Widget
