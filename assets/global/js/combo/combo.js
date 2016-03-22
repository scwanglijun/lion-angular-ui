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
 * jQuery.js bootstrap.js lion.js 
 * Depedencies css
 * bootstrap.css  lion.css,combo.css (Bootstrap v3.3.1)
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
    //默认HTML模板
    var templates={
    
    };
    //默认参数
    var defaults={
        //控件ID
        id:'',
        /**组件版本号*/
        version: _version,
        //控件名称
        name:'',
        //按钮样式
        btnClass:'btn-default',
        //是否为多选
        multiple:false,
        //最大选择项 默认为1
        maxoptions:1,
        //标题
        title:'请选择...',
        //显示下拉框列表默认为8个选项，auto
        size:8,
        //是否有效
        disabled:false,
        //选项 ICONBase 
        iconBase:'fa',
         //图标
        tickIcon:'fa-check',
        //显示摘要的信息
        showSubtext:false,
        //显示图标
        showIcon:true,
        //显示内容
        showContent:true,
        //显示
        dropupAuto:true,
        //是否显示头信息
        header:false,
        //选择项值名称
        valuefield:'value',
        //选择项文本的名称
        textfield:'text',
        //容器
        container: false,
        //远程加载的URL
        loadurl:'',
        //格式 count>3
        selectedTextFormat: 'values',
        //当大于多选出现此信息
        countSelectedText: function (numSelected, numTotal) {
          return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
        },
        //
        maxOptionsText: function (numAll, numGroup) {
          var arr = [];
          arr[0] = (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)';
          arr[1] = (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)';
          return arr;
        }
    };

    /**
      * Remove all diatrics from the given text.
      * @access private
      * @param {String} text
      * @returns {String}
      */
     function normalizeToBase(text) {
       var rExps = [
         {re: /[\xC0-\xC6]/g, ch: "A"},
         {re: /[\xE0-\xE6]/g, ch: "a"},
         {re: /[\xC8-\xCB]/g, ch: "E"},
         {re: /[\xE8-\xEB]/g, ch: "e"},
         {re: /[\xCC-\xCF]/g, ch: "I"},
         {re: /[\xEC-\xEF]/g, ch: "i"},
         {re: /[\xD2-\xD6]/g, ch: "O"},
         {re: /[\xF2-\xF6]/g, ch: "o"},
         {re: /[\xD9-\xDC]/g, ch: "U"},
         {re: /[\xF9-\xFC]/g, ch: "u"},
         {re: /[\xC7-\xE7]/g, ch: "c"},
         {re: /[\xD1]/g, ch: "N"},
         {re: /[\xF1]/g, ch: "n"}
       ];
       $.each(rExps, function () {
         text = text.replace(this.re, this.ch);
       });
       return text;
     }

     function htmlEscape(html) {
        var escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '`': '&#x60;'
        };
        var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
            testRegexp = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g'),
            string = html === null ? '' : '' + html;
          return testRegexp.test(string) ? string.replace(replaceRegexp, function (match) {
          return escapeMap[match];
        }) : string;
      }

    /**组件函数
    *@param {[object]} [options] [对话框组件组件调用时初始化参数集合]
    */
    var Combo=function combox(element,options,e){
          if (e) {
            e.stopPropagation();
            e.preventDefault();
          }
          //节点
          this.$element = $(element);
          //新的点
          this.$newElement = null;
          //按钮
          this.$button = null;
          //下拉列表
          this.$menu = null;
          //列表数据
          this.$lis = null;
          //选项数据
          this.options = options;
          //Li高度
          this.liHeight=34;
          //获取标题数据
          if(util.isEmpty(this.options.title)||this.options.title!==this.$element.attr('placeholder')){
              this.options.title=this.$element.attr('placeholder');
          }
          this.options.multiple=this.$element.prop('multiple');

          this.val = Combo.prototype.val;
          this.render = Combo.prototype.render;
          this.refresh = Combo.prototype.refresh;
          this.setStyle = Combo.prototype.setStyle;
          this.selectAll = Combo.prototype.selectAll;
          this.deselectAll = Combo.prototype.deselectAll;
          this.destroy = Combo.prototype.remove;
          this.remove = Combo.prototype.remove;
          this.show = Combo.prototype.show;
          this.hide = Combo.prototype.hide;
          this.getData=Combo.prototype.getData;
          this.init();
    };
    //版本数据
    Combo.version=defaults.version;

    //创建Combox对象
    Combo.prototype = {
        //设置构造函数
        constructor: Combo,
        //设置初始化方法
        init:function(){
            //获取this 并获取该对象的ID
            var that=this,id=this.$element.attr('id');
            //
            this.autofocus = this.$element.prop('autofocus');
            //隐藏原生下拉列表
            this.$element.hide();
            //远程加载数据
            this.loadData();
            //创建下拉列表选择列表(ul li)
            this.$newElement = this.buildView();
            //下拉列表
            this.$element.after(this.$newElement);
            //下拉列表项
            this.$menu = this.$newElement.find('> .dropdown-menu');
            //按钮
            this.$button = this.$newElement.find('> button');
            //检查是否可用
            this.checkDisabled();
            //单点监听
            this.clickListener();
            //添加焦点事件
            this.focusoutListener();
            //加载数据
            this.render();
            //设置高度
            this.setLiHeight();
            //设置样式
            this.setStyle();
            //设置宽度
            this.setWidth();
            //设置布局信息
            if (this.options.container) this.layout();
            //加载菜单数据
            this.$menu.data('this', this);
            //加载菜单数据
            this.$newElement.data('this', this);
        },
         //创建下拉列表
        buildDropdown:function(){
            var multiple = this.options.multiple ? ' show-tick ' : '',
                selectClass=this.$element.attr('class'),
                btnSize = this.$element.parents().hasClass('form-group-lg') ? ' btn-lg' : (this.$element.parents().hasClass('form-group-sm') ? ' btn-sm' : '');
            var drop =
            '<div class="btn-group ' + selectClass+' '+multiple+ ' ">' +
                '<button type="button" class="btn dropdown-toggle show-tick lion-combo btn-sm  btn-default " data-toggle="dropdown">' +
                  '<span class="filter-option pull-left"></span>&nbsp;' +
                  '<span class="caret"></span>' +
                '</button>' +
                '<div class="lion-combo dropdown-menu open" style="margin-top:-3px;">' +
                  '<ul class="dropdown-menu inner " role="menu">' +
                  '</ul>' +
                '</div>' +
            '</div>';
            return $(drop);
        }, 
        //创建视图
        buildView:function(){
            var $drop = this.buildDropdown();
            var $li = this.buildSubLi();
            $drop.find('ul').append($li);
            return $drop;
        },
        //创建li
        buildSubLi:function(){
              var that = this,
              _li = [],
              optID = 0;
              /**
              * @param content
              * @param [index]
              * @param [classes]
              * @returns {string}
              */
             var generateLI = function (content, index, classes) {
               return '<li' +
               (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
               (typeof index !== 'undefined' | null === index ? ' data-original-index="' + index + '"' : '') +
               '>' + content + '</li>';
             };

             /**
              * @param text
              * @param [classes]
              * @param [inline]
              * @param [optgroup]
              * @returns {string}
              */
             var generateA = function (text, classes, inline, optgroup) {
               var normText = normalizeToBase(htmlEscape(text));
               return '<a tabindex="0"' +
               (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
               (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
               (typeof optgroup !== 'undefined' ? 'data-optgroup="' + optgroup + '"' : '') +
               ' data-normalized-text="' + normText + '"' +
               '>' + text +
               '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
               '</a>';
              };

              this.$element.find('option').each(function () {
               var $this = $(this);

               // Get the class and text for the option
               var optionClass = $this.attr('class') || '',
                   inline = $this.attr('style'),
                   text = $this.data('content') ? $this.data('content') : $this.html(),
                   subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="muted text-muted">' + $this.data('subtext') + '</small>' : '',
                   icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
                   isDisabled = $this.is(':disabled') || $this.parent().is(':disabled'),
                   index = $this[0].index;
               if (icon !== '' && isDisabled) {
                 icon = '<span>' + icon + '</span>';
               }

               if (!$this.data('content')) {
                 // Prepend any icon and append any subtext to the main text.
                 text = icon + '<span class="text">' + text + subtext + '</span>';
               }

               if (that.options.hideDisabled && isDisabled) {
                 return;
               }

               if ($this.parent().is('optgroup') && $this.data('divider') !== true) {
                 if ($this.index() === 0) { // Is it the first option of the optgroup?
                   optID += 1;

                   // Get the opt group label
                   var label = $this.parent().attr('label');
                   var labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="muted text-muted">' + $this.parent().data('subtext') + '</small>' : '';
                   var labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '';
                   label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

                   if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
                     _li.push(generateLI('', null, 'divider'));
                   }

                   _li.push(generateLI(label, null, 'dropdown-header'));
                 }

                 _li.push(generateLI(generateA(text, 'opt ' + optionClass, inline, optID), index));
               } else if ($this.data('divider') === true) {
                 _li.push(generateLI('', index, 'divider'));
               } else if ($this.data('hidden') === true) {
                 _li.push(generateLI(generateA(text, optionClass, inline), index, 'hide is-hidden'));
               } else {
                 _li.push(generateLI(generateA(text, optionClass, inline), index));
               }
             });
             if (!this.options.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
               this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
             }

             return $(_li.join(''));

        },
        //查找Lis标签
        findLis: function () {
          if (this.$lis === null) this.$lis = this.$menu.find('li');
            return this.$lis;
        },
        //重新加载数据Li
        reloadLi: function () {
          //this.destroyLi();
          //var $li = this.buildSubLi();
        },
        //删除Li标签
        destroyLi: function () {
            this.$menu.find('li').remove();
        },
         //是否可用
        isDisabled:function(){
              return this.$element.is(':disabled');
        },
        //添加焦点去事件
        focusoutListener:function(){
          var that=this;
          this.$menu.on('focusout', 'li a', function (e) {
            //触发select的焦点事件
             that.$element.trigger('focusout');
          });
        },
        //添加事件
        clickListener: function () {
              var that = this;

              this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function (e) {
                  e.stopPropagation();
              });

              this.$newElement.on('click', function () {
              that.setSize();
                if (!that.options.liveSearch && !that.multiple) {
                    setTimeout(function () {
                    that.$menu.find('.selected a').focus();
                  }, 10);
                }
              });

              this.$menu.on('click', 'li a', function (e) {
                 var $this = $(this),
                     clickedIndex = $this.parent().data('originalIndex'),
                     prevValue = that.$element.val(),
                     prevIndex = that.$element.prop('selectedIndex');
                 //是否多选
                 if (that.options.multiple&&that.options.maxoptions>1) {
                      e.stopPropagation();
                 }
                 e.preventDefault();

                 //Don't run if we have been disabled
                 if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
                   var $options = that.$element.find('option'),
                       $option = $options.eq(clickedIndex),
                       state = $option.prop('selected'),
                       $optgroup = $option.parent('optgroup'),
                       maxoptions = that.options.maxoptions,
                       maxoptionsGrp = $optgroup.data('maxoptions') || false;

                   if (!that.options.multiple) { // Deselect all others if not multi select box
                     $options.prop('selected', false);
                     $option.prop('selected', true);
                     that.$menu.find('.selected').removeClass('selected');
                     that.setSelected(clickedIndex, true);
                   } else { // Toggle the one we have chosen if we are multi select.
                     $option.prop('selected', !state);
                     that.setSelected(clickedIndex, !state);
                     $this.blur();

                     if ((maxoptions !== false) || (maxoptionsGrp !== false)) {
                       var maxReached = maxoptions < $options.filter(':selected').length,
                           maxReachedGrp = maxoptionsGrp < $optgroup.find('option:selected').length;

                       if ((maxoptions && maxReached) || (maxoptionsGrp && maxReachedGrp)) {
                         if (maxoptions && maxoptions == 1) {
                           $options.prop('selected', false);
                           $option.prop('selected', true);
                           that.$menu.find('.selected').removeClass('selected');
                           that.setSelected(clickedIndex, true);
                         } else if (maxoptionsGrp && maxoptionsGrp == 1) {
                           $optgroup.find('option:selected').prop('selected', false);
                           $option.prop('selected', true);
                           var optgroupID = $this.data('optgroup');

                           that.$menu.find('.selected').has('a[data-optgroup="' + optgroupID + '"]').removeClass('selected');

                           that.setSelected(clickedIndex, true);
                         } else {
                           var maxoptionsArr = (typeof that.options.maxoptionsText === 'function') ?
                                   that.options.maxoptionsText(maxoptions, maxoptionsGrp) : that.options.maxoptionsText,
                               maxTxt = maxoptionsArr[0].replace('{n}', maxoptions),
                               maxTxtGrp = maxoptionsArr[1].replace('{n}', maxoptionsGrp),
                               $notify = $('<div class="notify"></div>');
                           // If {var} is set in array, replace it
                           /** @deprecated */
                           if (maxoptionsArr[2]) {
                             maxTxt = maxTxt.replace('{var}', maxoptionsArr[2][maxoptions > 1 ? 0 : 1]);
                             maxTxtGrp = maxTxtGrp.replace('{var}', maxoptionsArr[2][maxoptionsGrp > 1 ? 0 : 1]);
                           }

                           $option.prop('selected', false);

                           that.$menu.append($notify);

                           if (maxoptions && maxReached) {
                             $notify.append($('<div>' + maxTxt + '</div>'));
                             that.$element.trigger('maxReached.bs.select');
                           }

                           if (maxoptionsGrp && maxReachedGrp) {
                             $notify.append($('<div>' + maxTxtGrp + '</div>'));
                             that.$element.trigger('maxReachedGrp.bs.select');
                           }

                           setTimeout(function () {
                             that.setSelected(clickedIndex, false);
                           }, 10);

                           $notify.delay(750).fadeOut(300, function () {
                             $(this).remove();
                           });
                         }
                       }
                     }
                   }

                   if (!that.options.multiple) {
                     that.$button.focus();
                   } else if (that.options.liveSearch) {
                     that.$searchbox.focus();
                   }

                   // Trigger select 'change'
                   if ((prevValue != that.$element.val() && that.options.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.options.multiple)) {
                        that.$element.change();
                   }
                 }
               });

               this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
                 if (e.target == this) {
                   e.preventDefault();
                   e.stopPropagation();
                   if (!that.options.liveSearch) {
                     that.$button.focus();
                   } else {
                     that.$searchbox.focus();
                   }
                 }
               });

               this.$menu.on('click', 'li.divider, li.dropdown-header', function (e) {
                 e.preventDefault();
                 e.stopPropagation();
                 if (!that.options.liveSearch) {
                   that.$button.focus();
                 } else {
                   that.$searchbox.focus();
                 }
               });

               this.$menu.on('click', '.popover-title .close', function () {
                 that.$button.focus();
               });
              

               this.$menu.on('click', '.actions-btn', function (e) {
                 if (that.options.liveSearch) {
                   that.$searchbox.focus();
                 } else {
                   that.$button.focus();
                 }

                 e.preventDefault();
                 e.stopPropagation();

                 if ($(this).is('.bs-select-all')) {
                   that.selectAll();
                 } else {
                   that.deselectAll();
                 }
                 that.$element.change();
               });

               this.$element.change(function () {
                 that.render(false);
               });
        },
        tabIndex: function () {
          if (this.$element.is('[tabindex]')) {
            this.$element.data('tabindex', this.$element.attr('tabindex'));
            this.$button.attr('tabindex', this.$element.data('tabindex'));
          }
        },
        /**
          * @param [updateLi] defaults to true
          */
        render: function (updateLi) {
           var that = this;

           //Update the LI to match the SELECT
           if (updateLi !== false) {
             this.$element.find('option').each(function (index) {
               that.setDisabled(index, $(this).is(':disabled') || $(this).parent().is(':disabled'));
               that.setSelected(index, $(this).is(':selected'));
             });
           }

           this.tabIndex();
           var notDisabled = this.options.hideDisabled ? ':not([disabled])' : '';
           var selectedItems = this.$element.find('option:selected' + notDisabled).map(function () {
             var $this = $(this);
             var icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '';
             var subtext;
             if (that.options.showSubtext && $this.attr('data-subtext') && !that.options.multiple) {
               subtext = ' <small class="muted text-muted">' + $this.data('subtext') + '</small>';
             } else {
               subtext = '';
             }
             if ($this.data('content') && that.options.showContent) {
               return $this.data('content');
             } else if (typeof $this.attr('title') !== 'undefined') {
               return $this.attr('title');
             } else {
               return icon + $this.html() + subtext;
             }
           }).toArray();

           //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
           //Convert all the values into a comma delimited string
           var title = !this.options.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

           //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
           if (this.options.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
             var max = this.options.selectedTextFormat.split('>');
             if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
               notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
               var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                   tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
               title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
             }
           }

           this.options.title = this.$element.attr('placeholder');

           if (this.options.selectedTextFormat == 'static') {
                title = this.options.title;
           }

           //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
           if (!title) {
             title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
           }

           this.$button.attr('title', htmlEscape(title));
           this.$newElement.find('.filter-option').html(title);
        },

        //初始化检查是否可用
        checkDisabled: function () {
          var that = this;
          if (this.isDisabled()) {
            this.$button.addClass('disabled').attr('tabindex', -1);
          } else {
            if (this.$button.hasClass('disabled')) {
              this.$button.removeClass('disabled');
            }

            if (this.$button.attr('tabindex') == -1) {
              if (!this.$element.data('tabindex')) this.$button.removeAttr('tabindex');
            }
          }

          this.$button.click(function () {
            return !that.isDisabled();
          });
        },
        //加载远程数据
        loadData:function(){
          //加载远程数据
          //如果URL为空，则直接返回
          if(util.isEmpty(this.options.loadurl)){
            return;
          }
          //Ajax调用获取并Select构建数据
          var that=this;
          function buildOptions(data,arg){
 
            var value='codeValue',soption='';
            for(var i in data){
               var spValue,spText,selected;
             
               if(that.options.valuefield==='value'&&that.options.textfield==='text'){
                    spValue=data[i].value;
                    spText=data[i].text;
                    if(data[i].selected){
                      selected=data[i].selected;  
                    }
               }else{                          
                 $.each(data[i],function(key,text){
                     if(key===that.options.valuefield){
                        spValue=text;
                     }
                     if(key==='selected'){
                        selected=text;
                     }
                     if(key===that.options.textfield){
                        spText=text;
                     }
                  });
               }
              if(util.isNotEmpty(spValue)&&util.isNotEmpty(spText)){
                      soption+='<option value="'+spValue+'" ';
                      if(selected){
                        soption+=selected;
                      }
                      soption+='>'+spText+'</option>';
              }
            }
            if(util.isNotEmpty(soption)){
              that.$element.empty();
              that.$element.append(soption);
            }
          }
          function reqError(xhr,textStatus,error){
            //TODO
            // console.dir(xhr);
            //console.dir(textStatus);
            // console.dir(error);
          }
          //Ajax请求

          util.get(this.options.loadurl,buildOptions,reqError);
        },
        //设置Li的高度
        setLiHeight:function(){

            if (this.options.size === false) return;

            var $selectClone = this.$menu.parent().clone().find('> .dropdown-toggle').prop('autofocus', false).end().appendTo('body'),
                $menuClone = $selectClone.addClass('open').find('> .dropdown-menu'),
                liHeight = $menuClone.find('li').not('.divider').not('.dropdown-header').filter(':visible').children('a').outerHeight(),
                headerHeight = this.options.header ? $menuClone.find('.popover-title').outerHeight() : 0,
                searchHeight = this.options.liveSearch ? $menuClone.find('.bs-searchbox').outerHeight() : 0,
                actionsHeight = this.options.actionsBox ? $menuClone.find('.bs-actionsbox').outerHeight() : 0;

            $selectClone.remove();
            this.liHeight=liHeight;
        },
        //设置显示列表项数创建
        setSize:function(){
            this.findLis();
            var that = this,
                menu = this.$menu,
                menuInner = menu.find('.inner'),
                selectHeight = this.$newElement.outerHeight(),
                liHeight =this.liHeight,
                headerHeight = this.$newElement.data('headerHeight'),
                searchHeight = this.$newElement.data('searchHeight'),
                actionsHeight = this.$newElement.data('actionsHeight'),
                divHeight = this.$lis.filter('.divider').outerHeight(true),
                menuPadding = parseInt(menu.css('padding-top')) +
                    parseInt(menu.css('padding-bottom')) +
                    parseInt(menu.css('border-top-width')) +
                    parseInt(menu.css('border-bottom-width')),
                notDisabled = this.options.hideDisabled ? ', .disabled' : '',
                $window = $(window),
                menuExtras = menuPadding + parseInt(menu.css('margin-top')) + parseInt(menu.css('margin-bottom')) + 2,
                menuHeight,
                selectOffsetTop,
                selectOffsetBot,
                posVert = function () {
                  selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
                  selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
                };
            posVert();
            if (this.options.header) menu.css('padding-top',0);

            if (this.options.size == 'auto') {
                var getSize = function () {
                var minHeight,
                    lisVis = that.$lis.not('.hide');

                posVert();
                menuHeight = selectOffsetBot - menuExtras;

                if (that.options.dropupAuto) {
                  that.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && ((menuHeight - menuExtras) < menu.height()));
                }
                if (that.$newElement.hasClass('dropup')) {
                  menuHeight = selectOffsetTop - menuExtras;
                }

                if ((lisVis.length + lisVis.filter('.dropdown-header').length) > 3) {
                  minHeight = liHeight * 3 + menuExtras - 2;
                } else {
                  minHeight = 0;
                }

                menu.css({
                  'max-height': menuHeight + 'px',
                  'overflow': 'hidden',
                  'min-height': minHeight + headerHeight + searchHeight + actionsHeight + 'px'
                });
                menuInner.css({
                  'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - menuPadding + 'px',
                  'overflow-y': 'auto',
                  'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
                });
              };
              getSize();
              this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
              $(window).off('resize.getSize').on('resize.getSize', getSize);
              $(window).off('scroll.getSize').on('scroll.getSize', getSize);
            } else if (this.options.size && this.options.size != 'auto' && menu.find('li' + notDisabled).length > this.options.size) {
              var optIndex = this.$lis.not('.divider' + notDisabled).find(' > *').slice(0, this.options.size).last().parent().index();
              var divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
              menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;
              if (that.options.dropupAuto) {
                //noinspection JSUnusedAssignment
                this.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && (menuHeight < menu.height()));
              }
              menu.css({'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + 'px', 'overflow': 'hidden'});
              menuInner.css({'max-height': menuHeight - menuPadding + 'px', 'overflow-y': 'auto'});
            }
        },
        //设置选中状态
        setSelected: function (index, selected) {
          this.findLis();
          this.$lis.filter('[data-original-index="' + index + '"]').toggleClass('selected', selected);
        },
        //设置不可用状态
        setDisabled: function (index, disabled) {
          this.findLis();
          if (disabled) {
            this.$lis.filter('[data-original-index="' + index + '"]').addClass('disabled').find('a').attr('href', '#').attr('tabindex', -1);
          } else {
            this.$lis.filter('[data-original-index="' + index + '"]').removeClass('disabled').find('a').removeAttr('href').attr('tabindex', 0);
          }
        },
        //设置宽度
        setWidth:function(){
          if (this.options.width == 'auto') {
            this.$menu.css('min-width','0');
            // Get correct width if element hidden
            var selectClone = this.$newElement.clone().appendTo('body');
            var ulWidth = selectClone.find('> .dropdown-menu').css('width');
            var btnWidth = selectClone.css('width', 'auto').find('> button').css('width');
            selectClone.remove();

            // Set width to whatever's larger, button title or longest option
            this.$newElement.css('width', Math.max(parseInt(ulWidth), parseInt(btnWidth)) + 'px');
          } else if (this.options.width == 'fit') {
            // Remove inline min-width so width can be changed from 'auto'
            this.$menu.css('min-width', '');
            this.$newElement.css('width', '').addClass('fit-width');
          } else if (this.options.width) {
            // Remove inline min-width so width can be changed from 'auto'
            this.$menu.css('min-width', '');
            this.$newElement.css('width', this.options.width);
          } else {
            // Remove inline min-width/width so width can be changed
            this.$menu.css('min-width', '');
            this.$newElement.css('width', '');
          }
          // Remove fit-width class if width is changed programmatically
          if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
            this.$newElement.removeClass('fit-width');
          }
        },
        /**
         * @param [style]
         * @param [status]
         */
        setStyle: function (style, status) {
          if (this.$element.attr('class')) {
            this.$newElement.addClass(this.$element.attr('class').replace(/lion-combo|mobile-device|validate\[.*\]/gi, ''));
          }

          var buttonClass = style ? style : this.options.style;

          if (status == 'add') {
            this.$button.addClass(buttonClass);
          } else if (status == 'remove') {
            this.$button.removeClass(buttonClass);
          } else {
            this.$button.removeClass(this.options.style);
            this.$button.addClass(buttonClass);
          }
        },
        //设置显示位置及布局
        layout:function(){
          var that = this,drop = '<div />',$drop = $(drop),pos,actualHeight;
          var getPlacement = function ($element) {
              $drop.addClass($element.attr('class').replace(/form-control/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
              pos = $element.offset();
              actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
              $drop.css({
                'top': pos.top + actualHeight,
                'left': pos.left,
                'width': $element[0].offsetWidth,
                'position':'absolute'
              });
          };

          this.$newElement.on('click', function () {            
                if (that.isDisabled()) {
                   return;
                }
                getPlacement($(this));
                
                $drop.appendTo(that.options.container);

                $drop.toggleClass('open', !$(this).hasClass('open'));

                $drop.append(that.$menu);
                
           });

           $(window).resize(function () {
                 getPlacement(that.$newElement);
           });

           $(window).on('scroll', function () {
                getPlacement(that.$newElement);
           });

           $('html').on('click', function (e) {
             if ($(e.target).closest(that.$newElement).length < 1) {
                $drop.removeClass('open');
             }
           });
        },
        //获取数据 根据value获取值
        val:function(value){
             if (typeof value !== 'undefined') {
                this.$element.val(value);
                this.render();
                return this.$element;
            } else {
                return this.$element.val();
            }
        },
        //选择所有列表数据
        selectAll:function(){},
        //设置反向选择数据
        deselectAll:function(){},
        //刷新拉列表数据
        refresh: function () {

        },
       //更新数据
       update: function () {
         this.reloadLi();
         this.setWidth();
         this.setStyle();
         this.checkDisabled();
         this.setLiHeight();
       },
       //隐藏
       hide: function () {
         this.$newElement.hide();
       },
       //显示
       show: function () {
         this.$newElement.show();
       },
       //删除
       remove: function () {
         this.$newElement.remove();
         this.$element.remove();
       },
       //获取所有数据
       getData:function(){
          var dataObj ='[',that=this,i=0,size=this.$element.find('option').size();         
          this.$element.find('option').each(function(){
              i++;
              var $this=$(this);
              dataObj+='{"'+that.options.valuefield+'":'+'"'+$this.val()+'","'+that.options.textfield+'":'+'"'+$this.text()+'"}';
              if(i<size){
                  dataObj+=',';
              }
          });
          dataObj+=']';
          return JSON.parse(dataObj);
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

    // SELECTPICKER NO CONFLICT
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