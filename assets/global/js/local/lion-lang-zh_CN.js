;(function($){
	'use strict';// js hint ;_;
	this.lang = this.lang || {}; //定义ui对象。为避免覆盖如果存在ui对象则使用，不存在则新建
	var exports = this.lang;
	//是否可编辑
	exports.editable={y:'是',n:'否'};
	//男女
	exports.gender={m:'男',f:'女'};
}).call(lion,jQuery);