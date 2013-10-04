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
			this.positions = Array();
			this.garmentAttributes = {
              "tshirt": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt.png"
              },
              "pockettshirt": {
                "colors-front": "assets/img/calculator-templates/builder/pocket-tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/pocket-tshirt.png"
              },
              "vneckt": {
                "colors-front": "assets/img/calculator-templates/builder/vneck-tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/vneck-tshirt.png"
              },
              "longsleeve": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt-longsleeve.png", 
                "colors-back": "assets/img/calculator-templates/builder/back-longsleeve.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-longsleeve.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-longsleeve.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt-longsleeve.png"
              },
              "pocketlongsleeve": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt.png"
              },
              "polo": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt.png"
              },
              "ziphoodie": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt.png"
              },
              "pulloverhoodie": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt.png"
              },
              "custsupplied": {
                "colors-front": "assets/img/calculator-templates/builder/tshirt.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/tshirt.png"
              }

          }
          
			this.cacheElements();
			this.bindEvents();
			this.render();
		},
		cacheElements: function () {
			this.$calcInstance = $('#calculator');
		  this.$builderWell = $('#builder-well');
		  this.$builderWellContainer = $('.container',this.$builderWell);
      this.garmentTemplate = {
        "colors-front" : Handlebars.compile($('#garment-template').html()),
        "colors-back" : Handlebars.compile($('#garment-template').html()),
        "colors-left" : Handlebars.compile($('#garment-template').html()),
        "colors-right" : Handlebars.compile($('#garment-template').html()),
        "colors-other" : Handlebars.compile($('#garment-template').html()),
      }
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
			quantityInput.each(function(i,v){
			  var _s = $(this);
			  _s.next().on('click','',{prntObject:_s}, App.addColor);
  			_s.prev().on('click','',{prntObject:_s}, App.removeColor);
			});
			
		},
		render: function () {
      this.$garmentOptions.find('input').iCheck({
          checkboxClass: 'icheckbox_square-red',
          radioClass: 'iradio_square-red',
          increaseArea: '20%' // optional
        });
		},
		removeColor: function(e){
		  var el = e.data.prntObject, min = el.attr('min'), total;
		  total = parseInt(el.val())-1; 
		  if(total > min){
		    el.val(total);
		    App.updateBuilder({"action":"update","obj":el,"count":total});
		  }else{
		    el.val(min);
		    App.updateBuilder({"action":"remove","obj":el,"count":total});
		  } 
	  		
	  		  // remove items from builder well and update counts on corresponding elements colors.
		},
		addColor: function(e){
		  var el = e.data.prntObject, max = el.attr('max'), total;
		  if(el.val() < max){
		    total = parseInt(el.val())+1; el.val(total);
		    App.updateBuilder({"action":"update","obj":el,"count":total});
		  }else{
		    total = el.val();
		  } 
		  
		  
		  // we need to add control to change number on visualized garment
		  // we need to set a variable to check if this location is present and if not add it to builder well
		},
		updateBuilder: function(e) {
      var el = e.obj, name = el[0].name, garment = $('input[name=garmentType]:checked', this.$calcInstance).val();
		  switch(e.action){
		    case "update":
		    console.log($('input[name=garmentType]:checked', this.$calcInstance).val())
		    //this.garmentAttributes
    		  	var details = {
      				contentId: "builder_"+name,
      				contentClass: " "+name,
      				imgSrc: this.garmentAttributes[garment][name],
      				counter: e.count,
      				description: name
      			};
            if($.inArray(name,this.positions) < 0){
              this.positions.push(name);
              var current = this.garmentTemplate[name];
              var counterEl = current(details);
        			this.$builderWellContainer.append(current(details));
            }
            $('.counter-overlay',$("#builder_"+name)).text(e.count);

		    break;
		    case "remove":
		        this.positions = $.grep(this.positions, function(value) {
              return value != name;
            });
      			$("#builder_"+name).remove();
		    break;
		  }
		},
		activateStyle: function (e) {
		  var element = e;
		      element.css({opacity:0.5});
		      element.find('input').iCheck('toggle');
		      App.activeStyle = element;
		},
		deactivateStyle: function (e) {
		  var element = $(e.target);
		  element.css({opacity:1});
		  element.find('input').iCheck('toggle');
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
