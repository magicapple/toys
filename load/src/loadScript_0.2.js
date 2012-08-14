// todo 加载css资源 ok
// todo 添加global地址，即global资源会在所有资源以前加载，用来降低依赖写法的复杂程度。ok
// todo 地址命名的管理。是否需要定义基础path，方便url的拼接？是否需要对url定义变量或者别名，比如jquery = "http://172.30.23.71/lib/juqery.1.4.4-min.js"。
// todo 整个代码中，逻辑嵌套有些复杂，需要优化
(function(headLoad, win){


	win.mx_load = {
		
		// 运行在脚本加载后马上将runList中normal数组中的脚本进行异步加载和执行操作。
		// todo 要不要改成autoRun
		autoLoad: true,

		// 存放要加载url的对象列表，属性如下：
		// loadMap[url] 地址为为 key 值
		// {
		// 		state: (notLoaded | loading | loaded) 文件当前的状态 (未加载 | 加载中 | 加载完成)
		// 		relyMap: 当前文件依赖其他文件的地址对象列表
		// }
		loadMap: {},

		// 存放要加载的css的url对象列表。
		cssList: [],

		// 存放执行函数的数组，每个数组项的属性如下：
		// {
		// 		fn: 存放执行函数的地方
		// 		state: (notRun | hasRun)
		// 		relyList: 此执行函数需要依赖的文件地址数组
		// }
		// 
		callbackList: [],

		// 全局脚本，比如引入jquery，以免每次load和add都要进入。
		globalScript: headLoad.globalScript || [],

		// 需要运行的暂存对象。
		runList: headLoad.runList || {normal: []},

		// 为fn绑定指定作用域，如果后面还有参数，则为fn的参数。
		bind: function(fn, scope) {

			var argOut = Array.prototype.slice.call(arguments, 2);

			return function(){

				// 链接返回函数的参数，组成新的参数数组。
				var arg = ([]).concat.apply(argOut, arguments);
				fn.apply(scope, arg);

			}

		},

		/**
		 * 增加一条等待执行的任务，options参数如下
		 * @param {Object} options 对象参数----------------具体内容如下：
		 * @param {String} name 此执行内容所属的分类名，如果没有定义，则会被归为normal分类中
		 * @param {String} url script地址列表，可以是字符串，多于一个的时候可以是一个数组。
		 * @param {String} css css的地址列表，可以是字符串，多于一个的时候可以是一个数组。
		 * @param {Function} callback 资源加载完后的回调函数。
		 */
		add: function(options) {

			if(typeof options.name === "undefined")
			{
				this.runList.normal.push(options);
			}
			else
			{

				if(typeof this.runList[options.name] === "undefined")
				{
					this.runList[options.name] = [];
				}

				this.runList[options.name].push(options);

			}

		},

		/**
		 * 执行某分类下的任务	
		 * @param  {String} name 分类名称，如果为"all"，则执行全部，如果为空，则执行"normal"下的
		 * @param  {Number} time 延迟多少执行，默认为0毫秒
		 */
		run: function(name, time) {

			var time = time || 0;
			setTimeout(this.bind(this.runCallback, this, name), time);

		},

		// 执行回调
		// name为任务分类名称，如果为"all"，则执行全部，如果为空，则执行"normal"下的
		runCallback: function(name) {

			if(typeof name === "undefined")
			{
				name = "normal";
			}

			if(name === "all")
			{
				for(name in this.runList)
				{
					this.runOne(name);
				}
			}
			else
			{
				
				if(typeof this.runList[name] !== "undefined")
				{
					this.runOne(name); 
				}
				
			}

		},

		// 将一个分类下面的任务进行load
		runOne: function(name) {

			var list = this.runList[name];

			while(list.length > 0)
			{
				//边清空，边load。
				var loadCommand = list.shift();
				this.load(loadCommand);
			}

		},

		/**
		 * 加载资源
		 * @param {Object} options 对象参数 ------------具体如下：
		 * @param {Array | String} url 地址列表，可以是数组，如果只有一个地址，可以为字符串
		 * 地址列表的规则：
		 * a.单一文件时使用字符串
		 * b.[a.js, b.js, c.js] 这时后面的js依赖前面的，即b.js依赖a.js；c.js依赖a.js和b.js
		 * c.[[a.js, b.js], c.js] 这时a.js和b.js为并发加载，没有相互依赖的关系，c.js依赖a.js与b.js
		 * d.数组深度只能到二维，更复杂的不做，感觉也没有必要。
		 * @param {Function} callback 加载完脚本后发生回调的函数
		 * @param {Boolean} useGlobalScript 是否使用全局定义的脚本 默认为使用 true。
		 */
		load: function(options) {

			var useGlobalScript = (typeof options.useGlobalScript === "undefined" || options.useGlobalScript === true) ? true : false;
			
			if(typeof options.url !== "undefined")
			{
				var css = options.css || [];
				//todo 这种依赖回头有可能去掉。
				this.updateLoadList(options.url, useGlobalScript, css);
			}

			if(typeof options.css !== "undefined")
			{
				this.updateCssList(options.css);
			}

			if(typeof options.callback === "function")
			{
				this.upateCallbackList(options, useGlobalScript);
			}

			this.beginLoad();
			this.beginCallback();
			this.beginLoadCss();

		},

		//更新LoadMap
		//todo 这里需要把updateLoadList 改为 updateLoadMap
		updateLoadList: function(urls, useGlobalScript, css) {

			if(typeof urls === "string")
			{
				this.updateOneLoad(urls, [], useGlobalScript, css);
			}
			else
			{
				for(var i = 0 , iLen = urls.length; i < iLen; i++ )
				{
					var url = urls[i];

					if(typeof url === "string")
					{
						this.updateOneLoad(url, urls.slice(0, i), useGlobalScript, css);
					}
					else
					{
						for(var j = 0, jLen = url.length; j < jLen; j++)
						{
							this.updateOneLoad(url[j], urls.slice(0, i), useGlobalScript, css);
						}
					}

				}
			}

		},

		//更新一个url
		updateOneLoad: function(url, relyList, useGlobalScript, relyCssList) {

			if(typeof this.loadMap[url] === "undefined")
			{
				this.loadMap[url] = {state: "notLoaded", relyMap: {}, useGlobalScript: useGlobalScript, relyCss: []};
			}

			var relyArray = this.linearArray(relyList);

			//todo 这个地方逻辑应该不用这么复杂，url的依赖应该不会增加。
			//todo 考虑是否将relyMap转换成relyList，因为map里面没有啥可以存的。
			for(var i = 0, iLen = relyArray.length; i < iLen; i++)
			{
				var rely = relyArray[i];

				if(typeof this.loadMap[url].relyMap[rely] === "undefined")
				{
					this.loadMap[url].relyMap[rely] = {state: "rely"};
				}

			}

			// var relyCssArray = this.linearArray(relyCssList);
			this.loadMap[url].relyCss = this.loadMap[url].relyCss.concat(this.linearArray(relyCssList));

		},

		//更新cssList
		updateCssList: function(css) {

			var canUpdate = true;
			for(var i = 0, iLen = this.cssList.length; i < iLen; i++)
			{
				var o = this.cssList[i];
				if(o.url === css)
				{
					canUpdate = false;
				}
			}

			if(canUpdate)
			{
				this.cssList.push({
					url: css,
					state: "notLoaded"
				})
			}

		},

		//更新回调函数列表
		upateCallbackList: function(options, useGlobalScript) {

			var relyArray = this.linearArray(options.url);
			this.callbackList.push({
				fn: options.callback,
				relyList: relyArray,
				state: "notRun",
				useGlobalScript: useGlobalScript
			});

		},

		//将二维数组转为一维数组
		linearArray: function(nestArray) {

			if(typeof nestArray !== "undefined" )
			{
				if(nestArray instanceof Array)
				{
					return ([]).concat.apply([], nestArray);
				}
				else
				{
					return [nestArray];
				}
				
			}
			else
			{
				return [];
			}

		},

		//开始加载
		beginLoad: function() {

			for( url in this.loadMap)
			{
				var oneLoad = this.loadMap[url];
				// console.log(oneLoad);

				if(oneLoad.state === "notLoaded")
				{
					var canLoad = true;

					if(oneLoad.useGlobalScript)
					{
						canLoad = this.scanGlobalScript();
					}

					if(canLoad)
					{
						
						if(oneLoad.relyCss.length > 0)
						{
							canLoad = this.scanRelyCss(oneLoad);
						}

					}

					for( rely in oneLoad.relyMap)
					{
						
						// console.log(rely);
						// console.log(this.loadMap[rely].state);
						if(this.loadMap[rely].state !== "loaded")
						{
							canLoad = false;
							break;
						}

					}

					if(canLoad === true)
					{
						this.loadMap[url].state = "loading";
						this.loadScript(url);
					}

				}

			}

		},

		// 扫描需要依赖的css
		// todo 有可能不需要进行。
		scanRelyCss: function(oneLoad) {
			
			var canLoad = true;
			var list = oneLoad.relyCss;
			for(var i = 0, iLen = list.length; i < iLen; i++)
			{
				
				var css = list[i];
				for(var j = 0, jLen = this.cssList.length; j < jLen; j++)
				{

					var o = this.cssList[j];
					if(o.url === css && o.state !== "loaded")
					{
						canLoad = false;
						break; 
					}

				}

			}
			return canLoad;

		},

		// 扫描全局script，看全局script是否加载完毕，加载完毕返回true，否则返回false
		scanGlobalScript: function(){

			var canLoad = true;
			var list = this.linearArray(this.globalScript);
			for(var i = 0, iLen = list.length; i < iLen; i++)
			{
				if(this.loadMap[list[i]].state !== "loaded")
				{
					canLoad = false;
					break; 
				}
			}
			return canLoad;
		},	

		//加载脚本
		//todo 去掉里面丑陋的_this
		loadScript: function(url) {

			var _this = this;
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.async= true;
			script.src = url;

			if(script.readyState)
			{
				script.onreadystatechange = function() {

					if(script.readyState === "loaded"  || script.readyState === "complete")
					{
						script.onreadystatechange = null;
						_this.loadMap[url].state = "loaded";
						_this.beginLoad();
						_this.beginCallback();
						_this.beginLoadCss();
						// console.log(url);
					}

				}
			}
			else
			{
				script.onload = function() {
					_this.loadMap[url].state = "loaded";
					_this.beginLoad();
					_this.beginCallback();
					_this.beginLoadCss();
					// console.log(url);
				}
			}

			//todo 这里回头还可以更严谨一些，如果没有head的情况下如何进行。
			// var container = document.getElementsByTagName("head")[0];

			// if (container)
			// {
			// 	container.insertBefore(script, container.firstChild);
			// }

			// 改成了通过寻找最后一个script标签来定位插入位置。
			// 原因，反正不论如何，你如果想运行这个代码的话，怎么着都要插入一段<script>吧。
			var scripts = document.getElementsByTagName("script");
			var container = scripts[scripts.length - 1];

			if (container)
			{
				container.parentNode.insertBefore(script, container);
			}
			

		},

		//开始执行回调
		beginCallback: function() {

			for(var i = 0, iLen = this.callbackList.length; i < iLen; i++)
			{
				var oneCallback = this.callbackList[i];

				if(oneCallback.state === "notRun")
				{
					var canRun = true;
					
					if(oneCallback.useGlobalScript)
					{
						canRun = this.scanGlobalScript();
					}

					for(var j = 0, jLen = oneCallback.relyList.length; j < jLen; j++)
					{
						
						var relyUrl = oneCallback.relyList[j];
						
						if(this.loadMap[relyUrl].state !== "loaded")
						{
							canRun = false;
							break;
						}

					}

					if(canRun)
					{
						oneCallback.state = "hasRun";
						oneCallback.fn();
					}

				}

			}

		},

		// 开始加载css
		beginLoadCss: function() {

			for(var i = 0, iLen = this.cssList.length; i < iLen; i++)
			{
				var oneCss = this.cssList[i];
				if(oneCss.state === "notLoaded")
				{
					oneCss.state = "loading";
					this.loadCss(oneCss);
				}
			}

		},

		// 加载一个css。
		loadCss: function(oneCss) {

			var _this = this;
			var css = document.createElement("link");
			css.setAttribute('type', 'text/css');
			css.setAttribute('rel', 'stylesheet');
			css.setAttribute('href', oneCss.url);

			if(css.readyState)
			{
				css.onreadystatechange = function() {

					if(css.readyState === "loaded"  || css.readyState === "complete")
					{
						css.onreadystatechange = null;
						oneCss.state = "loaded";
						_this.beginLoad();
						_this.beginCallback();
						_this.beginLoadCss();
						mx_log(oneCss.url);
					}

				}
			}
			else
			{
				css.onload = function() {
					oneCss.state = "loaded";
					_this.beginLoad();
					_this.beginCallback();
					_this.beginLoadCss();
					mx_log(oneCss.url);
				}
			}

			var scripts = document.getElementsByTagName("script");
			var container = scripts[scripts.length - 1];

			if (container)
			{
				container.parentNode.insertBefore(css, container);
			}

		},

		// 定义全局脚本
		defineGlobalScript: function(urls){

			this.globalScript = urls;

		},

		// 初始化
		init: function(){

			this.getGlobalScript();
			this.getAutoLoad();

			if(this.globalScript !== "")
			{
				this.load({url: this.globalScript, useGlobalScript: false});
			}

			

		},

		// 从<script>标签上获取autoLoad参数
		getAutoLoad: function() {

			var scripts = document.getElementsByTagName('script');
			var autoLoad = "";
			for( var i = 0, iLen = scripts.length; i < iLen; i++)
			{
				var oneScript = scripts[i];

				if(oneScript.src.indexOf("loadScript_0.2.js") >= 0)
				{
					autoLoad = oneScript.getAttribute("autoLoad");
					break;
					// console.log(oneScript.getAttribute("globalScript"));
				}

			}

			if(autoLoad === "false")
			{
				
				this.autoLoad = false;
				
			}

		},

		// 从<script>标签上获取globalScript参数。
		getGlobalScript: function() {

			var scripts = document.getElementsByTagName('script');
			var globalScript = null;
			for( var i = 0, iLen = scripts.length; i < iLen; i++)
			{
				var oneScript = scripts[i];

				if(oneScript.src.indexOf("loadScript_0.2.js") >= 0)
				{
					globalScript = oneScript.getAttribute("globalScript");
					break;
					// console.log(oneScript.getAttribute("globalScript"));
				}

			}

			if(globalScript !== null)
			{
				this.globalScript = eval('('+ globalScript +')');
				// console.log(this.globalScript);
			}

		}
		
	};

	// 初始化
	mx_load.init();

	// 如果允许autoLoad，则在脚本加载后执行一次run方法
	if(mx_load.autoLoad)
	{
		mx_load.run();
	}

})(((typeof mx_load !=="undefined") ? mx_load : {}), window);



