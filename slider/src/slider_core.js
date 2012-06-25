/**
 * 假设：
 * 1.依赖jquery库
 * 2.每个滑动单元大小都一样
 * 3.滑动格数不会大于滑动单元总数
 * 这是一个做滑动效果的核心模块，主要解决滑动问题，根据其可以扩展出不同形式的滑动效果
 */
var sliderCore = function(options) {

	this.canAnimate = true;
	this.init(options);

}

sliderCore.prototype = {

	init: function(options) {

		//设置滑动方向：horizontal vertical 
		this.direction = options.direction || "horizontal";
		//可视的滑动单元数量
		this.viewCount = options.viewCount || 1; 
		//滑动单元滑动方向的单位长度
		this.unitSize = options.unitSize;
		//滑动块（是指定滑动的元素的jQuery对象）
		this.sliderBox = this.initSliderBox(options.sliderBox);
		//滑动单元的容器（这个可以跟滑动块是一样的，也可以是滑动块内部的元素，之所以跟滑动块分开，是方便html布局）
		this.sliderContainer = this.initSliderContainer(options.sliderContainer);
		//声明滑动单元的选择符，以便于通过this.sliderContainer.find(this.sliderItemSelect)来选择所有的滑动单元
		//这里有个陷阱，由于程序里面会对滑动单元进行dom的移动操作，所以不能在这里直接存储dom或者jquery对象，会造成后续的操作产生错误。
		this.sliderItemSelect = options.sliderItemSelect;
		
		this.initSliderSize();

	},

	initSliderSize: function() {

		var styles = {"horizontal": "width", "vertical": "height"};
		var count = this.sliderContainer.find(this.sliderItemSelect).size();
		this.sliderSize = this.unitSize * count;
		this.sliderBox.css(styles[this.direction], this.sliderSize + "px");

	},

	initSliderContainer: function(sliderContainer) {

		if(typeof sliderContainer === "string")
		{
			return this.sliderBox.find(sliderContainer);
		}
		return sliderContainer;

	},

	initSliderBox: function(sliderBox) {

		if(typeof sliderBox === "string")
		{
			return $(sliderBox);
		}
		return sliderBox;

	},

	//为了修正ie下面获取
	fixPosition: function() {
		
		var directions = {"horizontal": "left", "vertical": "top"};
		var sliderBox = this.sliderBox;
		var direction = directions[this.direction];
		var position = sliderBox.position()[direction];

		return Math.round((position/this.unitSize)) * this.unitSize;

	},

	slide: function(direction, count) {

		var directions = {"horizontal": "left", "vertical": "top"};
		var positionStyle = directions[this.direction];
		var direction = direction || directions[this.direction];
		var count = count || 1;
		var sliderSize = this.sliderSize;
		var viewCount = this.viewCount;
		var unitSize = this.unitSize;
		var sliderBox = this.sliderBox;
		var sliderContainer = this.sliderContainer;
		var sliderItemSelect = this.sliderItemSelect;
		
		if(!this.canAnimate)
		{
			// a_animat.push([direction,count]);
			return;
		}

		var currentPosition = this.fixPosition();
		var animatePosition;

		if(direction === "left" || direction === "top") 
		{
			
			if((sliderSize + currentPosition - unitSize*(viewCount + count)) < 0 )
			{
			
				var moveCount = (unitSize*(viewCount + count) - (sliderSize + currentPosition))/unitSize;
				sliderContainer.append(sliderContainer.find(sliderItemSelect).slice(0, moveCount));
				sliderBox.css(positionStyle, (currentPosition + unitSize*moveCount) + "px");
				animatePosition = currentPosition - unitSize*(count - moveCount);
			
			}
			else
			{
			
				animatePosition = currentPosition -  unitSize*count; 
			
			}

		}
		else
		{
			if((currentPosition + unitSize*count) > 0 ) 
			{
			
				var moveCount = (currentPosition + unitSize*count)/unitSize;
				sliderContainer.prepend(sliderContainer.find(sliderItemSelect).slice(0 - moveCount));
				sliderBox.css(positionStyle, (currentPosition - unitSize*moveCount) + "px");
				animatePosition = currentPosition + unitSize*(count - moveCount);
			
			}
			else
			{
			
				animatePosition = currentPosition + unitSize*count;
			
			}
			
		}

		this.canAnimate = false;
		var _this = this;
		if(this.direction === "horizontal")
		{

			sliderBox.animate({left: animatePosition +'px'}, "slow","", function(){
				_this.canAnimate = true;
			});

		}
		else
		{

			sliderBox.animate({top: animatePosition +'px'}, "slow","", function(){
				_this.canAnimate = true;
			});


		}

	}

}



