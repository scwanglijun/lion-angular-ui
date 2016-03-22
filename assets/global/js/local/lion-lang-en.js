;(function($){
	'use strict';// js hint ;_;
	this.lang = this.lang||{}; //定义ui对象。为避免覆盖如果存在ui对象则使用，不存在则新建
	var exports = this.lang;
	//是否可编辑
	exports.editable={y:'Y',n:'N'};
	//男女
	exports.gender={m:'M',f:'F'};
}).call(lion,jQuery);