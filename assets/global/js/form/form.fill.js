/**
 * Newtouch Lion UI 0.1
 * 
 * Copyright (c) 2014 www.newtouch.cn. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at lijun.wang1@newtouch.cn
 */

/**
 * @author wanglijun
 * @date 2015-01-19
 * lion combo lib - jQuery Lion UI
 * Form表单填充数据
 * Dependencies js:
 * jQuery.js
 */
;(function($){
	'use strict';// js hint ;_;
    this.ui = this.ui || {}; //定义ui对象。为避免覆盖如果存在ui对象则使用，不存在则新建
    var util = this.util, //用变量存储util.js中的方法，方便调用
        exports = this.ui, //用变量存储ui下的方法，可直接使用此变量追加组件。如不这样需要this.ui.add追加
        _version = this.version,//组件版本号
        _id = 0,//id
        _catchPrefix = 'ui-formfill-',//组件缓存对象前缀
        _idPrefix = this.namespace + '-formfill-',//自定义id前缀
        events = {};//按钮事件缓存区
    var Fill=function fill() {
		this.defaults = {
			styleElementName: 'object',	// object | none
			dateFormat: 'yyyy-mm-dd',
			debug:false,
			elementsExecuteEvents: ['checkbox', 'radio', 'select-one'],
			version:_version
		};
	};

	/**控件版本*/
	Fill.version=_version;

    Fill.prototype = {
        //设置构造函数
        constructor: Fill,
        setDefaults:function (options) {
			this.defaults = $.extend({},this.defaults,option);
			return this;
		},
		fill:function(obj, _element, options){
			options = $.extend({},this.defaults,options);
			_element.find('input').each(function(i, item){
				 fillToValue(obj,item,options);
			});

			_element.find('select').each(function(i,item){
				 fillToValue(obj,item,options,'select');
			});

			_element.find('textarea').each(function(i,item){
				 fillToValue(obj,item,options,'textarea');	
			});
		}
    };
    /**
     * [fillToValue description]
     * @param  {[type]} obj     [description]
     * @param  {[type]} item    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function fillToValue(obj,item,options,type){
			var $item=$(item), objName,value;
			 
			try{
				if (options.styleElementName == "object") {
					// Verificando se é um array
					if ($(item).attr("name").match(/\[[0-9]*\]/i)) {
						objName = $(item).attr("name").replace(/^[a-z]*[0-9]*[a-z]*\./i, 'obj.').replace(/\[[0-9]*\].*/i, "");
						
						arrayAtribute = $(item).attr("name").match(/\[[0-9]*\]\.[a-z0-9]*/i) + "";
						arrayAtribute = arrayAtribute.replace(/\[[0-9]*\]\./i, "");
					} else {
						objName = $(item).attr("name").replace(/^[a-z]*[0-9]*[a-z]*\./i, 'obj.');
					}
				} else if (options.styleElementName == "none") {
					objName = 'obj.' + $(item).attr("name");
				} 
			}catch(e) {
			  	
			}
			value =getObjValue(obj,objName);
			//如值等于空，则直接返回
			if(util.isEmpty(value)){
				return;
			}
			fillToComponent(value,$item,type);
    }
    /**
     * [fillToComponent 将值填充到表格]
     * @param  {[type]} value [值]
     * @param  {[type]} $item [控件]
     */
    function fillToComponent(value,$item,type){
    	type=$item.attr('type')||type;
    	switch(type) {
    		case 'hidden':
    		case 'password':
    		case 'textarea':
    			$item.val(value);
    			break;
    		case 'text':
    			if ($item.hasClass('hasDatepicker')) {
    				var re = /^[-+]*[0-9]*$/;
    				var dateValue = null;
    				if (re.test(value)) {
    					dateValue = new Date(parseInt(value));
    					var strDate = dateValue.getUTCFullYear() + '-' + (dateValue.getUTCMonth() + 1) + '-' + dateValue.getUTCDate();
    					dateValue = $.datepicker.parseDate('yy-mm-dd', strDate);
    				} else if (value) {										
    					dateValue = $.datepicker.parseDate(options.dateFormat, value);
    				}
    				$item.datepicker('setDate', dateValue);							
    			} else if ($item.attr('alt') == 'double') {
    				$item.val(value.toFixed(2));
    			} else {
    				$item.val(value);
    			}
    			break;
    		case 'select':
    			 if (value) {
    			 	$item.val(value);
    			 }
    			 break;
    		case 'select-one':
    			if (value) {
    				$item.val(value);
    			}
    			break;
    		case 'radio':
    			$item.each(function (i, radio) {
    				if ($(radio).val() == value) {
    					$(radio).attr('checked', 'checked');
    				}
    			});
    			break;
    		case 'checkbox':
    			if ($.isArray(value)) {
    				$.each(value, function(i, arrayItem) {
    					if (typeof(arrayItem) == 'object') {											
    						arrayItemValue = eval('arrayItem.' + arrayAtribute);
    					} else {
    						arrayItemValue = arrayItem;
    					}
    					if ($item.val() == arrayItemValue) {
    						$item.attr('checked', 'checked');
    					}
    				}); 
    			} else {
    				if (value||$item.val()===value) {
    					$item.attr('checked', 'true');
    					$item.parent().addClass('checked');
    				}else{
    					$item.removeAttr('checked');
    					$item.parent().removeClass('checked');
    				}
    			}						
    			break;
    	}
    }	
    /**
     * [getObjValue 根据名称获取值]
     * @param  {[string]} key [名称]
     * @return {[type]}         [description]
     */
    function getObjValue(obj,key){
	    if('undefined'==typeof(obj[key])){  
            return;  
        }
        return obj[key];
    }

    /**
     * [isFillComponent 判断是否要填充的控件 是则返回False,否则返回true]
     * @param  {[type]}  $item  表单控件
     * @return {Boolean}       	
     */
    function isFillComponent($item){
    	if ($item.is('input') || $item.is('select') || $item.is('textarea')) {
    		return false;
    	}
    }

	$.fn.fill = function (obj, options) {
		$.fill.fill(obj,$(this), options);
		return this;
	};

    $.fn.serializeObject=function(){
      var oparams = {};
      $.each(this.serializeArray(), function() {
            if (oparams[this.name] !== undefined) {
                if (!oparams[this.name].push) {
                    oparams[this.name] = [oparams[this.name]];
                }
                oparams[this.name].push(this.value || '');
            } else {
                oparams[this.name] = this.value || '';
            }
       });
       return oparams;
    };
    
    $.fn.reset=function(){
        var $this=this;
        $this[0].reset();
        $this.find('.form-group').removeClass('has-error');
        $this.find('.form-filed').removeClass('has-error');
        $this.find('.help-block').remove();
        if($this.find('.lion-combo').size()>0){
            $this.find('.lion-combo').combo('clear');
        }
        if($this.find('.lion-combotree').size()>0){
            $this.find('.lion-combotree').combotree('refresh');
        }
        $this.find(':input[type=hidden]').val('');
    };
	
	$.fill = new Fill();

	function executeEvents(element) {
		if (jQuery.inArray($(element).attr('type'), $.fill.defaults.elementsExecuteEvents)) {
			if ($(element).attr('onchange')) {
				$(element).change();
			}

			if ($(element).attr('onclick')) {
				$(element).click();
			}
		}	
	}
	
	function debug(message) {                                                                                            // Throws error messages in the browser console.
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    }
}).call(lion,jQuery);