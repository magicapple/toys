var mx_sliderBase = function(containerId, options, sliderOptions) {

	var options = options || {};
	var sliderOptions = sliderOptions || {};
	this.containerId = containerId;
	this.canAutoSlide = true;
	this.init(options, sliderOptions);
}

mx_sliderBase.prototype = {

	init: function(options, sliderOptions) {

		this.initParams(options);
		this.initSlider(sliderOptions);
		this.initEvent();

	},

	initEvent: function() {

		$("#"+ this.containerId).hover($.proxy(this.disableAutoSlide, this), $.proxy(this.enableAutoSlide, this));

	},

	disableAutoSlide: function() {

		this.canAutoSlide = false;

	},

	enableAutoSlide: function() {

		this.canAutoSlide = true;

	},

	initSlider: function(sliderOptions) {

		var options = {

			axial: this.axial,
			unitSize: this.unitSize,
			sliderBox: $("#"+ this.containerId +" .slider_list"),
			sliderContainer: $("#"+ this.containerId +" .slider_list ul"),
			sliderItemSelect: "li"

		};

		$.extend(options, sliderOptions);

		this.slider = new mx_sliderCore(options);

	},

	initParams: function(options) {

		this.axial = options.axial || "horizontal";
		this.animDirection = options.animDirection || "left";
		this.count = options.count || 1;
		this.intervalTime = options.intervalTime || 3000;
		this.unitSize = options.unitSize || this.getUnitSize();
		this.animInterval = null; 

	},

	getUnitSize: function() {

		var selectItem = $("#"+ this.containerId +" .slider_list ul li");
		if(this.axial === "horizontal")
		{
			return selectItem.width();
		}
		else
		{
			return selectItem.height();	
		}

	},

	start: function() {

		if(!this.animInterval)
		{
			this.animInterval = setInterval($.proxy(this.anim, this), this.intervalTime);
		}

	},

	anim: function() {

		if(this.canAutoSlide)
		{
			this.slider.slide(this.animDirection, this.count);
		}

	},

	stop: function() {

		clearInterval(this.animInterval);
		this.animInterval = null;
		
	}

}






