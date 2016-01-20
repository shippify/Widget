/*
	Widget.js should be called shippify.js
	Author :
	Shippify Inc.
*/


var Widget = function () {
	this.json;
	this.node;
	this.task;

	this.init = function (json, node, onSuccess) {
		this.json = json;
		this.node = node;

		includeJQueryIfNeeded(function () {
			var url = 'https://services.shippify.co';
			// if (typeof json.env === 'undefined' || json.env === 'production') {
			// 	url = 'https://services.shippify.co';
			// } else if (json.env === 'staging') {
			// 	url = 'http://staging.shippify.co';
			// } else if (json.env === 'development') {
			// 	url = 'http://localhost:8021';
			// } else {
			// 	url = json.env;
			// }

			$.ajax({
				method: 'GET',
				url: url + '/shippify/widget',
				data: { task : JSON.stringify(json.task)},
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa(json.api_id + ":" + json.api_token));
				},
				success: function (html) {
					$(node).html(html);
					onSuccess(null, Widget);
					widgetResize();
				},
				error: function (error) {
					console.log("error");
					onSuccess(error);
				}
			});
		});
	}
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
};

window.Widget = Widget;


function widgetResize() {

	var size = $("#widget_view_container").width();

	console.log("Resizing..." + size);
	if (size <= 1100) {
		console.log(1100);
		$("#shippify_phone_field").css("width", "41vw !important");
	}
	if (size <= 1000) {
		console.log(1000);
		$("#shippify_phone_field").css("width", "40vw !important");
	}
	if (size <= 900) {
		console.log(900);
		$("#shippify_phone_field").css("width", "40vw !important");
		$(".intl-tel-input").css("width", "3vw !important");
	}
	if (size <= 800) {
		console.log(800);
		$("#shippify_phone_field").css("width", "38vw !important");
		$(".intl-tel-input").css("width", "39vw !important");
	}
	if (size <= 700) {
		console.log(700);
		$("#shippify_phone_field").css("width", "37vw !important");
	}
	if (size <= 600) {
		console.log(600);
		$("html, body").css({ "height": "100%", "width": '100%', "margin": "0px", "padding": "0px", "overflow": "auto" });
		$(".shipperName_col").css("margin-top", "7px");
		$("#shippify_phone_field").css({"width": "28vw !important"});
		// $(".intl-tel-input").css("width", "90% !important");
	}
	if (size <= 550) {
		console.log(550);
		$("#shippify_phone_field").css("width", "33vw !important");
	}
	if (size <= 500) {
		console.log(500);
		$("#shippify_phone_field").css("width", "34vw !important");
	}
	if (size <= 450) {
		console.log(450);
		$("#shippify_phone_field").css("width", "32vw !important");
	}
	if (size <= 400) {
		console.log(400);
		$(".flag-container").css({ "position": 'relative !important', "top": "7px !important" });
		$(".delivery_col").css("margin-top", "25px");
		$(".price_col").css("margin-top", "10px");
		$("#shippify_phone_field").css({ "padding-left": '45px', "width": "32vw !important" });
		$("#reportsView_body .one_col .price_container_test").css({ "height": '15px', "font-size": "11px" });
		$(".intl-tel-input .selected-flag").css({ "padding": "0 0 0 2px" });
		$("#valid-msg, #error-msg ").css({ "font-size": "8px" });
	}
	if (size <= 370) {
		console.log(370);
		$("#shippify_phone_field").css({ "width": "35vw !important", "padding-left": '37px', "margin": '0' });
		$(".intl-tel-input .arrow").css({ "display": 'none' });
		$(".shipperName_col").css({ "margin-top": '0px' });
		$(".delivery_col").css({ "margin-top": '30px' });
		$("#shippify_name_field").css({ "margin-top": '2px' });
	}
	if (size <= 350) {
		console.log(350);
		$("#shippify_phone_field").css("width", "17vw !important");
	}
	if (size <= 300) {
		console.log(300);
		$("#shippify_phone_field").css("width", "27% !important");
		$(".intl-tel-input").css("width", "31vw !important");
	}
	if (size <= 250) {
		console.log(250);
		$("#reportsView_body .half_col").css("width", "100%");
		$("#shippify_phone_field").css("width", "74vw !important");
		$(".intl-tel-input input").css("width", "3vw !important");
	}
	if (size <= 225) {
		console.log(213);
		$("#shippify_phone_field").css("width", "72vw !important");
	}
	if (size <= 225) {
		console.log(225);
		$("#shippify_phone_field").css("width", "73vw !important");
	}
	if (size <= 213) {
		console.log(213);
		$("#shippify_phone_field").css("width", "72vw !important");
	}
	if (size <= 200) {
		console.log(200);
		$("#shippify_phone_field").css("width", "68vw !important");
	}
	if (size <= 175) {
		console.log(175);
		$("#shippify_phone_field").css("width", "63vw !important");
	}
	if (size <= 150) {
		console.log(150);
		$("#shippify_phone_field").css("width", "57vw !important");
		$("#shippify_name_field").css("margin-top", "2px");
		$(".intl-tel-input .arrow").css("display", "none");
		$(".intl-tel-input .selected-flag").css("padding", "0 0 0 2px");
	}
	if (size <= 140) {
		console.log(140);
		$("#shippify_phone_field").css("width", "57vw !important");
	}
	if (size <= 100) {
		console.log(100);
		$("#shippify_phone_field").css("width", "55vw !important");
	}
}
