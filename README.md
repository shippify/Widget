# Widget
Shippify UI Widget for companies and plaforms that implement and consume out Last Mile Delivery API.

![Shippify Widget](images/widget.png)

## Installation
### Bower
[Bower](bower.io) is a dependency package manager for Web projects. You can install out widget module from Bower with the following command:
```shell
bower install shippify-widget
```
## How to use this widget?
Our widget has 2 modules, before and after checkout.

### Before checkout
This widget should be located at the moment of checkout in order to get the client's information for a successful delivery (e.g., name, phone, dropoff address). At this moment, the widget has created an order in our platform which awaits confirmation.

### After checkout
After the checkout process is completed, a confirmation should be sent to our platofrm so that a task is created via the order's reference id. Otherwise, if the order is not confirmed in a 30 days time, it expires.

## Getting started
To add the widget, you should define the DOM node container where you want render the widget.

```javascript
var configuration = {
  containerId: 'canvas', // DOM node container id
  credentials: {apiId: 'XXXXXXXXXXXXXXXXXX', apiToken: 'XXXXXXXXXXXXXXXXXXX'},
  initialInfo: initialInfo, // Task template (e.g., pickup location)
  allowNearbyWarehouse: [true|false],
  showFieldEmail: [true|false],
  showAdditionalInfo: [true|false],
  showPrice: [true|false],
  googleMapKey: undefined, // Optional google maps key
  allowGooglePlaces: [true|false]
}
var widget = new Widget(configuration)
```

### Configuration
Shippify uses API keys to allow access to the API. You can get an API key pair signing in your account at [admin portal](https://admin.shippify.co/settings)

The following parameters are required for the configuration widget:

- ```containerId``` - The id from the DOM element where the widget should be rendered.
- ```credentials: {apiId: 'XXXXXXXXXXXXXXXXXX', apiToken: 'XXXXXXXXXXXXXXXXXXX'}``` - Company's API credentials from Shippify.
- ```initialInfo: [Object]``` - Initial task information object.
- ```allowNearbyWarehouse: [true|false]``` - Shippify will set the company's nearest warehouse as pickup location if the location is not manually specified.
- ```showFieldEmail: [true|false]``` - If you need to get the client to include email you can set this field to optionally exclude the email field.
- 

### Listeners
Must be located inside the handler function.

```javascript
widget.price(function(price) {
  console.log(price)
})
widget.task(function(task) {
  console.log(task)
})
```

---
## Sample

### HTML
```html
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
        html, body { height: 100%; margin: 0; padding: 0; }
        #canvas_widget {
            width: 300px;
        }
    </style>
    <link rel="stylesheet" href="./custom.css" />
  </head>
  <body>
    <script type="text/javascript" src="./.."></script>
    <div id="canvas_widget"></div>
    <script type="text/javascript" src="."></script>
  </body>
</html>
```

### CSS
```css
<style type="text/css">
.widget_card {
    width: 100%;
    background: white; /*Edit Background Color*/
    color: black; /*Edit Text Color*/
}

/*This class define the map preview container of the widget*/
.widget_map_preview {
    height: 158px;
    border-bottom: 3px solid #EC161E; /*Edit Divider Line Color*/
}

/*This class define the price container of the widget*/
.widget_price_label_container {
    height: 35px;
    width: 100%;
    background: #f2f2f2; /*Edit Price Container Background Color*/
    padding: 4px;
    text-align: center;
    margin-bottom: 10px;
}

/*This class define the price text of the widget*/
.widget_price {
    font-size: 18px;
    font-weight: 900;
    color: #858585; /*Edit Price Text Color*/
}
</style>
```


### Javascript
Remember to replace the API keys for your company!

```javascript
<script type="text/javascript">
// APIs
var api_id = "i7oyoo6kvllf035pm7r885mi"; // Insert your API id
var api_token = "e71c001ddf31475500e3fad9fca5fff4"; // Insert your API token

// Task Object (Optional)
var task = {
  product: {
    id: "0945", // Product Id (Optional)
    name: "Shoes Brazil",
    qty: 4,
    size: 3 // 1: Extra-Small; 2: Small; 3 - Medium; 4 - Large; 5 - Extra-Large
  },
  recipient: {
    name: "Leonardo Larrea",
    email: "luislp06@gmail.com",
  }, // Default recipient information
  pickup: {
    lat: "-2.158448",
    lng: "-79.899463",
    address: "Maracaibo, 456, y la Rua"
  }, // Default pickup location information
  delivery: {
    lat: "-2.154503",
    lng: "-79.907359",
    address: "Carbono, 456, y la Rua"
  } // Default delivery location information
};
$('#canvas_widget').ready(function() {
  new Widget().init({ api_id: api_id, api_token: api_token, task: task },
    document.getElementById("canvas_widget"),
    function(err, Widget) {
      if (err)
        return console.log(err);
      $(Widget).on("fare", function(event, price) {
        console.log(price);
      });
      $(Widget).on("task", function(event, task) {
        console.log(task);
      });
    });
});
</script>
```
