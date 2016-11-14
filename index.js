/*
	Widget.js
	Author : Leonardo Larrea <leonardo@shippify.co>
	Shippify Inc.
*/
/*
LANGUAGES
If you want support to more than languages, you can edit the lang.js file.
*/
var shippifyName=shippifyName?shippifyName:'Name';
var shippifyPlaceHolder=shippifyPlaceHolder?shippifyPlaceHolder:'Enter to Fullname';
var shippifyPhone=shippifyPhone?shippifyPhone:'Phone';
var shippifyValid=shippifyValid?shippifyValid:'Valid';
var shippifyInvalidNumber=shippifyInvalidNumber?shippifyInvalidNumber:'Invalid Number';
var shippifyDeliveryAddress=shippifyDeliveryAddress?shippifyDeliveryAddress:'Delivery Address';
var shippifyAddressPlaceHolder=shippifyAddressPlaceHolder?shippifyAddressPlaceHolder:'Address';
var shippifyAdditionalInfo=shippifyAdditionalInfo?shippifyAdditionalInfo:'Additional Info';
var shippifyAdditonalInformation=shippifyAdditonalInformation?shippifyAdditonalInformation:'Additional Information';
var shippifyPrice=shippifyPrice?shippifyPrice:'Shipping Price';
var shippifyEmail=shippifyEmail?shippifyEmail:'Email';
var shippifyEmailPlaceHolder=shippifyEmailPlaceHolder?shippifyEmailPlaceHolder:'Your Email';
var shippifyOK=shippifyOK?shippifyOK:'OK';
var shippifyDrawMe=shippifyDrawMe?shippifyDrawMe:'Drag me!'
var shippifyErrorLocationService=shippifyErrorLocationService?shippifyErrorLocationService:'The Geolocation service failed.';
var shippifyErrorLocationBrowser=shippifyErrorLocationBrowser?shippifyErrorLocationBrowser:'Your browser doesn\'t support geolocation.';


var defaultPrice='0,00';
var jsonData={};
var task={};
var company;
var deliveryMarker;
var eventTaskPrice;
var eventTaskReady;

