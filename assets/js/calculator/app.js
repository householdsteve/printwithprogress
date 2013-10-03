/*global jQuery, Handlebars */
jQuery(function ($) {
	'use strict';

	var Utils = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			this.ENTER_KEY = 13;
			this.priceQuotes = Utils.store('pricequotes-jquery');
			this.activeStyle = {};
			this.cacheElements();
			this.bindEvents();
			this.render();
		},
		cacheElements: function () {
      // this.todoTemplate = Handlebars.compile($('#todo-template').html());
      // this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.$calcInstance = $('#calculator');
			this.$panelOne = this.$calcInstance.find('#collapseOne');
			this.$panelTwo = this.$calcInstance.find('#collapseTwo');			
			this.$garmentOptions = $('figure',this.$panelOne);
			this.$quantityInputs = $('input[type="number"]',this.$panelTwo);
		},
		bindEvents: function () {
			var panelOneInputs = this.$garmentOptions;
			panelOneInputs.on('click', this.toggleStyle);
			panelOneInputs.on('deactivate', this.deactivateStyle);
			
			var quantityInput = this.$quantityInputs;
			quantityInput.next().on('click','',{prntObject:quantityInput}, this.addColor);
			quantityInput.prev().on('click','',{prntObject:quantityInput}, this.removeColor);
		},
		render: function () {
      this.$garmentOptions.find('input').iCheck({
          checkboxClass: 'icheckbox_square-red',
          radioClass: 'iradio_square-red',
          increaseArea: '20%' // optional
        });
		},
		removeColor: function(e){
		  console.log(e.data)
		},
		addColor: function(e){
		  console.log(e.data)
		},
		activateStyle: function (e) {
		  var element = e;
		      element.css({opacity:0.5});
		      App.activeStyle = element;
		},
		deactivateStyle: function (e) {
		  var element = $(e.target);
		  element.css({opacity:1});
		  
		  // should remove object from right here too
	  },
		toggleStyle: function (e) {
		  e.stopImmediatePropagation();
			if(App.activeStyle.length > 0) App.activeStyle.trigger('deactivate');
			var element = $(this);
			App.activateStyle(element);
		},
		blurOnEnter: function (e) {
			if (e.which === App.ENTER_KEY) {
				e.target.blur();
			}
		}
	};

	App.init();
});
