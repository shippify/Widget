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
			var url = 'https://api.shippify.co';
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
