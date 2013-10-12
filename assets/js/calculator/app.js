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
                "colors-front": "assets/img/calculator-templates/builder/pocket-tshirt-longsleeve.png", 
                "colors-back": "assets/img/calculator-templates/builder/back-longsleeve.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-longsleeve.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-longsleeve.png",
                "colors-other": "assets/img/calculator-templates/builder/pocket-tshirt-longsleeve.png"
              },
              "polo": {
                "colors-front": "assets/img/calculator-templates/builder/polo.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-shirt.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-tshirt.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-tshirt.png",
                "colors-other": "assets/img/calculator-templates/builder/polo.png"
              },
              "ziphoodie": {
                "colors-front": "assets/img/calculator-templates/builder/hoodie-zip.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-hoodie.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-hoodie.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-hoodie.png",
                "colors-other": "assets/img/calculator-templates/builder/hoodie-zip.png"
              },
              "pulloverhoodie": {
                "colors-front": "assets/img/calculator-templates/builder/hoodie-pullover.png", 
                "colors-back": "assets/img/calculator-templates/builder/generic-back-hoodie.png",
                "colors-left": "assets/img/calculator-templates/builder/left-sleeve-hoodie.png", 
                "colors-right": "assets/img/calculator-templates/builder/right-sleeve-hoodie.png",
                "colors-other": "assets/img/calculator-templates/builder/hoodie-pullover.png"
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
      this.itemTemplate = Handlebars.compile($('#item-template').html());
      this.savingsTemplate = Handlebars.compile($('#savings-template').html());
      this.$savings = $('#savings');
			this.$panelOne = this.$calcInstance.find('#collapseOne');
			this.$panelTwo = this.$calcInstance.find('#collapseTwo');
			this.$panelThree = this.$calcInstance.find('#collapseThree');		
			this.$panelArray = Array(this.$panelOne,this.$panelTwo,this.$panelThree);
			this.$garmentOptions = $('figure',this.$panelOne);
			this.$quantityInputs = $('input[type="number"]',this.$panelTwo);
			this.$tableResults = $('#apiResults');	
		},
		bindEvents: function () {
			var panelOneInputs = this.$garmentOptions;
			panelOneInputs.on('click', this.toggleStyle);
			panelOneInputs.on('deactivate', this.deactivateStyle);
			panelOneInputs.on('mouseover', this.garmentHoverOver);
			panelOneInputs.on('mouseout', this.garmentHoverOut);
			
			this.$panelOne.prev().on('click','',{prntObject:this.$panelOne}, this.togglePanel);
			this.$panelTwo.prev().on('click','',{prntObject:this.$panelTwo}, this.togglePanel);
			this.$panelThree.prev().on('click','',{prntObject:this.$panelThree}, this.togglePanel);
			
			var quantityInput = this.$quantityInputs;
			quantityInput.each(function(i,v){
			  var _s = $(this);
			  _s.next().on('click','',{prntObject:_s}, App.addColor);
  			_s.prev().on('click','',{prntObject:_s}, App.removeColor);
			});
			
			this.$calcInstance.on("submit",function(e){return false;}).validate({
        errorElement:"em",
        rules: {
            qty:{
              number:true
            }
          },
        submitHandler: function(form) {
          App.processForm(form);
          return false;
        }
       });
		},
		render: function () {
       
       this.$panelTwo.find('input').iCheck({
                 checkboxClass: 'icheckbox_square-blue',
                 radioClass: 'iradio_square-blue',
                 increaseArea: '20%' // optional
               });
		},
		processForm: function(form){
		  $.ajax({
    					url: 'calculate.php',
  						data: $(form).serialize() + '&meth=send',
  						type: 'post',
  						cache: false,
  						dataType: 'json',
  						error: function(){alert('didnt work, try agin in a sec.');},
  						success:App.refreshTables
    		  });
		},
		refreshTables: function(data){
		  console.log(data.items[0].upsell);
		  App.$panelThree.prev().trigger('click');
		  App.$tableResults.empty().html(App.itemTemplate(data));
		  
		  if(data.items[0].upsell){
        App.$savings.hide().html(App.savingsTemplate(data.items[0].upsell)).delay(2000).fadeIn(400);
      }
      $('.catalog').magnificPopup({type:'iframe'});   
		},
		togglePanel: function(e){
		  e.stopImmediatePropagation();
      $(e.currentTarget).addClass('open');
		  var el = e.data.prntObject;
		  $.each(App.$panelArray,function(i,v){
		    if($(this).hasClass('in')){
		      $(this).collapse('hide');
		      $(this).prev().removeClass('open');
		    } 
		  })
		  el.collapse('show');
		  //return false;
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
		},
		addColor: function(e){
		  var el = e.data.prntObject, max = el.attr('max'), total;
		  if(el.val() < max){
		    total = parseInt(el.val())+1; el.val(total);
		    App.updateBuilder({"action":"update","obj":el,"count":total});
		  }else{
		    total = el.val();
		  } 
		},
		updateBuilder: function(e) {
      var el = e.obj, name = el[0].name, garment = $('input[name=garmentType]:checked', this.$calcInstance).val();
		  switch(e.action){
		    case "update":
    		  	var details = {
      				contentId: "builder_"+name,
      				contentClass: " "+name,
      				imgSrc: this.garmentAttributes[garment][name],
      				counter: e.count,
      				description: el.parent().prev().text()
      			};
            if($.inArray(name,this.positions) < 0){
              this.positions.push(name);
              var current = this.garmentTemplate[name];
              var counterEl = current(details);
        			this.$builderWellContainer.append(current(details));
            }
            
            $('.counter-overlay',$("#builder_"+name)).text(e.count);

		    break;
		    case "refresh":
		      if(this.positions.length < 1){
  		      this.$builderWellContainer.empty().data("garment",garment).addClass(garment);
  		      this.addColor({"data":{"prntObject":$(this.$quantityInputs[0])}});
  		    }else{
  		      var dg = this.$builderWellContainer.data("garment");
  		      this.$builderWellContainer.removeClass(dg).addClass(garment).data("garment",garment);
  		    } 
		    
		      this.$quantityInputs.each(function(i,v){
		        if($.inArray(this.name,App.positions) >= 0){
              $("#builder_"+this.name+" img").attr("src",App.garmentAttributes[garment][this.name]);
		        }
		      })
		    break;
		    case "remove":
		        this.positions = $.grep(this.positions, function(value) {
              return value != name;
            });
      			$("#builder_"+name).remove();
		    break;
		  }
		},
		garmentHoverOver: function(e){
		  var element = $(this);
		  //element.css({opacity:0.8});
		},
		garmentHoverOut: function(e){
		  var element = $(this);
		  //element.css({opacity:1});
		},
		activateStyle: function (e) {
		  var element = e;
		      element.css({opacity:0.5});
		      element.find('input').iCheck('toggle');
		      App.activeStyle = element;
		      //this.$panelOne.collapse('hide');
		      //this.$panelTwo.collapse('show');
		      this.$panelTwo.prev().trigger('click');
		      App.updateBuilder({"action":"refresh","obj":$(this.$quantityInputs[0])});
		},
		deactivateStyle: function (e) {
		  var element = $(e.target);
		  element.css({opacity:1});
		  //element.find('input').iCheck('toggle');
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
