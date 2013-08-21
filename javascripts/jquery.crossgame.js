/*
 *  jQuery Boilerplate - v3.3.1
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {
	// undefined is used here as the undefined global variable in ECMAScript 3
	// is
	// mutable (ie. it can be changed by someone else). undefined isn't really
	// being
	// passed in so we can ensure the value of it is truly undefined. In ES5,
	// undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than
	// global
	// as this (slightly) quickens the resolution process and can be more
	// efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "crossGame", defaults = {
		serverUri : 'ws://localhost:8080',
		nbRow: 10,
		nbCol: 10,
	};

	var connection = null;

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first
		// object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
		this.initConnection();
	}

	Plugin.prototype = {
		init : function() {
			var table = $("<table>");
			var tbody = $("<tbody>").appendTo(table);
			for ( var r = 0; r <= this.settings.nbRow; r++) {
				var trow = $("<tr>");
				for ( var c = 0; c <= this.settings.nbCol; c++) {
					var inputHidden = $("<input type='hidden'/>").val("r"+r+"c"+c);
					var td = $("<td>")
						.addClass("r"+r+"c"+c)
						.click(function(){
							connection.send($(this).children('input[type=hidden]').val());
							$(this).addClass('blue');
						})
						.append(inputHidden)
						.appendTo(trow);
				}
				trow.appendTo(tbody);
			}
			table.appendTo($(this.element));
		},
		initConnection : function() {
			connection = new WebSocket(this.settings.serverUri);
			connection.onopen = function(e) {
				console.log("Connection established!");
			};
			connection.onmessage = function(e) {
				jQuery('.' + e.data).addClass('red');
			};
		},
		bindClick : function() {
			$(this.element).find('td').click(function() {
				connection.send($(this).children('input[type=hidden]').val());
				$(this).addClass('blue');
			});
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this
				.each(function() {
					if (!$.data(this, "plugin_" + pluginName)) {
						$.data(this, "plugin_" + pluginName, new Plugin(this, options));
					}
				});
	};

})(jQuery, window, document);
