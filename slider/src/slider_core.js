/**
 * 假设：
 * 1.依赖jquery库
 * 2.每个滑动单元大小都一样
 * 3.滑动格数不会大于滑动单元总数
 * 这是一个做滑动效果的核心模块，主要解决滑动问题，根据其可以扩展出不同形式的滑动效果
 */
/**
 * todo 要解决滑动轴 axial（横向，纵向）跟滑动方向（left right up down）的命名问题
 * todo calculatePosition 方法太大，如何拆解
 * todo 动态增加滑动item
 */
var mx_sliderCore = function(options) {

	this.canAnimate = true;
	this.init(options);

}

mx_sliderCore.prototype = {

	init: function(options) {

		this.initParams(options);
		this.initSliderSize();

	},

	initSliderSize: function() {

		var styles = {"horizontal": "width", "vertical": "height"};
		this.totalCount = this.sliderContainer.find(this.sliderItemSelect).size();
		this.sliderSize = this.unitSize * this.totalCount;
		this.sliderBox.css(styles[this.direction], this.sliderSize + "px");

	},

	initParams: function(options) {

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
		//滑动的速度，可以设置毫秒数和("slow", "normal", or "fast")
		this.animSpeed = options.animSpeed || "slow";
		//滑动完成后的回调函数
		this.animCallBack = options.animCallBack || function(){};

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

	slide: function(direction, count) {

		if(!this.beforeSlide())
		{
			return false;
		}

		var animatePosition = this.calculatePosition(direction, count);

		this.anim(animatePosition);

	},

	calculatePosition: function(direction, count) {

		var directions = {"horizontal": "left", "vertical": "top"};
		var directionGroup = {"horizontal": "left", "vertical": "up"};
		var positionStyle = directions[this.direction];
		var direction = direction || directionGroup[this.direction];
		var count = count || 1;
		var sliderSize = this.sliderSize;
		var viewCount = this.viewCount;
		var unitSize = this.unitSize;
		var sliderBox = this.sliderBox;
		var animSpeed = this.animSpeed;
		var sliderContainer = this.sliderContainer;
		var sliderItemSelect = this.sliderItemSelect;
		var currentPosition = this.fixPosition();
		var remainCount = this.calRemainCount(direction);
		var animatePosition, moveCount;

		if(direction === "left" || direction === "up") 
		{
			
			if((count - remainCount) > 0 )
			{
			
				moveCount = count - remainCount;
				animatePosition = currentPosition - unitSize*remainCount;
				sliderContainer.append(sliderContainer.find(sliderItemSelect).slice(0, moveCount));
				sliderBox.css(positionStyle, (currentPosition + unitSize*moveCount) + "px");
			
			}
			else
			{
			
				animatePosition = currentPosition - unitSize*count; 
			
			}

		}
		else
		{
			if((count - remainCount) > 0 ) 
			{
			
				moveCount = count - remainCount;
				animatePosition = currentPosition + unitSize*remainCount;
				sliderContainer.prepend(sliderContainer.find(sliderItemSelect).slice(0 - moveCount));
				sliderBox.css(positionStyle, (currentPosition - unitSize*moveCount) + "px");
			
			}
			else
			{
			
				animatePosition = currentPosition + unitSize*count;
			
			}
			
		}


		// if(direction === "left" || direction === "up") 
		// {
			
		// 	if((sliderSize + currentPosition - unitSize*(viewCount + count)) < 0 )
		// 	{
			
		// 		moveCount = (unitSize*(viewCount + count) - (sliderSize + currentPosition))/unitSize;
		// 		animatePosition = currentPosition - unitSize*(count - moveCount);
		// 		sliderContainer.append(sliderContainer.find(sliderItemSelect).slice(0, moveCount));
		// 		sliderBox.css(positionStyle, (currentPosition + unitSize*moveCount) + "px");
			
		// 	}
		// 	else
		// 	{
			
		// 		animatePosition = currentPosition -  unitSize*count; 
			
		// 	}

		// }
		// else
		// {
		// 	if((currentPosition + unitSize*count) > 0 ) 
		// 	{
			
		// 		moveCount = (currentPosition + unitSize*count)/unitSize;
		// 		animatePosition = currentPosition + unitSize*(count - moveCount);
		// 		sliderContainer.prepend(sliderContainer.find(sliderItemSelect).slice(0 - moveCount));
		// 		sliderBox.css(positionStyle, (currentPosition - unitSize*moveCount) + "px");
			
		// 	}
		// 	else
		// 	{
			
		// 		animatePosition = currentPosition + unitSize*count;
			
		// 	}
			
		// }

		return animatePosition;
	},

	calRemainCount: function(direction) {

		var currentPosition = this.fixPosition();
		var overCount = Math.abs(currentPosition/this.unitSize);

		if(direction === "left" || direction === "up")
		{
			return this.totalCount - this.viewCount - overCount;
		}
		else
		{
			return overCount;
		}

	},

	//为了修正ie下面获取滑块位置时出现的误差。
	fixPosition: function() {
		
		var directions = {"horizontal": "left", "vertical": "top"};
		var sliderBox = this.sliderBox;
		var direction = directions[this.direction];
		var position = sliderBox.position()[direction];
		var fixPosition = Math.round((position/this.unitSize)) * this.unitSize;
		this.sliderBox.css(direction, fixPosition + "px");
		return fixPosition;

	},

	anim: function(animatePosition) {

		this.canAnimate = false;

		if(this.direction === "horizontal")
		{

			this.sliderBox.animate({left: animatePosition +'px'}, this.animSpeed, "", $.proxy(this.afterSlide, this));

		}
		else
		{

			this.sliderBox.animate({top:  animatePosition +'px'}, this.animSpeed, "", $.proxy(this.afterSlide, this));

		}

	},

	beforeSlide: function() {

		return this.canAnimate;

	},

	afterSlide: function() {

		this.canAnimate = true;
		this.animCallBack.apply(this);

	}

}



