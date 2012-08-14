var mx_load = {

	runList:{
		normal:[]
	},

	globalScript: [],

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

	load: function(options) {
		this.add(options);
	},

	defineGlobalScript: function(urls) {
		this.globalScript = urls;
	},

	load_mx_load: function(options) {

		var script = document.createElement("script");
		script.type = "text/javascript";
		script.async= true;
		script.src = options.url;

		if(typeof options.globalScript !== "undefined")
		{
			script.setAttribute('globalScript', options.globalScript);
		}

		if(typeof options.autoLoad !== "undefined")
		{
			script.setAttribute('autoLoad', options.autoLoad);
		}

		// 改成了通过寻找最后一个script标签来定位插入位置。
		// 原因，反正不论如何，你如果想运行这个代码的话，怎么着都要插入一段<script>吧。
		var scripts = document.getElementsByTagName("script");
		var container = scripts[scripts.length - 1];

		if (container)
		{
			container.parentNode.insertBefore(script, container);
		}

	}


}