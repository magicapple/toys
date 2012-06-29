/**
 * todo 整理initEvent 将事件中的函数抽取成方法。 ok
 */

var mx_sliderArrow = function(containerId, options, sliderOptions) {

	var options = options || {};
	var sliderOptions = sliderOptions || {};
	this.containerId = containerId;
	this.canAutoSlide = true;
	this.init(options, sliderOptions);
}

mx_sliderArrow.prototype = {

	init: function(options, sliderOptions) {

		this.initParams(options);
		this.initSlider(sliderOptions);
		this.initEvent();
		this.initArrowStatus();

	},

	initParams: function(options) {

		this.loop = options.loop || "loop";
		this.axial = options.axial || "horizontal";
		this.animDirection = options.animDirection || "left";
		this.count = options.count || 1;
		this.intervalTime = options.intervalTime || 3000;
		this.unitSize = options.unitSize || this.getUnitSize();
		this.animInterval = null; 

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

	initEvent: function() {

		$("#" + this.containerId).hover($.proxy(this.disableAutoSlide, this), $.proxy(this.enableAutoSlide, this));
		$("#" + this.containerId + " .arrow_handle").click($.proxy(this.arrowHandleCallBack, this));

	},

	disableAutoSlide: function() {

		this.canAutoSlide = false;

	},

	enableAutoSlide: function() {

		this.canAutoSlide = true;

	},

	arrowHandleCallBack: function(event){

		var elm = event.target;

		if($(elm).hasClass("arrow_disable")){

			return;

		}

		var dir = $(elm).attr("data-dir");

		if(this.loop === "loop")
		{

			this.slider.slide(dir, this.count);

		}
		else
		{
			
			this.resetArrowStatus();
			this.setArrowNextStatus(dir);
			var remainCount = this.slider.calRemainCount(dir);
			var moveCount = remainCount > this.count ? this.count : remainCount;
			this.slider.slide(dir, moveCount);

		}		

	},

	resetArrowStatus: function(){

		$("#" + this.containerId + " .arrow_handle").removeClass("arrow_disable");

	},

	setArrowNextStatus: function(dir){

		var remainCount = this.slider.calRemainCount(dir);
		if(remainCount <= this.count)
		{
			$("#" + this.containerId + " .arrow_handle[data-dir='"+ dir +"']").addClass("arrow_disable");
		}

	},

	initArrowStatus: function() {

		if(this.loop === "loop")
		{
			return;
		}
		$("#" + this.containerId + " .arrow_handle").each($.proxy(this.initCurrentArrowStatus,this));

	},

	initCurrentArrowStatus: function(index, elm) {

		var dir = $(elm).attr("data-dir");
		var remainCount = this.slider.calRemainCount(dir);
		if(remainCount <= 0)
		{
			$(elm).addClass("arrow_disable");
		}

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