var Widget = function (initConfig) {
	includeJQueryIfNeeded(function () {
		jsonData=initConfig;
		task=initConfig.task;
		loadHtml(initConfig.divById);
	});
	this.price=function(price){
		price=eventTaskPrice;
	}
	this.task= function(task){
		task=eventTaskReady;
	}
}
window.Widget = Widget;
function loadHtml(element){

	var contextHtml='<div id="widget_view_container" class="submenu_view">'+
		'<div id="shippify_container_widget">'+
			'<div class="widget_preview_container">'+
				'<div class="card widget_card">'+
					'<div class="widget_map_preview">'+
						'<div id="shippify_map_canvas"></div>'+
					'</div>'+
					'<div class="widget_body_preview">'+
						'<div class="one_col name_phone_div">'+
							'<div class="half_col shipperName_col">'+
								'<label for="shippify_name_field" class="label_title_h route_title_h " >'+shippifyName+'</label>'+
								'<input id="shippify_name_field" class="price_container_test validate line_elipsis" type="text" placeholder="'+shippifyPlaceHolder+'"/>'+
							'</div>'+
							'<div id="container_phone" class="half_col shipperName_col">'+
								'<label for="shippify_phone_field" class="label_title_h route_title_h">'+shippifyPhone+'</label>'+
									'<input id="shippify_phone_field" class="price_container_test line_elipsis validate" type="tel"/>'+
									'<span id="valid-msg" style="display:none;">✓ '+shippifyValid+'</span>'+
									'<span id="error-msg" style="display:none;">! '+shippifyInvalidNumber+'</span>'+
							'</div>'+
						'</div>'+
						((jsonData.showEmail==undefined||jsonData.showEmail!=undefined&&jsonData.showEmail==true)?''+
						'<div class="one_col shipperName_col">'+
							'<label for="shippify_email_field" class="label_title_h route_title_h">'+shippifyEmail+'</label>'+
								'<input id="shippify_email_field" class="price_container_test line_elipsis" type="text" placeholder="'+shippifyEmailPlaceHolder+'"/>'+
						'</div>':
						'')+
						// DELIVERY ADDRESS DIV
						'<div class="one_col">'+
							'<div>'+
								'<label for="shippify_address_field" class="label_title_h route_title_h">'+shippifyDeliveryAddress+'</label>'+
									'<input id="shippify_address_field" class="price_container_test line_elipsis" type="text" placeholder="'+shippifyAddressPlaceHolder+'"/>'+
								'</div>'+
							'</div>'+
							((jsonData.showAdditionalInfo==undefined||jsonData.showAdditionalInfo!=undefined&&jsonData.showAdditionalInfo==true)?''+
							'<div class="one_col shipperName_col">'+
								'<label for="shippify_additional_field" class="label_title_h route_title_h">'+shippifyAdditionalInfo+'</label>'+
									'<input id="shippify_additional_field" class="price_container_test line_elipsis" type="text" placeholder="'+shippifyAdditonalInformation+'"/>'+
							'</div>':
							'')+
						'</div>'+
						// SHIPPING PRICE
						((jsonData.showPrice==undefined||jsonData.showPrice!=undefined&&jsonData.showPrice==true)?''+
						'<div class="one_col price_col">'+
							'<span class="label_title_h route_title_h">'+shippifyPrice+'</span>'+
							'<br>'+
							'<div class="widget_price_label_container" >'+
								'<span class="widget_price" id="price">'+
									defaultPrice+
								'</span>'+
							'</div>'+
						'</div>':
						'')+
					'</div>'+
				'</div>'+ // Card
			'</div>'+// EO WIDGET PREVIEW CONTAINER
		'</div>'+ // EO VIEW BODY
	'</div>'; // EO REPORTS VIEW CONTAINER
	$('#'+element).append(contextHtml);
	$("shippify_map_canvas").ready(function() {
		appendGoogleMaps();
	});

	$('#shippify_additional_field').blur(function () {
	  task.extra = this.value;
	  eventTaskReady(task);
	});

	$('#shippify_name_field').blur(function () {
		if(!task.recipient){
			task.recipient={};
		}
		task.recipient.name = this.value;
	  eventTaskReady(task);
  });

	$("#shippify_phone_field").ready(function() {
		  var errorMsg = $("#error-msg");
		  var validMsg = $("#valid-msg");
      var telInput = $("#shippify_phone_field");
			//Add the file css for the flags in the phone input
			var link = document.createElement('link')
			link.setAttribute('rel', 'stylesheet')
			link.setAttribute('type', 'text/css')
			link.setAttribute('href', 'http://cdn.shippify.co/service/css/intlTelInput.css')
		 	document.getElementsByTagName('head')[0].appendChild(link)
		  $.getScript( "https://cdn.shippify.co/service/js/intlTelInput/utils.js" )
      	.done(function( script, textStatus ){
    		$.getScript( "https://cdn.shippify.co/service/js/intlTelInput/intlTelInput.min.js" )
    			.done(function( script, textStatus ){
			      telInput
			      .intlTelInput({
			        autoFormat: true,
			        autoHideDialCode: false,
			        autoPlaceholder: true,
			        defaultCountry: "auto",
						  geoIpLookup: function(callback) {
							   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
							     var countryCode = (resp && resp.country) ? resp.country : "";
							     callback(countryCode);
							   });
							},
			        nationalMode: true,
			        onlyCountries: ['cl', 'br', 'ec', 'mx','ar'],
							preferredCountries: ['ec'],
			        utilsScript: "https://cdn.shippify.co/service/js/intlTelInput/utils.js"
			      });
			      telInput.blur(function() {
			        if ($.trim(telInput.val())) {
			          if (telInput.intlTelInput("isValidNumber")) {
			            validMsg.show();
									errorMsg.hide();
			             var tmpTask = task;
			            if(tmpTask.recipient==undefined){
			              tmpTask.recipient={}
			            }
			            tmpTask.recipient.phone = this.value;
			            task = tmpTask;
			            $(Widget).trigger('task', task);
			          } else {
			            telInput.addClass("error");
			            errorMsg.show();
			            validMsg.hide();
			          }
			        }
			      });
			      telInput.keypress(function(event) {
			        if (event && event.keyCode && event.keyCode == '13') {//Enter Listener
			          if ($.trim(this.value) == ''){
			            this.value = (this.defaultValue ? this.defaultValue : '');
			          }
			          else{
			            if ($.trim(telInput.val())) {
			              if (telInput.intlTelInput("isValidNumber")) {
			                validMsg.show();
											errorMsg.hide();
			                var tmpTask = task;
			                if(tmpTask.recipient==undefined){
			                  tmpTask.recipient={}
			                }
			                tmpTask.recipient.phone = this.value;
			                task = tmpTask;
			                $(Widget).trigger('task', task);
			              } else {
			                telInput.addClass("error");
			                errorMsg.show();
			                validMsg.hide();
			              }
			            }
			          }
			        }
			      });
			      // on keydown: reset
			      telInput.keydown(function() {
			        telInput.removeClass("error");
			        errorMsg.hide();
			        validMsg.hide();
			      });
			})
	    .fail(function( jqxhr, settings, exception ) {
	      console.log('Problem with load javascript phone validate');
	    });
	  })
	  .fail(function( jqxhr, settings, exception ) {
	    console.log('Problem with load javascript phone validate');
	  });
	});
}
function appendGoogleMaps() {
	  if (typeof google === 'object' && typeof google.maps === 'object') {
		    handleMap();
	  } else {
				var script_tag = document.createElement('script');
				script_tag.setAttribute("type","text/javascript");
				script_tag.setAttribute("src","http://maps.google.com/maps/api/js?sensor=false&&libraries=places&callback=gMapsCallback"+(jsonData.googleMapKey?'&key='+jsonData.googleMapKey:''));
				(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
				$(window).bind('gMapsLoaded', handleMap);
	  }
}
function handleMap() {
	if(typeof map == 'undefined'||window['map'] == void 0){
    map = new google.maps.Map(document.getElementById("shippify_map_canvas"), {
      zoomControl: true,
      zoom: 15,
      styles: [
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#af3740"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
            {
              "saturation": -100
            },
            {
              "lightness": 65
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": 51
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
            {
              "saturation": -100
            },
            {
              "lightness": 30
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
            {
              "saturation": -100
            },
            {
              "lightness": 40
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "lightness": -25
            },
            {
              "saturation": -97
            },
            {
              "color": "#666666"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "lightness": -25
            },
            {
              "saturation": -100
            }
          ]
        }
      ]
    });
		map.setCenter({lat: parseFloat(task.pickup.lat), lng: parseFloat(task.pickup.lng)});

		if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
				if(deliveryMarker!=undefined&&deliveryMarker.dragging==false){
					addDeliveryMarker(new google.maps.LatLng(parseFloat(pos.lat),parseFloat(pos.lng)));
				}
      }, function() {
				var infoWindow = new google.maps.InfoWindow({map: map});
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
			var infoWindow = new google.maps.InfoWindow({map: map});
      handleLocationError(false, infoWindow, map.getCenter());
    }
    geocoder = new google.maps.Geocoder;
    bounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow;
		if(jsonData.allowGooglePlaces==undefined||(jsonData.allowGooglePlaces!=undefined&&jsonData.allowGooglePlaces==true)){
			var googleAutocompleteAddress = new google.maps.places.Autocomplete(document.getElementById("shippify_address_field"));
		  googleAutocompleteAddress.bindTo("bounds", map);
		}

    var preTask=task;
    if(preTask.delivery!=undefined&&preTask.delivery.lat!=undefined&&preTask.delivery.lng!=undefined&&parseFloat(preTask.delivery.lat)!=0&&parseFloat(preTask.delivery.lng)!=0){
      cityLocation = new google.maps.LatLng(parseFloat(preTask.delivery.lat), parseFloat(preTask.delivery.lng));
    }else{
			cityLocation = map.getCenter();
		}
    addDeliveryMarker(cityLocation);
    if(preTask.delivery!=undefined&&preTask.delivery.address!=undefined){
      $("#shippify_address_field").val(" "+preTask.delivery.address);
    }else{
      geocodeLatLng(cityLocation);
    }
    if(preTask.recipient!=undefined&&preTask.recipient.name!=undefined){
      $("#shippify_name_field").val(" "+preTask.recipient.name);
    }
    if(preTask.recipient!=undefined&&preTask.recipient.phone!=undefined){
      $("#shippify_phone_field").val(" "+preTask.recipient.phone);
    }
    if(preTask.extra!=undefined){
      var note=JSON.stringify(preTask.extra).note;
      $("#shippify_additional_field").val(" "+note);
    }
    getCalculo(cityLocation);
    bounds.extend(cityLocation);

    google.maps.event.addListener(googleAutocompleteAddress, "place_changed", function() {
      var place = googleAutocompleteAddress.getPlace();
      if (!place) {
        console.log("Some location error");
        return;
      }
      if (!place.geometry) {
        console.log("Some location error");
        return;
      }
      if (!place.geometry.location) {
        console.log("Some location error");
        return;
      }
      addDeliveryMarker(place.geometry.location);
    }, 0);
	}
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation?shippifyErrorLocationService:shippifyErrorLocationBrowser);
}
function includeJQueryIfNeeded(onSuccess) {
	if (typeof jQuery == 'undefined') {
		function getScript(url, onSuccess) {
			var script = document.createElement('script');
			script.src = url;

			var head = document.getElementsByTagName('head')[0];
			done = false;

			script.onload = script.onreadystatechange = function () {
				if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
					done = true;

					onSuccess();
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);

				}
			}
			head.appendChild(script);
		}

		getScript('http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', function() {
			if (typeof jQuery == 'undefined') {
				console.log("Not ready");
			} else {
				console.log("Ready");
				onSuccess();
			}
		});
	} else {
		console.log("Ready");
		onSuccess();
	}
}

