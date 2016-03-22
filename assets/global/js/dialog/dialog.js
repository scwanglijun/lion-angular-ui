/**
 * Newtouch Lion UI 0.1
 * 
 * Copyright (c) 2009-2014 www.newtouch.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at lijun.wang1@newtouch.cn
 */
/**
 * @author wanglijun
 * @date 2015-01-13
 * lion dialog lib - jQuery Lion UI
 * 对话框
 * Dependencies js:
 * jQuery.js bootstrap.js lion.js 
 * Depedencies css
 * bootstrap.css  lion.css,dialog.css (Bootstrap v3.3.1)
 */
;(function ($){
	'use strict';
	this.ui = this.ui || {}; //定义ui对象。为避免覆盖如果存在ui对象则使用，不存在则新建
    var util = this.util, //用变量存储util.js中的方法，方便调用
        exports = this.ui, //用变量存储ui下的方法，可直接使用此变量追加组件。如不这样需要this.ui.add追加
        _version = this.version,//组件版本号
        _id = 0,//id
        _catchPrefix = 'ui-dialog-',//组件缓存对象前缀
        _idPrefix = this.namespace + '-dialog-',//自定义id前缀
        events = {};//按钮事件缓存区
     var templates={
        //对话框架容器
        container:'<div class="lion-modal" id="ajax" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">',
        //遮罩层的模板,需要设计高度
        backdrop:'<div class="lion-modal-backdrop fade"></div>',
        //显示加载进度条
        loading:'<div class="page-loading page-loading-boxed">'+
                    '<img src="/admin/resources/global/img/loading-spinner-grey.gif" alt="" class="loading">'+
                    '<span>&nbsp;&nbsp;Loading... </span>'+
                '</div>',
        //对话框的内容
        dialogcontent:'<div class="lion-modal-dialog animated"><div class="lion-modal-content"></div></div>',
        //对话框的标题和头信息
        header:'<div class="lion-modal-header">'+
                    '<h4 class="lion-modal-title bule"></h4>'+
               '</div>',
        //设计对话框的图标字体
        titleIcon:'<i class="fa"></i>',
        //对话框的body部分
        content:'<div class="lion-modal-body"></div>',
        
        footer:'<div class="lion-modal-footer">'+
                    '<button type="button" class="btn default" data-dismiss="lion-modal"> 取 消 </button>'+
                    '<button type="button" id="btnSave" class="btn blue"> 保 存 </button>'+
                '</div>',
        //对话框的关闭按钮
        closeBtn:'<button type="button" class="close" data-dismiss="lion-modal" aria-hidden="true"></button>'
     };
    //设置对话框架默认对话
    var defaults = {
        id:'',
        /**组件版本号*/
        version: _version,
        // show backdrop or not
        backdrop: true,
        // animate the lion-modal in/out
        animate: true,
        // keyboard 按ESC退出对话框
        keyboard:false,
        // additional class string applied to the top level dialog
        className: null,
        // whether or not to include a close button
        closeButton: true,
        // 默认是不显示的
        show: false,
        // dialog container
        container: 'body',
        // dialog Title
        title:'对话框',
        //对话框图标字体clessName
        titleIcon:'',
        // dialog 是否对话框的标题栏
        showHeader:true,
        // dialog 是否对话的底部栏
        showFooter:true,
        // 动态加载页面的URL
        loadurl:'',
        // 内容可以HTML或文本
        content:'',
        //按钮的位置 默认为居中对齐
        btnalign:'center',
        //对话框的宽度
        width: $('body').width() * 0.95 + 'px',
        //对话框的高度
        height:'auto',
        //最大高度
        maxHeight:'80%',
        //对话框的位置
        position:{
            top:'35%',
            left:"50%",
        },
        //默认为两个按钮，一个为取消，另一个为确认,默认取消为关闭对话框按钮
        //buttons:[
        //     {id:"",handler:function(){},icon:'',className:'btn default',value:' 取 消 ',dismiss:true},
        //    {id:"",headler:function(){},icon:'',className:'btn blue',value:' 确 认 ',dismiss:false},
        // ]
    };
    /**组件函数
    *@param {[object]} [options] [对话框组件组件调用时初始化参数集合]
    */
   function dialog(options){
        //将传入的参数和默认参数，以后为传参数为，options||{},表示该语句在options已经被初始化过后options的值不变，即执行var options = options这一部分。
       //当options未被初始化，即typeof options = 'undefined'时，执行后面部分即var options = {}来初始化一个对象
        options=$.extend(defaults,options||{});
   		var main={
            /** 储存初始化参数*/
            options: options,
            /**缓存组件对象*/
            dialog: null,
            /**初始化函数*/
            init:function(){
                //console.dir(this.options);
                //如果未传入id,使用自定义规则生成的ID
                if (!this.options.id) {
                    this.options.id = this.getId();
                }
                //查找组件
                this.dialog = $('#'+ this.options.id);
                //判断对话框是否已创建
                if(this.dialog.size()<1){
                     //把模板变为jQuery DOM对象
                     this.dialog = $(templates.container);
                     //设置对话框的ID
                     this.dialog.attr('id', this.options.id);
                     //判断是否设置背景,当设置为static时，当用户点击模态框外部时不会关闭模态框，除外点击可关闭对话框
                     if(this.options.backdrop||this.options.backdrop=='static'){
                         //TODO
                        this.dialog.append(templates.backdrop);
                        this.dialog.find('div.lion-modal-backdrop').css('height',$(window).height());
                     }
                     //设置加载进度条
                     this.dialog.append(templates.loading);
                     //设置对话框的主体内容
                     this.dialog.append(templates.dialogcontent);
                     //设置对话框页头
                     this.setHeader();
                     //设置对话框Body
                     this.setContent();                   
                     //设置对话框页脚
                     this.setFooter();                   
                     $(this.options.container).append(this.dialog);
                     console.dirxml(this.dialog);
                     $(this.options.body).append(this.dialog);
                     if(this.options.show){
                        mian.open();
                     }
                }else{
                  
                    main.open();
                }

            },
            getId:function(){
                //生成ID
                this.options.id=_idPrefix + (++_id);
                return  this.options.id;
            },
            open:function(){
                //TODO 添加动画
                var e = $.Event('open');
                this.dialog.trigger(e);
                //如已经事件阻止，则返回
                if (e.isDefaultPrevented()) return;
               
                //加载内容
                main.loadpage();
                //显示对话框
                this.dialog.show();
                //加载页面布局
                main.layout();

                //加载背景
                if(this.options.backdrop||this.options.backdrop=='static'){
                    this.dialog.find('div.lion-modal-backdrop').addClass('in');
                }
              
                this.dialog.attr('aria-hidden',false);
            },
            title:function(title){
                //设置关闭按钮
                 if(this.options.closeButton){
                    this.dialog.find('div.lion-modal-header>h4').before(templates.closeBtn);
                    this.dialog.find('div.lion-modal-header button.close').click(function(){
                        main.close();
                    });
                 }
                //设置标题
                if(util.isNotEmpty(this.options.title)){
                    this.dialog.find('div.lion-modal-header >h4').text(this.options.title);
                }
                //设置图标
                if(util.isNotEmpty(this.options.titleIcon)){
                    if(this.dialog.find('div.lion-modal-header').children('i').size()<1){
                        this.dialog.find('div.lion-modal-header>h4').prepend(templates.titleIcon);
                    }
                    this.dialog.find('div.lion-modal-header .lion-modal-title>i').addClass(this.options.titleIcon);
                }              
            },
            setContent:function(){
                //设置内容加载               
                 this.dialog.find('div.lion-modal-content').append(templates.content);               
                 if(util.isNotEmpty(this.options.content)){
                     main.loading('on');
                     this.dialog.find('div.lion-modal-body').append(this.options.content);
                     main.loading('off');
                 }else if(util.isNotEmpty(this.options.loadurl)){
                     main.loadpage();
                 }
            },
            loadpage:function(){
                //动态加载页面
                 main.loading('on');              
                 this.dialog.find('div.lion-modal-body').children().remove();
                 this.dialog.find('div.lion-modal-body').load(this.options.loadurl,null,function(){
                     main.loading('off');
                 });
            },
            layout:function(){
                //页面布局
                var modelDialog=this.dialog.find('div.lion-modal-dialog');
                 
                if (this.options.width){
                    this.dialog.find('div.lion-modal-dialog').css('width',this.options.width);
                    var that=this;
                    modelDialog.css('margin-left', function () {
                        if (/%/ig.test(that.options.width)){
                            return (parseInt(that.options.width) / 2) + '%';
                        } else {
                            return (($(window).width()-that.options.width) / 2) + 'px';
                        }
                    });
                } else {
                    modelDialog.css('width', '');
                    modelDialog.css('margin-left', '');
                }

                //TODO 处理对话框的高度
                var prop = this.options.height? 'height':'max-height',
                value = this.options.height || this.options.maxHeight;

                this.dialog.find('.modal-body')
                .css('overflow', '')
                .css(prop, '');

                if (value){
                    this.dialog.find('.modal-body')
                        .css('overflow', 'auto')
                        .css(prop, value);
                }

                var modalOverflow = $(window).height()-40<modelDialog.height();
                if (modalOverflow || this.options.modalOverflow) {
                   modelDialog.css('margin-top',0).addClass('lion-modal-overflow');
                } else {
                    modelDialog.css('margin-top',40) .removeClass('lion-modal-overflow');
                    modelDialog.css('height',this.options.height);
                }


            },
            setHeader:function(){
                //判断是否显示标题，设置对话框标题
                 if(this.options.showHeader){
                     this.dialog.find('div.lion-modal-content').append(templates.header);
                     main.title(this.options.title);
                 }
            },
            setFooter:function(){
                //设置页脚加载
                this.dialog.find('div.lion-modal-content').append(templates.footer);
                //调用加载按钮
                main.setButtons();
            },
            setButtons:function(){
                //console.log('Footer设置按钮');
                //判断对话按为空的情况
                if(this.options.buttons===null||this.options.buttons===undefined){
                  
                }
                if(this.options.buttons){
                    var buttonHtml='';
                    this.dialog.find('div.lion-modal-footer').empty(); 
                    var that=this;                   
                    $.each(this.options.buttons,function(key,button){
                        buttonHtml+='<button  type="button" ';
                        if(button.id){
                            buttonHtml+='id="'+button.id+'" ';
                        }
                        if(button.className){
                           buttonHtml+='class="'+button.className+'" ';
                        }else{
                           buttonHtml+='class=btn ';
                        }
                        if(button.dismiss){
                            buttonHtml+='data-dismiss="lion-modal" ';
                        }
                        buttonHtml+='>';
                        if(button.icon){
                            buttonHtml+='<i class="'+button.icon+'"></i>';
                        }
                        if(button.value){
                            buttonHtml+=button.value;
                        }                        
                        buttonHtml+='</button>';
                        that.dialog.find('div.lion-modal-footer').append(buttonHtml);
                        //绑定
                        if(button.headler&&util.isFunction(button.headler)){
                             that.dialog.find('div.lion-modal-footer').find("button:last-child").on('click',button.headler);
                        }                       
                        buttonHtml='';                    });
                   
                }
                //绑定关闭按钮
                this.dialog.find('div.lion-modal-footer [data-dismiss="lion-modal"]').click(function(){
                         main.close();
                }); 

                //按钮对对齐方式
                var btnalignClass='btnalignright';
                if(this.options.btnalign==='center'){
                    btnalignClass='btnaligncenter';
                }else if(this.options.btnalign==='left'){
                    btnalignClass='btnalignleft';
                }else if(this.options.btnalign==='right'){
                    btnalignClass='btnalignright';
                }
                this.dialog.find('div.lion-modal-footer').addClass(btnalignClass);
            },
            close:function(){
                this.dialog.hide();
            },
            loading:function(status){
                //判断的加载状态，是否关闭加载进度条
                var displayStatus='';
                if(util.isEmpty(status)||"off"===status){
                    displayStatus='none';
                }else if('on'===status){
                   displayStatus='block';
                }
                if(util.isNotEmpty(displayStatus)){
                    this.dialog.find('div.page-loading').css('display',displayStatus);
                }
            },
            destroy:function(){                
                var e = $.Event('destroy');
                this.dialog.trigger(e);
                //如已经事件阻止，则返回
                if (e.isDefaultPrevented()) return;
                //DOM文档结构中删除
                this.dialog.remove();
            },
            on:function(e,callback){
                //绑定事件
                this.dialog.on(e,callback);
            }
   		};
        main.init();
        return{
            id:function(){return main.options.id;},
            open:function(){main.open();return this;},
            show:function(){main.open();return this;},
            title:function(title){ain.setTitle(title);return this;},
            close:function(){main.close();return this;},
            loading:function(){main.loading();return this;},
            destory:function(){main.destroy();return this;},
            on:function(e,callback){main.on(e,callback);return this;}
        };
    }
   /**向外扩展Dialog的功能
   * @param {[object]} [options] [对话框初始化参数对象]
   */
    exports.dialog=function(options){       
        return new dialog(options);
    };     
   
}).call(lion,jQuery);