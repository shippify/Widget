# Shippify UI Widget

Shippify UI Widget for companies and plaforms - a toolkit for implementing Shippify's Last Mile Delivery API on the web through a friendly UI. It is designed to enable e-commerces of any size to quickly create, and dispatch orders, at checkout, to Shippify and confirm them for delivery the moment it is needed. It also makes it easy to customize the style files that render the widget and adjust them to e-commerces' personal needs.

## Installation
You can choose to install the Hub Framework either manually, or through a dependency manager (coming soon).

### Manually

**Requirements to build:** node >= 4 & npm >= 3

* Clone this repo.
* Run `npm install`.
* Run `npm run build`.
* Drag assets generated from `/build` directory and add them to your `html` file.

## Getting started

To enable you to quickly get started using the Shippify UI Widget, we've created a simple API to render the widget in your webpage with a few options.

The widget is powered by the logic housed in the `OrderManager` class.

### OrderManager

To initialize a manager there must be a configuration set as:

```javscript
  const widget = new window.shippify.integrations.OrderManager(orderTemplate, options) // DOMNode should be a DOM node container where the widget should be rendered.
```

An order template is an object that represents the order's and its pickup information which contains the following keys:
```javascript
{
  id: "my-order-id", // The merchant supplied order id backed in their system. (string, non-empty),
  platform: "vtex", // Only if e-commerce uses a shippify-integrated platform. (enum:platform, string, optional)
  items: [ // List of items to be delivered. (array, non-empty)
    name: "Shoes", // (string)
    size: 2, // (enum:packageSize, integer),
    quantity: 10 // (integer, gte-1)
  ],
  pickupPlace: new window.shippify.places.Address("Rua Curitiba - Lourdes, Belo Horizonte - State of Minas Gerais, Brazil"), // Business or pickup location. (class:Place, object, optional)
  specialInstructions: "Ring the bell for apartment 2B, ask for Carol." // In-app instructions for your business's location for the courier. (string, optional)
}
```

The OrderManager includes options as permissions and credentials provided by Shippify API and/or external sources.
```javascript
{
  credentials: { // Shippify API credentials for your e-commerce. (object)
    apiId: "my-shippify-api-id", // (string, non-empty),
    apiSecret: "my-shippify-api-secret", // (string, non-empty),
  },
  googleMapsAPIKey: "my-google-maps-api-key" // Google Maps API key for better geocoding (string, non-empty, optional)
}
```

### Place

The `Place` class conforms to the location protocol for Shippify Places. Different options allow the user to represent their locations in an easy way. Places can be:

* Physical addresses can be included as `window.shippify.places.Address("Rua Curitiba - Lourdes, Belo Horizonte - State of Minas Gerais, Brazil")`
* Coordinates as `window.shippify.places.LatLng(-19.929416, -43.944240)`
* Warehouses or depots added to the Shippify platform to your business can be represented using their issued id as `window.shippify.places.Warehouse(777)`

### Widget

