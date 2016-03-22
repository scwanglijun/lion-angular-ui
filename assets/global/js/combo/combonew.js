/**
 * Newtouch Lion UI 0.1
 * 
 * Copyright (c) 2014 www.newtouch.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at lijun.wang1@newtouch.cn
 */
/**
 * @author wanglijun
 * @date 2015-01-19
 * lion combo lib - jQuery Lion UI
 * 下拉框
 * Dependencies js:
 * jQuery.js bootstrap.js lion.js select2.js 
 * Depedencies css
 * bootstrap.css  lion.css,combo.css (Bootstrap v3.3.1) select2.css 
 */
;(function($){
	  'use strict';// js hint ;_;
	  this.ui = this.ui || {}; //定义ui对象。为避免覆盖如果存在ui对象则使用，不存在则新建
	  var util = this.util, //用变量存储util.js中的方法，方便调用
	        exports = this.ui, //用变量存储ui下的方法，可直接使用此变量追加组件。如不这样需要this.ui.add追加
	        _version = this.version,//组件版本号
	        _id = 0,//id
	        _catchPrefix = 'ui-combo-',//组件缓存对象前缀
	        _idPrefix = this.namespace + '-combo-',//自定义id前缀
	        events = {};//按钮事件缓存区
	 //默认参数
    var defaults={
    	id:'',//控件ID
    	language: 'zh-CN',
    	placeholder:'请选择',
    	tags:false,//是否显示标签按钮
    	allowClear:true,//是否清除按钮
    	templateResult:'',//用户格式显示内容;
    	data:null,//显示内容
    	multiple:false,
    	url:'',//
    	minimumResultsForSearch:-1,//默认不显示搜索框
    	textfield:'text',//后台获取下拉文件key
    	valuefield:'id',//Value的key
    	selectedField:'selected',//是否选中的key
    	selected:false,//是否根据后台数据默认选择中相应参数
        icon:false,//是否显示图标
    };

    var Combo=function combo(element,options,e){
    	if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        //节点
        this.$element = $(element);
        //ID
        this.id=this.$element.attr('id');
        //参数选择项
        this.options=options;
        //提示
        this.options.placeholder=this.$element.attr('placeholder')||this.options.placeholder;
        //调用初始化
        this.init();
        //加载数据
        if(util.isNotEmpty(this.options.url)){
        	this.loading();
    	}
    	//数据列表
    	this.data={};
        //添加事件监听
        this.addLisenterEvent();
    };
    //创建对象
    Combo.prototype={
    	 //设置构造函数
        constructor: Combo,
        //初始化函数
        init:function(){
        	 var options=this.options;
        	 return this.$element.select2({
	       		minimumResultsForSearch:options.minimumResultsForSearch,
	            placeholder:options.placeholder,
	            allowClear:options.allowClear});
        },
        //设置值或获取数据
        val:function(param){
        	if(util.isEmpty(param)){
        		return this.getVal();
        	}else{
        	 	this.setVal(param);
        	}
        },
        //获取数据
        getVal:function(){
        	var selectedVal=this.$element.select2('val');
        	if(util.isNotEmpty(selectedVal)){
        		return selectedVal;
        	}
       		return '';
        },
        //设计数据
        setVal:function(param){
           	this.init().val(param).trigger('change');
        },
        //清除选择
        clear:function(){
         	this.init().val(null).trigger('change');
        },
        //获取所有数据
       	getData:function(){
       	  	if($.isEmptyObject(this.data)){
       	  		var that=this,
        	 	 idKey=this.options.valuefield||'id',
        	 	 textKey=this.options.textfield||'text',
        	 	 selectedKey=this.options.selectedField||'selected',
        	 	 tempitem={},tempdata=[];
        	 	 that.$element.find('option').each(function(key,item){
        	 		 if(util.isNotEmpty(item.value)){
        	 		 	 tempitem[idKey]=item.value;
        	 		 	 tempitem[textKey]=item.innerText;
        	 		 	 if(item.selected){
        	 		 	 	tempitem[selectedKey]=item.selected;
        	 		 	 }
        	 		 	 tempdata.push(tempitem);
        	 		 	 tempitem={};
        	 		 }
        	 	});
        	 	this.data=tempdata;
       	  	}
       	  	return this.data;
       	},
       	//根据url重新加载数据
        reload:function(url){
       	 //调后台
       	 util.post(url,{},buildOptions);
       	 //请求成功处理
       	 var that=this,
       	 	 selectedKeys=null,
       	 	 idKey=this.options.valuefield||'id',
       	 	 textKey=this.options.textfield||'text',
       	 	 selectedKey=this.options.selectedField||'selected';

       	 function buildOptions(data){
       		 console.dir(data);
       	 	 that.data=data;
       	     //判断数据是否空
       	     if($.isEmptyObject(data)){
       	     	 return;
       	     }
       	     //清空select的内容
       	     that.$element.empty();
       	     //判断是否带错误
       	     if(that.options.allowClear===true){
       	     	that.$element.append('<option value=""></option>');
       	     }        	   
       	     //加载数据,并创建创建select的option项
       	     $.each(data,function(key,item){
       	     	   var  selected=item[selectedKey],
       	     	   		itemId=item[idKey],
       	     	   		itemText=item[textKey];
       	           if(selected===true){
       	           	 	selectedKeys=itemId;
       	     	  		that.$element.append('<option value="'+itemId+'" selected>'+itemText+'</option>');
       	     	   }else{
       	     	   		that.$element.append('<option value="'+itemId+'" >'+itemText+'</option>');
       	     	   }
       	     	  
       	     });
       	     //重新加载并选择；
       	     delayfunc(selectedKeys);      
        	 }
        	 
       	 function delayfunc(){
       	 	if($.isEmptyObject(selectedKeys)){
       	 		that.init().val(null).trigger('change');
       	 		return;
       	 	}
       	 	that.init().val([selectedKeys]).trigger('change');
       	 }
       },
        //加载数据
        loading:function(){
        	 
        	 if(util.isEmpty(this.options.url)){
        	 	throw new Error("cannot call val() if initSelection() is not defined");
        	 }
        	 //调后台
        	 util.post(this.options.url,{},buildOptions);
        	 //请求成功处理
        	 var that=this,
        	 	 selectedKeys=null,
        	 	 idKey=this.options.valuefield||'id',
        	 	 textKey=this.options.textfield||'text',
        	 	 selectedKey=this.options.selectedField||'selected';

        	 function buildOptions(data){
        	 	 that.data=data;
        	     //判断数据是否空
        	     if($.isEmptyObject(data)){
        	     	 return;
        	     }
        	     //清空select的内容
        	     that.$element.empty();
        	     //判断是否带错误
        	     if(that.options.allowClear===true){
        	     	that.$element.append('<option value=""></option>');
        	     }        	   
        	     //加载数据,并创建创建select的option项
        	     $.each(data,function(key,item){
        	     	   var  selected=item[selectedKey],
        	     	   		itemId=item[idKey],
        	     	   		itemText=item[textKey];
        	           if(selected===true){
        	           	 	selectedKeys=itemId;
        	     	  		that.$element.append('<option value="'+itemId+'" selected>'+itemText+'</option>');
        	     	   }else{
        	     	   		that.$element.append('<option value="'+itemId+'" >'+itemText+'</option>');
        	     	   }
        	     	  
        	     });
        	     //重新加载并选择；
        	     delayfunc(selectedKeys);      
         	 }
         	 
        	 function delayfunc(){
        	 	if($.isEmptyObject(selectedKeys)){
        	 		that.init().val(null).trigger('change');
        	 		return;
        	 	}
        	 	that.init().val([selectedKeys]).trigger('change');
        	 }
        },
        //刷新数据
        refresh:function(){
        	this.loading();
        },
        //加载事件
        addLisenterEvent:function(){
            var change_event = $.Event('combo.change'),that=this;
            this.init().on('change',function(e){
                that.$element.trigger(change_event);
                      //如已经事件阻止，则返回
                if (change_event.isDefaultPrevented()) return;
            });
          
        }
    };

    function Plugin(option, event){
        //获取参数
        var args = arguments;
        //定义参数和事件，并赋值给并变量
        var _option = option;
        option= args[0];
        event = args[1]|{};
        [].shift.apply(args);
        // This fixes a bug in the js implementation on android 2.3 #715
        if (typeof option =='undefined') {
            option = _option;
        }
        var value;
        var chain = this.each(function () {
             var $this = $(this);
             if ($this.is('select')) {
                  var data = $this.data('combo'),
                  options = typeof option == 'object' && option;

                  if (!data) {
                    var config = $.extend({},defaults,$.fn.combo.defaults || {},$this.data(),options);
                    $this.data('combo', (data = new Combo(this, config, event)));
                  } else if (options) {
                    for (var i in options) {
                      if (options.hasOwnProperty(i)) {
                         data.options[i] = options[i];
                      }
                    }
                  }
                  if (typeof option == 'string') {
                    if (data[option] instanceof Function) {
                        value = data[option].apply(data, args);
                    } else {
                        value = data.options[option];
                    }
                  }
             }
        });

        if (typeof value !== 'undefined') {
          return value;
        } else {
          return chain;
        }
    }


    var old = $.fn.combo;
    $.fn.combo = Plugin;
    $.fn.combo.Constructor = Combo;
    // combo NO CONFLICT
    // ========================
    $.fn.combo.noConflict = function () {
       $.fn.combo = old;
       return this;
    }; 

    //加载combo组件
    $(function () {
      $('.lion-combo').each(function () {
          var $combo = $(this);
          Plugin.call($combo, $combo.data());
      });
    });

}).call(lion,jQuery);