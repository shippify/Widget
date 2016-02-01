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
new Widget().init({api_id: api_id, api_token: api_token, task: task},
  document.getElementById("canvas"), function (err, Widget) {
   if(err)
     return console.log(err);
   $(Widget).on("fare", function(event, price){
     console.log(price);
   });
   $(Widget).on("task", function(event, task){
     console.log(task);
   });
});