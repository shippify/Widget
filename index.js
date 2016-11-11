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
var shippifyOK=shippifyOK?shippifyOK:'OK';
var shippifyErrorLocationService=shippifyErrorLocationService?shippifyErrorLocationService:'The Geolocation service failed.';
var shippifyErrorLocationBrowser=shippifyErrorLocationBrowser?shippifyErrorLocationBrowser:'Your browser doesn\'t support geolocation.';

var defaultPrice='0,00';
var jsonData={};
var task={};

var Widget = function () {
	this.init = function (json, nodeId, onSuccess) {
		includeJQueryIfNeeded(function () {
			jsonData=json;
			task=jsonData.task;
			loadHtml(nodeId);
  	});
	}
}
window.Widget = Widget;
function loadHtml(element){

	var contextHtml='<div id="widget_view_container" class="submenu_view">'+
		'<div id="reportsView_body">'+
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
						'<br>'+
						// DELIVERY ADDRESS DIV
						'<div class="one_col delivery_col">'+
							'<div>'+
								'<label for="shippify_address_field" class="label_title_h route_title_h">'+shippifyDeliveryAddress+'</label>'+
									'<input id="shippify_address_field" class="price_container_test line_elipsis" type="text" placeholder="'+shippifyAddressPlaceHolder+'"/>'+
								'</div>'+
							'</div>'+
							'<div class="one_col shipperName_col">'+
								'<label for="shippify_additional_field" class="label_title_h route_title_h">'+shippifyAdditionalInfo+'</label>'+
									'<input id="shippify_additional_field" class="price_container_test line_elipsis" type="text" placeholder="'+shippifyAdditonalInformation+'"/>'+
							'</div>'+
						'</div>'+
						// SHIPPING PRICE
						'<div class="one_col price_col">'+
							'<span class="label_title_h route_title_h">'+shippifyPrice+'</span>'+
							'<br>'+
							'<div class="widget_price_label_container" >'+
								'<span class="widget_price" id="price">'+
									defaultPrice+
								'</span>'+
							'</div>'+
						'</div>'+
						// OK Button
						'<button  style="display: none;" id="shippify_ship_button" class="waves-effect waves-light ok_btn">'+shippifyOK+'</button>'+
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
	  $(Widget).trigger('task', task);
	});

	$('#shippify_name_field').blur(function () {
		task.recipient.name = this.value;
	  $(Widget).trigger('task', task);
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
			        utilsScript: "https://cdn.shippify.co/service/js/intlTelInput/utils.js"
			      });
			      telInput.blur(function() {
			        if ($.trim(telInput.val())) {
			          if (telInput.intlTelInput("isValidNumber")) {
			            validMsg.show();
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
				script_tag.setAttribute("src","http://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback"+(jsonData.googleMapKey?'&key='+jsonData.googleMapKey:''));
				(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
				$(window).bind('gMapsLoaded', handleMap);
	  }
}
function handleMap() {
	if(typeof map == 'undefined'||window['map'] == void 0){
    map = new google.maps.Map(document.getElementById("shippify_map_canvas"), {
			center: {lat: parseFloat(jsonData.task.pickup.lat), lng: parseFloat(jsonData.task.pickup.lng)},
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

		if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
      }, function() {
				var infoWindow = new google.maps.InfoWindow({map: map});
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
			var infoWindow = new google.maps.InfoWindow({map: map});
      handleLocationError(false, infoWindow, map.getCenter());
    }
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

window.gMapsCallback = function(){
    $(window).trigger('gMapsLoaded');
}
