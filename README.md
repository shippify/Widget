# Shippify UI Widget

Shippify UI Widget for companies and plaforms - a toolkit for implementing Shippify's Last Mile Delivery API on the web through a friendly UI. It is designed to enable e-commerces of any size to quickly create, and dispatch orders, at checkout, to Shippify and confirm them for delivery the moment it is needed. It also makes it easy to customize the style files that render the widget and adjust them to e-commerces' personal needs.

## Installation
You can choose to install the Shippify UI Widget either manually, or through a dependency manager (coming soon).

### Manually

* Clone this repo.
* Go inside project directory
* Run `npm install`.

```bash
# Go to directory where project should be cloned
git clone https://github.com/shippify/Widget.git
cd Widget
npm install
```

## Building 

### Requirements to build

* node >= 4
* npm >= 3

**Sandbox**

Sandbox mode works well for development. Once the development server has started (see steps below), any file in /src can be modified and customized to your specific needs and will cause a process of linting and rendering on your browser.

The approach of hot-module reloading (HMR) allows a fast and safe experience at the moment of coding.

* Uncomment commented lines in src/index.js and fill with e-commerce specific information.
* Run `npm start` at root directory. (If browser does not open automatically, open http://localhost:3000)

```bash
# Inside project directory
npm start
```

## Getting started

To enable you to quickly get started using the Shippify UI Widget, we've created a simple API to render the widget in your webpage with a few options.

The widget is powered by the logic housed in the `OrderManager` class.

### OrderManager

To initialize a manager there must be a configuration set as:

```javscript
const orderManager = new window.shippify.integrations.OrderManager(orderTemplate, options) // DOMNode should be a DOM node container where the widget should be rendered.
```

An order template is an object that represents the order's and its pickup information which contains the following keys:
```javascript
{ // Order template (object)
  id: "my-order-id", // The merchant supplied order id backed in their system. (string, non-empty),
  platform: "vtex", // Only if e-commerce uses a shippify-integrated platform. (enum:platform, string, optional)
  items: [ // List of items to be delivered. (array, non-empty)
    name: "Shoes", // (string)
    size: 2, // (enum:packageSize, integer),
    quantity: 10 // (integer, gte-1)
  ],
  pickupPlace: new window.shippify.places.Address("Rua Curitiba - Lourdes, Belo Horizonte - State of Minas Gerais, Brazil"), // Business or pickup location. (class:Place, object, optional)
  specialInstructions: "Ring the bell for apartment 2B, ask for Carol.", // In-app instructions for your business's location for the courier. (string, optional)
  fixedPrice: { // Set a fixed shipping price (object, optional)
    value: 3.14, // (float, gte-1),
    currencyCode: "USD" // (iso4217, string)
  }
}
```

The OrderManager includes options as permissions and credentials provided by Shippify API and/or external sources.
```javascript
{ // Options (object)
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

The `Widget` class is responsible for creating the UI for creating an order based on the client's dropoff information. Widget uses an `OrderManager` instance and renders the widget in a DOM node container.

```javascript
const widget = new window.shippify.integrations.Widget(orderManager, document.getElementById("my-shippify-widget"))
```

**Confirming an order:**

Once the client click your checkout button, call `widget.generateOrder`. This method will parse the fields and if everything is correct will create an order in the Shippify platform.

```javascript
widget.generateOrder((error, order) => {
  console.log(error)
  console.log(order)
})
```

An order, if the request is successful, will return with the following schema:

```javascript
{
  order: { // (object)
    id: "321", // (string)
    href: "https://api.shippify.co/orders/321" // Url to get the created order details. (string)
  }
}
```

**Destroying the widget**

For deiniting the widget once the confirmation is successful only call `widget.destroy()`.

## Deploying

**Production**

When you have finished customizing the widget for your needs or the default implementation is good enough for you, it's time to generate a production build. Through a series of scripts, we create an optimized and minified build of /src contents that define the widget behavior and appearance.

To create this bundle:

* Run `npm run build` at root directory.
* Drag assets generated from `/build` directory and add them to your server's public folder.
* Add the necessary tags in you `html` file.

```bash
# Inside project directory
npm run build
```

## Platforms

This section is only necessary if your e-commerce is using a sales platform which has integration with the Shippify API. At the moment Shippify has successfully integrated with the following platforms:

```javascript
window.shippify.integrations.platforms = {
  VTEX, JUMPSELLER
}
```

## Errors

All constructors and actions made by the classes: `Place`, `OrderManager`, `Widget` can throw errors if the input information is missing or invalid. Shippify has streamlined errors with information about the reason of the failure and how to correct them.

These errors have `code`, `message` properties to identify the error and its description. In many cases, the errors will also have a `meta` property if more info is necessary.

### Types

|Code|Description|
|----|-----------|
|`invalid_value`|An input parameter was missing or invalid. Please check the documentation for the proper values.|
|`geocoding_failure`|Shippify uses Google Maps API to geocode addresses and coordinates provided. If specifying a warehouse id from Shippify provokes this error, then such id is invalid.|
|`unauthenticated`|The Shippify API credentials provided are missing, or incorrect.|
|`unknown_error`|An unknown error has occurred. Commonly this refers to connectivity problems.|
