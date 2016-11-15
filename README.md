# Widget
A Shippify UI Widget which implements and consumes the Last Mile Delivery API.

![Shippify Widget](images/widget.png)

## Installation
### Bower
[Bower](bower.io) is a dependency package manager for Web projects. You can install it with the following command:
```shell
bower install shippify-widget
```
## How to use this widget?
Basically you need to complete 2 steps, before checkout and after checkout.

### 1 Step (Before Checkout)
You can add this widget in the checkout section to get the client's information for a successful delivery like the  name, phone number, physical address, geolocation, etc. Then when you get this information, you can pass to next step.

### 2 Step (After Checkout)
When you get this information, and all the checkout process is completed then you can use the API to create this task in the Shippify System.

## Initialization
To add the widget, you should define the DOM node container where you want render the widget.

```javascript
var configuration={
    containerId:'canvas', //DOM node container
    credentials:{apiId:'XXXXXXXXXXXXXXXXXX',apiToken:'XXXXXXXXXXXXXXXXXXX'}, //Container
    initialInfo:initialInfo,  //Data initial to get the final task.
    allowNearbyWarehouse:true,
    showFieldEmail:true,
    showAdditionalInfo:true,
    showPrice:true, 
    googleMapKey:undefined,// You can to add your google Maps key
    allowGooglePlaces:true
}
var widget = new Widget(configuration);// Constructor.

```

### Configuration
Shippify uses API keys to allow access to the API. You can get an API key pair signing in your account at [admin portal](https://admin.shippify.co/settings)

The next parameters are required for the configuration widget

- ```containerId``` - The id from DOM element where you want to add the widget.
- ```credentials:{apiId:'XXXXXXXXXXXXXXXXXX',apiToken:'XXXXXXXXXXXXXXXXXXX'}``` - Company's API credentials from Shippify.
- ```initialInfo:[Object]``` - Initial information object.
- ```allowNearbyWarehouse:[true|false]``` - Shippify will set nearest warehouse as pickup location, otherwise specify the pickup address manually.
- ```showFieldEmail:[true|false]``` - If you need to get the email to send when you create the task and send  the shippify tracking email to get more user experience.
- 

### Listeners
Must be located inside the handler function.

```javascript
widget.price(function(price){
  console.log(price);
});
widget.task(function(task){
  console.log(task);
});
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
