/**
 * Newtouch Lion UI 0.1
 * 
 * Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at lijun.wang1@newtouch.cn
 */
/**
 * lion core lib - jQuery LionUI
 * @author wanglijun
 * @date 2015-01-13
 * Dependencies:
 * jQuery
 */

/** * 命名空间配置定义 */
var lion=lion||{
		version:'0.1',
		coreFileName:'lion.js',
		namespace:'lion'
};

/** * 常量定义 */ 
lion.constant={
	success:'success',
	error:'error',
	fail: 'fail',
	dataPrefix:'data-' //ui组件自定义属性前缀
};
/**
  * 组件缓存,以"模块-组件名-id"格式作为key存储.
  * 例如:ui-button-id
  */ 
lion.assemblyCache={};


/**
 * 
 * util
 * 
 * ;(function($){
 *    $.fn.pluginName = function(){
 *      var default = {
 *        btn:true,
 *        success:null
 *      }
 *    }
 * })(jQuery);
 *
 *$('').pluginName({
 *   btn:true,
 *   success:function(){
 *      
 *   }
 *});
 */
(function($){

  /**
   * 模块初始化
   */
  var exports={},
	_this=this;
  

  /**
   * 方法提供到util命名空间下
   */
  this.util=exports;
  /**  判断是否为空 */
  exports.isEmpty=function(o){
		return o===null ||o=== undefined ? true : /^[\s\xa0]*$/.test(o);
   };
   /**判断是否不为空*/
   exports.isNotEmpty=function(o){
	 	return exports.isEmpty(o)?false:true;
   };

   /**获取应用上下文根属性*/
   exports.context=function(){
   		 //获取应用的上下文根路径
		 var pathname=window.location.pathname;
		 var indexNext= pathname.indexOf("/",1);
		 return pathname.substr(0,indexNext);
   }();
   /**域名*/
   exports.hostname=function(){
   		return window.location.hostname;
   }();
   //端口号
   exports.port=function(){
   		return window.location.port;
   }();
   //协议
   exports.protocol=function(){
   		return window.location.protocol;
   }();
   /**
    * protocol+"//"+hostname+exports.context
    */
   exports.httpurl=function(){
   		 return exports.protocol+"//"+exports.hostname+exports.context;	
   }();

   exports.menu=function(){
   		 var urlPathname = window.location.pathname, s='a[href="'+urlPathname+'"]', 
   		 	 objs=$(s).parents('li'),
   		 	 navbarhome='<li><a href="'+exports.context+'/index.htm">首页</a><i class="fa fa-circle"></i></li>',
   		 	 navbar='';
	  $.each(objs,function(key,item){
		    var menuName=$(item).find('>a>span.title').text();
		    if(key===0&&exports.isNotEmpty(menuName)){
		        navbar+='<li class="active">'+menuName+'</li>';
		    }else if(exports.isNotEmpty(menuName)){
		        navbar='<li><a href="#">'+menuName+'</a><i class="fa fa-circle"></i></li>'+navbar;
		    }
	  });
	  navbarhome+=navbar;
	  $('.page-breadcrumb').html(navbarhome);
   };
   exports.reload=function(){
   		 window.location.reload();
   };
   /***
   	*提交成功的提示
   	*@param {[string]} [title] [提示标题]
   	*@param {[string]} [content] [description]
   	**/
   exports.success=function(title,content){
	   var toast = $("#toast-container");
		 if(toast.length==0){
			 toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-top-center",
				  "onclick": null,
				  "showDuration": "1000",
				  "hideDuration": "1000",
				  "timeOut": "5000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
			 };
			 toastr.success(content, title);
		 }
	};
	/***
   	*错误提示对话
   	*@param {[string]} [title] [提示标题]
   	*@param {[string]} [content] [description]
   	**/
	exports.error=function(title,content){
		
		 var toast = $("#toast-container");
		 if(toast.length==0){
			 toastr.options = {
					  "closeButton": true,
					  "debug": false,
					  "positionClass": "toast-top-center",
					  "onclick": null,
					  "showDuration": "1000",
					  "hideDuration": "0",
					  "timeOut": "1000",
					  "extendedTimeOut": "0",
					  "showEasing": "swing",
					  "hideEasing": "linear",
					  "showMethod": "fadeIn",
					  "hideMethod": "fadeOut"
				};
			 toastr.error(content, title);
		 }
	 };
	 /***
   	 *警告提示对话
   	  *@param {[string]} [title] [提示标题]
   	 *@param {[string]} [content] [description]
   	 **/
	  exports.warning=function(title,content){
		  var toast = $("#toast-container");
			 if(toast.length==0){
			 	 toastr.options = {
			 			  "closeButton": true,
			 			  "debug": false,
			 			  "positionClass": "toast-top-center",
			 			  "onclick": null,
			 			  "showDuration": "1000",
			 			  "hideDuration": "0",
			 			  "timeOut": "0",
			 			  "extendedTimeOut": "0",
			 			  "showEasing": "swing",
			 			  "hideEasing": "linear",
			 			  "showMethod": "fadeIn",
			 			  "hideMethod": "fadeOut"
			 		};
			 	 toastr.warning(content, title); 
			 }
	  };
	  /***
   	 *info提示对话
   	  *@param {[string]} [title] [提示标题]
   	 *@param {[string]} [content] [description]
   	 **/
	  exports.info=function(title,content){
		  
		 var toast = $("#toast-container");
		 if(toast.length==0){
			 toastr.options = {
		 			  "closeButton": true,
		 			  "debug": false,
		 			  "positionClass": "toast-top-center",
		 			  "onclick": null,
		 			  "showDuration": "1000",
		 			  "hideDuration": "1000",
		 			  "timeOut": "5000",
		 			  "extendedTimeOut": "1000",
		 			  "showEasing": "swing",
		 			  "hideEasing": "linear",
		 			  "showMethod": "fadeIn",
		 			  "hideMethod": "fadeOut"
		 		};
		 	 toastr.info(content, title);
		 }
	 	 
	  };
   /**连接超时时间*/
   exports.timeout=5000;
   /**Ajax POST请求
	 * @param url 请求URL
	 * @param data 请求数据
	 * @param successfn 成功回调函数
	 * @param {[type]} [arg] [回调的参数]
	 */
   exports.post=function(url,data,successfn,errorfn,arg){
   		successfn=successfn||$.noop;
   		errorfn=errorfn||$.noop;
   		$.ajax({
            url : url,
            type : 'post',              
            data : data,
            dataType:'json',
        	timeout:exports.timeout,
        	error :function(xhr, textStatus, error) {
				errorfn.call(this,xhr,textStatus,error);
			},
            success:function(data) {
            	successfn.call(this,data,arg);
            }
        });
   };

   exports.postasync=function(url,data,successfn,errorfn,arg){
   		successfn=successfn||$.noop;
   		errorfn=errorfn||$.noop;
   		$.ajax({
            url:url,
            type:'post',              
            data:data,
            async:false,
            dataType:'json',
        	timeout:exports.timeout,
        	error:function(xhr, textStatus, error) {
				errorfn.call(this,xhr,textStatus,error);
			},
            success:function(data) {
            	successfn.call(this,data,arg);
            }
        });
   };

   /**
    * [postjson JSON字符串请求]
    * @param  {[type]} url       [URL]
    * @param  {[type]} data      [JSON对象]
    * @param  {[type]} successfn [请求成功回调函数]
    * @param  {[type]} errorfn   [失败回调函数]
    * @param  {[type]} arg       [参数]
    */
   exports.postjson=function(url,data,successfn,errorfn,arg){
   		successfn=successfn||$.noop;
   		errorfn=errorfn||$.noop;
   		 $.ajax({
				dataType:'json',
				contentType:'application/json',
				type :'POST',
				url:url,
				async:true,
				data:JSON.stringify(data),
				success : function(data) {
            		successfn.call(this,data,arg);
            	},			
				timeout:exports.timeout,
				error:function(xhr, textStatus, error) {
					errorfn.call(this,xhr,textStatus,error);
				},
	    });
   };
     /**Ajax POST请求
   	 * @param url 请求URL
   	 * @param successfn 成功回调函数
   	 * @param {[type]} [arg] [回调的参数]
   	 */
   	  exports.get=function(url,successfn,errorfn,arg){
    		successfn=successfn||$.noop;
    		errorfn=errorfn||$.noop;
    		$.ajax({
            url : url,      
            async : false,
            type : 'get',
            dataType:'json',
         	timeout:exports.timeout,
         	error : function(xhr,textStatus,error) {
 				errorfn.call(this,xhr,textStatus,error);
 			},
             success : function(data) {
             	successfn.call(this,data,arg);
             }
        });
   	   };

  /**
   * 判断是否为数组类型
   */
  exports.isArray=function(o){
	return (0===undefined||o!== null) && typeof o == "object" && 'splice' in o && 'join' in o;
  };

  /**
   * 判断是否为object类型
   */
  exports.isObject=function(o){
	return  typeof o == "object";
  };

  /**
   * 判断是否为string类型
   */
  exports.isString=function(o){
	return  typeof o == "string";
  };

  /**
   * 判断是否为function类型
   */
  exports.isFunction=function(o){
	return  typeof o == "function";
  };

  /**
   * 判断是否为boolean类型
   */
  exports.isBoolean=function(o){
	return  typeof o == "boolean";
  };

  /**
   * 判断是否为number类型
   */
  exports.isNumber=function(o){
	return  typeof o == "number";
  };

  /**
   * 判断是否为undefined
   */
  exports.isUndefined=function(o){
	return  typeof o == "undefined";
  };

    /**
     * 判断对象是否为空字符串，去除前后空格
      * @param o
     * @returns {boolean|*}
     */
  exports.isBlank=function(o){
      o=o||"";
     return o===""|| o.trim()==="";
  };


  /**
   * 设置dom对象css属性值
   * @param element dom元素(zepto对象)
   * @param options 值列表(json)
   */
  exports.setElementCss=function(element,options){
	if(element&&this.isObject(options)){
	  for (var att in options) {
		element.css(att,options[att]);
	  }
	}
  };

  /**
   * 设置dom对象style属性值
   * @param element dom元素(zepto对象)
   * @param value 值
   */
  exports.setElementStyle=function(element,value){
	if(element&&typeof value=="string"){
	  element.attr("style",value);
	}
  };

  /**
   * 设置dom对象自定义属性以及值
   * @param element dom元素(zepto对象)
   * @param attributes 自定义属性列表(Array or String)
   * @param values 自定义属性列表值(json-key需要和attributes对应 or String)
   */
  exports.setElementData=function(element,attributes,values){
	if(this.isObject(values)&&this.isArray(attributes)){
	  for (var att in attributes) {
		element.attr(_this.contsant.dataPrefix+attributes[att],values[attributes[att]]);
	  }
	}else if(this.isString(values)&&this.isString(attributes)){
		element.attr(_this.contsant.dataPrefix+attributes,values);
	}
  };

  /**
   * 获取设置在dom属性上自定义属性的值
   * @param element dom元素(zepto对象)
   * @param attribute 自定义属性名称
   */
  exports.getElementData=function(element,attribute){
	if(this.isString(attribute)){
	  return element.attr(_this.contsant.dataPrefix+attribute);
	}
	return null;
  };

  /**
   * 处理用户调用组件时传入的参数
   * @param param 用户调用组件时传入的参数
   * @param attributes 自定义属性列表(Array)
   */
  exports.getParams=function(param,attributes){
	var result=null;

	  if(this.isString(param)){//如果是string，作为按钮id
		  result=this.getElementParams(param,attributes);
	  }else if(this.isObject(param)){//如果是json格式
		  var t=this.getElementParams(param.id,attributes);
		  if(t){
			//用新传入的参数值覆盖之前存储在dom元素上的json值
			  result=$.extend(t,param);
		  }
	  }

	  //如果result不为null则表示该组件已经渲染过(用id作为唯一标示),不需要再次渲染
	  if(result){
		result.isRender=false;
	  }
	  return result||param;
  };

  /**
   * 在指定元素ID中得到传入的自定义属性列表和值，生成json返回
   * @param elementId 元素ID
   * @param attributes 自定义属性列表(Array)
   */
  exports.getElementParams=function(elementId,attributes)
  {
	var result=null,
	  element=$("#"+elementId);

	if(element.size()>0){
	  element=element.eq(0);
	  result={id:elementId};
	  for (var att in attributes) {
				var v=element.attr(_this.contsant.dataPrefix+attributes[att]);
				if(v){
					result[attributes[att]]=v;
				}
	  }
	}
	return result;
  };

  /**
	 * console.log
   * @param msg 需要打印的消息
	 */
	exports.log=function(msg){		
		if(window.console){		
			console.log(msg);
		}
	};

	/**
	 * 得到核心js文件引用路径
	 */
	exports.coreurl=function(){    
		
		var srcUrl="",
		
		fileReg=new RegExp(_this.coreFileName,"i");

		$.each($("script"),function(){
			if(fileReg.test($(this).attr("src"))){
				srcUrl=$(this).attr("src").replace(_this.coreFileName,"");
				return false;
			}
		});

		return srcUrl;
	}();

	/**
	 * 检查JS文件或者CSS文件是否存在
	 */
	exports.existJsCssFile=function(fileName){
	   var type="";

		if(/\.js$/.test(fileName)){type="js";}
		else if(/\.css$/.test(fileName)){type="css";}

		var reg=new RegExp(fileName,"i"),
		  result=false,
		  filter=type=="js"?"script[src]":"";
		  filter=type=="css"?"link[href]":filter;

		if(type=="js"||type=="css"){
		  var attr=filter.match(/\[.+\]/)[0].replace("[","").replace("]","");
		  $(filter).each(function(){
			if(reg.test($(this).attr(attr))){
			  result=true;
			  return false;
			}
		  });
	}

	return result;
	};

	/** 
	 * 动态加载js文件以及css文件
	 * @param  {filename} 文件名 String or Array
	 * @param  {charset}  文件编码
	 * @param  {callback(code)} 文件加载完成回调函数 code[success,error]
	 */
	exports.loadJsCssFile=function(params){
		var dp={
				filename:null,//array in filename[{filename:'',media:'',charset:'',ftype:''}]
				charset:null,
				media:null,
				ftype:null,
				callback:function(code){}
		},
		_index=-1,
		_util=this;

		$.extend(dp,params);
		function loadFile(filename,charset,media,callback,ftype)
		{
			var fileref,src=filename,filetype,checkFile=true;

			if(_util.isObject(filename)){
				charset=filename.charset||charset;
				media=filename.media||media;
				src=filename.filename;
				ftype=filename.ftype;
				checkFile=_util.isBoolean(filename.checkFile)?filename.checkFile:true;
			}

			filetype=src;

			if(!filetype){
				_util.isFunction(callback)&&callback(_this.constant.success);
				return;
			}else if(checkFile&&_util.existJsCssFile(src)){
				_util.isFunction(callback)&&callback(_this.constant.success);
				return;
		  }

			filetype=filetype.substring(filetype.lastIndexOf(".")+1).toLowerCase();
			filetype=ftype||filetype;

			//createElement
			if(/^js/i.test(filetype)){
				fileref = document.createElement('script');
				fileref.setAttribute("type","text/javascript");
				fileref.setAttribute("src",src);
			}else if(/^css/i.test(filetype)){
				fileref = document.createElement('link');
				fileref.setAttribute("rel","stylesheet");
				fileref.setAttribute("type","text/css");
				fileref.setAttribute("href",src);
			}else{//如果非此两种文件
				_util.isFunction(callback)&&callback(_this.constant.error);
			}

			//event and callback message
			if(fileref !== undefined){
				charset&&fileref.setAttribute("charset",charset);
				media&&fileref.setAttribute("media",media);
				if(filetype=="css"){//css 的onload不兼容所有浏览器
					_util.isFunction(callback)&&callback(_this.constant.success);
				}else{
					fileref.onload=fileref.onreadystatechange=function(){
						if(!this.readyState||
							this.readyState=='loaded'||
							this.readyState=='complete'){
							_util.isFunction(callback)&&callback(_this.constant.success);
						}
					};
				}
				fileref.onerror=function(){
					_util.isFunction(callback)&&callback(_this.contsant.error);
				};
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		}
		if(this.isArray(dp.filename)){
			(function(){
				_index++;

				if(_index>=dp.filename.length){
					dp.callback(_this.contsant.success);
					return;
				}

				loadFile(dp.filename[_index],dp.charset,dp.media,arguments.callee,dp.ftype);
			})();
		}else{
			loadFile(dp.filename,dp.charset,dp.media,dp.callback,dp.ftype);
		}
	};

	/**
	 * 得到地址栏参数
	 * @param names 参数名称
	 * @param urls 从指定的urls获取参数
	 * @returns string
	 */
	exports.getQueryString=function(names,urls){
	  urls=urls||window.location.href;
	  urls&&urls.indexOf("?")>-1?urls=urls.substring(urls.indexOf("?")+1):"";
		var reg = new RegExp("(^|&)"+ names +"=([^&]*)(&|$)","i");
		var r = urls?urls.match(reg):window.location.search.substr(1).match(reg);
		if(r!==null&&r[2]!=="")return  unescape(r[2]); return null;
	};

	/**
   * setLocalStorage
   * @param key key
   * @param value value
   * @param isJson 是否json格式
   */
	exports.setLocalStorage=function(key,value,isJson){
		if(window.localStorage){
			if(isJson){
				value=JSON.stringify(value);
			}
		localStorage[key]=value;  
		}
	};

	/**
	 * getLocalStorage
   * @param key key
   * @param isJson 是否json格式
	 */
	exports.getLocalStorage=function(key,isJson){
		if(window.localStorage){
			var value=localStorage[key]||"";
			if(isJson&&value){
				value=JSON.parse(value);
			}
		   return value;
		}
	};

	/**
	 * removelocalStorage
   * @param key key
	 */
	exports.removelocalStorage=function(key){
		if(window.localStorage)
		{
			localStorage.removeItem(key);
		}
	};

	/**
	 * setSessionStorage
   * @param key key
   * @param value value
   * @param isJson 是否json格式
	 */
	exports.setSessionStorage=function(key,value,isJson){
		if(window.sessionStorage)
		{
			if(isJson){
				value=JSON.stringify(value);
			}
		   sessionStorage[key]=value; 
		}
	};

	/**
	 * getSessionStorage
   * @param key key
   * @param isJson 是否json格式
	 */
	exports.getSessionStorage=function(key,isJson){
		if(window.sessionStorage){
			var value=sessionStorage[key]||"";
			if(isJson&&value){
				value=JSON.parse(value);
			}
		   return value;
		}
	};

	/**
	 * removeSessionStorage
   * @param key key
	 */
	exports.removeSessionStorage=function(key){
		if(window.sessionStorage){
			sessionStorage.removeItem(key);
		}
	};

	/**
	 * getCookie
   * @param key key
	 */
	exports.getCookie=function(key){
		var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return null; 
		}
	};

	/**
	 * removeCookie
   * @param param {domain,key,path}
	 */
	exports.removeCookie=function(param){
		var dp={
			domain:"",
			key:"",
			path:"/"
		};

		if(this.isObject(param)){
			$.extend(dp,param);
		}else if(this.isString(p)){
			dp.key=param;
		}

		if(!dp.domain){
			dp.domain=function(){
				return document.domain;
			}();
		}

		var exp = new Date("2000","1","1"); 
		var cval=this.getCookie(dp.key);

		if(cval!==null){
			document.cookie= dp.key + "="+cval+";domain="+dp.domain+";path="+dp.path+";expires="+exp.toGMTString();
		}
	};

	/**
	 * getPlatform
	 */
	exports.getPlatform=function() {
		var platforms = {
			amazon_fireos: /cordova-amazon-fireos/,
			android: /Android/,
			ios: /(iPad)|(iPhone)|(iPod)/,
			blackberry10: /(BB10)/,
			blackberry: /(PlayBook)|(BlackBerry)/,
			windows8: /MSAppHost/,
			windowsphone: /Windows Phone/
		};
		for (var key in platforms) {
			if (platforms[key].exec(navigator.userAgent)) {
				return key;
			}
		}
		return "";
	};

	/**
	 * 得到组件缓存对象
	 */
	exports.getAssemblyCache=function(moduleId){
		return _this.assemblyCache[moduleId];
	};

	/**
	 * 添加组件缓存对象
	 */
	exports.addAssemblyCache=function(moduleId,object){
		return _this.assemblyCache[moduleId]=object;
	};

	/**
	 * 转换成bool值
	 */
	exports.convertBool=function(v){
		var trues={
		  "1":true,
		  "true":true
		};
		return trues[v.toString()]?true:false;
	};

	/**
	 * 转换成int值
	 */
	exports.convertInt=function(v){
  		return parseInt(v);
	};

}).call(lion,jQuery);