function addDeliveryMarker(latLng){
  var deliveryLocation = new google.maps.LatLng(latLng.lat(),latLng.lng());
  if (deliveryMarker) {
    deliveryMarker.setMap(null);
    deliveryMarker = null;
  }
  var icon_delivery = 'https://cdn.shippify.co/service/images/marker.png';
  deliveryMarker = new google.maps.Marker({map: map, draggable: true,  title:shippifyDrawMe, icon: icon_delivery, animation: google.maps.Animation.DROP, position: deliveryLocation});
  bounds.extend(deliveryLocation);
  map.setCenter(bounds.getCenter());
  map.fitBounds(bounds);
  deliveryMarker.dragging=false;
  google.maps.event.addListener(deliveryMarker, 'dragend', function(){
		deliveryMarker.dragging=false;
    deliveryMarker.setAnimation(null);
    var markerLatLng = deliveryMarker.getPosition();
    geocodeLatLng(markerLatLng);
    getCalculo(markerLatLng);
  });

	google.maps.event.addListener(deliveryMarker, 'drag', function(){
		deliveryMarker.dragging=true;
  });

  getCalculo(deliveryLocation);
	animateBounce(deliveryMarker);
}

function geocodeLatLng(latLng) {
  var latlng = {lat: parseFloat(latLng.lat()), lng: parseFloat(latLng.lng())};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        $("#shippify_address_field").val(" "+results[0].formatted_address);
      } else {
        $("#shippify_address_field").val("");
      }
    } else {
      $("#shippify_address_field").val("");
    }
  });
}

