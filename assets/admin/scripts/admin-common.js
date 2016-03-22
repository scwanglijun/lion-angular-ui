/**
 * Newtouch Admin-Web-Common UI 0.1
 * 
 * Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at lijun.wang1@newtouch.cn
 */
/**
 * admin-common core lib - jQuery LionUI
 * @author wanglijun
 * @date 2015-01-13
 * Dependencies:
 * jQuery.js; lion.js
 */
;(function(){
    'use strict';
     var exports={},util = this.util;
     this.web=exports||{};
     //未登录 998 ，未授权 999,登录的url,
     var perms={unlogin:'998',unauth:'999',loginurl:'/login.htm'};
     //默认消息
     var defaultmsgs={title:'提示',msgfail:'操作失败', unselectedmsg:'请选择要删除记录',confirmmsg:'确认要删除此记录？'};
     //Ajax请求超时间为5秒
     exports.timeout=5000;
     //Ajax请求函数
     var ajaxoptions={
        target:'',
        url:'',
        data:{},
        success:$.noop,
        error:$.noop,
        args:{},
     };
     //data 解析类的参数
     var dataoptions={
        data:{},
        form:{},
        success:$.noop,
        error:$.noop,
        msg:defaultmsgs.msgfail,
     };

     //解析Ajax成功的,主要针对Spring mvc的参数
     exports.parsedata=function(options){     
        options = $.extend(true,dataoptions,options);
        var successfn=options.success||$.noop,
            errorfn=options.error||$.noop,
            data=options.data;
        if(data!==null&&!(data.hasError)){
            util.success(defaultmsgs.title,data.message);
            successfn.call(this);
        }else if(data!==null&&data.hasError){
            var globalmsg='';
            for(var msg in data.errorMessage){
              globalmsg+=data.errorMessage[msg];
            }
            if(lion.util.isEmpty(globalmsg)){
               util.error(defaultmsgs.title,options.msg);
            }else{
               util.error(defaultmsgs.title,globalmsg);
            }
        }else{
              util.error(defaultmsgs.title,options.msg);
        }
     };
     /**专于用WebAdmin后台处理*/
     exports.post=function(options){
        options = $.extend(true,ajaxoptions,options);
        var beforefn=ajaxBefore||$.noop,
            completefn=ajaxComplete||$.noop, 
            ajaxErrorfn=ajaxError||$.noop,
            successfn=options.success||$.noop,
            errorfn=options.error||$.noop;
        $.ajax({
            url:options.url,
            type:'post',              
            data:options.data,
            dataType:'json',
            cache:false,
            timeout:exports.timeout,
            beforeSend:function(xhr){
                //请求前处理
                beforefn.call(this,xhr,options.target);
            },
            error:function(xhr,status,error) {
                //请求失败处理内容
                ajaxErrorfn.call(this,errorfn,xhr,status,error,options.args);
            },
            complete:function(xhr,status){
                //请求完成的处理
                completefn.call(this,xhr,status,options.target);
            },
            success:function(data,status,xhr) {
                //请求成功处理
                successfn.call(this,data,options.args);
            }
        });
     };
     //
     exports.perms=perms;
     //请求之前处理请求
     function ajaxBefore(xhr,uitarget){
        //加载进度条
        if(uitarget===null){
            Metronic.blockUI({animate:true,cenrerY:true});
        }else{
            Metronic.blockUI({target:uitarget,animate:true,cenrerY:true,overlayColor:'none'});
        }
     }
     //请求完成处理
     function ajaxComplete(xhr,status,target){
        //请求完成后处理内容
        //console.dir('请求完成后处理内容');
        if(target===null){
            Metronic.unblockUI(target);
        }else{
            Metronic.unblockUI();
        }
       //关闭请求条
     } 
     //请求错误内容
     function ajaxError(errorfn,xhr,status,error){
        //请求未登录和未授权的情况
        //Metronic.unblockUI();
        if(error===perms.unlogin){
              //未登录情况，点击确定新登录
            bootbox.alert('<span class="red">您未登录到信息，点击“确定”后，将进入用户登录页面.</span>',
              function() {
                     lion.util.reload();
              });
        }else if(error===perms.unauth){
              //提示没有权限访问该资源
              util.warning(defaultmsgs.title,'您的访问功能未等到授权');
        }else{
            if(errorfn===$.noop){
                util.error(defaultmsgs.title,'网络连接异常');
            }else{
                errorfn.call(xhr,status,error);
            }
        }
     }
     //通用删除函数默认参数
     var btnDeleteOptions={
        url:'', //url
        data:'', //数据
        unselectedmsg:defaultmsgs.unselectedmsg,//未选择数据
        confirmmsg:defaultmsgs.confirmmsg,//确认消息
        params:{
            keyName:'id',//参数的KEY的名称
            valueName:'id'//参数的Value的名称；
        },
        success:$.noop, //成功函数
        error:$.noop, //失败函数 
        msg:defaultmsgs.msgfail,
     };
     //通用删除函数默认参数 
     exports.deletefn=function(options){
        options = $.extend(true,btnDeleteOptions,options);
        //判断是否有数据
        if(!options.data){              
            util.info(defaultmsgs.title,options.unselectedmsg);
            return;
        }
        //提示用户是否删除
        bootbox.confirm(options.confirmmsg, function(result) {
              if(result){              
                  var param={};
                  if(options.data.hasOwnProperty(options.params.valueName)){
                        param[options.params.keyName]=options.data[options.params.valueName];
                  }else{
                       util.warning(defaultmsgs.title,'参数不正确');
                       return;
                  }
                  //调用Ajax post提交，删除函数
                  exports.post({
                    url:options.url,
                    data:param,
                    success:options.success,
                    error:options.error});
              }
        }); 
     };

     //通用导出函数默认参数
     var  btnExportOptions={
        url:'export.json',
        data:null,
        tableId:''
     };
     //通用导出函数
     exports.exportfn=function(options){
         options = $.extend(true,btnDeleteOptions,options);
         var url=options.url;
         //检查是否带参数
         if (url.indexOf('?')===-1) {
                url+='?';
         }
         //检查tableId是否空
         if(util.isNotEmpty(options.tableId)){
            url+='tableId='+options.tableId;
         }
         //检查是否有参数
         if(util.isNotEmpty(options.data)){
            url+='&'+options.data;
         }
         //从新的窗口
         window.open(url,'_blank');
     };
     
     //当前默认加载函数
     exports.AppInit=function(){
    	//加载bootstrap
		Metronic.init(); // init metronic core componets
		Layout.init(); // init layout
		Tasks.initDashboardWidget(); // init tash dashboard widget
		util.menu();//加载导航栏
     }
}).call(lion,jQuery);

/**全局请求错误*/
function errorRequest(xhr,status,error){
    util.error(defaultmsgs.title,'网络连接异常');
}