function getCalculo(deliveryLocation){
  var tmpTask=task;
  tmpTask.delivery = {
    lat: deliveryLocation.lat(),
    lng: deliveryLocation.lng()
  };
	if(jsonData.allowWareHouse!=undefined&&jsonData.allowWareHouse==false){
		didClickSubmitInput();
	}else{
		var data = {location: {lat: deliveryLocation.lat(), lng: deliveryLocation.lng()}};
	  $.ajax({
	    type: "GET",
	    url: "https://api.shippify.co/companies/" + company + "/warehouses/nearest",
	    dataType: "json",
	    data: data,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Basic " + btoa("" + jsonData.credentials.apiId + ":" + jsonData.credentials.apiToken + ""));
	    },
	    success: function(response) {
	      if (response.errFlag != 0) {
	        console.log(response.errMsg);
	        return;
	      }
	      var tmpTask = task;
	      tmpTask.pickup = {
	        lat: response.data.lat,
	        lng: response.data.lng,
	        address: response.data.location.address
	      };
	      task = tmpTask;
			  didClickSubmitInput();
	    },
	    error: function (error) {
			  console.error(error.message);
	    }
	  });
	}
}

function didClickSubmitInput() {
  if (!deliveryMarker) {
    console.log("Missing parameters");
    return;
  }
  var size=3;
  var qty=1;
  var tmpTask=task;
  var items = (tmpTask.products || []);
  if (tmpTask.product!=undefined) {
    items.push(tmpTask.product);
  }
  items = items.map(function (i) {
    i.size = i.size || 3;
    i.qty = i.qty || 1;
    return i;
  });
  var data = [{pickup_location: {lat: jsonData.task.pickup.lat, lng: jsonData.task.pickup.lng}, delivery_location: {lat: deliveryMarker.position.lat(), lng: deliveryMarker.position.lng()},items: items}];
  $.ajax({
    type: "GET",
    url: "https://api.shippify.co/task/fare?data=" + encodeURIComponent(JSON.stringify(data)),
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa("" + jsonData.credentials.apiId + ":" + jsonData.credentials.apiToken + ""));
    },
    success: function(response) {
      if (response.errFlag != 0) {
        console.log('Error is :'+response.errMsg);
        return;
      }
      $("#price").text(response.currency + " " + response.price);
      fare=response.price;
      $(Widget).trigger('fare', response.price);
      $(Widget).trigger('task', task);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

function animateBounce() {
  if(deliveryMarker){
    deliveryMarker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){
		 deliveryMarker.setAnimation(null);
	 },2000);
  }
}

window.gMapsCallback = function(){
    $(window).trigger('gMapsLoaded');
}
