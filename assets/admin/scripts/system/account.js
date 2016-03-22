$(function () {
	//默认加载函数
	lion.web.AppInit();

	var $formuser=$('#formuser'),//基本信息
		  $formpassword=$('#formpassword'),//修改密码
		  $formimg=$('#formImg');//修改头像
    
	//上传图片预览与剪裁
	$('#image').uploadPreview({DivShow:'imgDiv'}); 
	//基本信息验证表单
	handleVForm($formuser,submitBaseInfoForm);
	//修改头像验证表单
	handleImageVForm($formimg,submitImageForm);
	//修改密码验证表单
	handlePasswordVForm($formpassword,submitPasswordForm);
	//基本信息保存
	$('#btnBaseInfoSave').click(function(){
		$formuser.submit();
	});
	//基本信息取消-刷新页面
	$('#btnBaseInfoCancel').click(function(){
		location.reload();
	});
	//修改密码
	$('#btnChanagePwdSave').click(function(){
		$formpassword.submit();
	});
	//密码重置
	$('#btnPasswordCancel').click(function(){
		$formpassword.reset();
	});
	//修改头像
	$('#btnImgUploadSave').click(function(){
		$formimg.submit();
	});
	

});
//头像修改
function submitImageForm(frm){
	$.ajaxFileUpload({
      url: 'changeimg.json', //用于文件上传的服务器端请求地址
      secureuri: false, //是否需要安全协议，一般设置为false
      fileElementId: 'image', //文件上传域的ID
      dataType: 'json', //返回值类型 一般设置为json
      data:frm.serializeObject(),//参数
      success: function (data){  //服务器成功响应处理函数
      	successChangeImgFrm.call(this,data);
      },
      error: function (xhr, textStatus, error){//服务器响应失败处理函数
      	errorRequest.call(this,xhr,textStatus,error);
      }
  });
 // lion.upload.post('changeimg.json','image',frm.serializeObject(),successChangeImgFrm,errorRequest);
  return false;
}
//修改头像成功回调函数
function successChangeImgFrm(data){
  if(data!==null&&!(data.hasError)){
  	lion.util.success('提示',data.message);
  	$('#formImg').reset();
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='修改头像失败';
  	}
  	 lion.util.error('提示',gmsg);
  }else{
  	 lion.util.error('提示','修改头像失败');
  }
}
//密码修改
function submitPasswordForm(frm){
	lion.util.post('changepwd.json',frm.serializeObject(),successChangePwdFrm,errorRequest);
	
}
//修改密码成功回调函数
function successChangePwdFrm(data){
  if(data!==null&&!(data.hasError)){
  	lion.util.success('提示',data.message);
  	$('#formpassword').reset();
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='修改密码失败';
  	}
  	 lion.util.error('提示',gmsg);
  }else{
  	 lion.util.error('提示','修改密码失败');
  }
}
//基本信息修改
function submitBaseInfoForm(frm){
	lion.util.post('changeinfo.json',frm.serializeObject(),successChangeInfoFrm,errorRequest);
}

function successChangeInfoFrm(data){
  if(data!==null&&!(data.hasError)){  
	  //location.reload();
	  lion.util.success('提示',data.message);
	  setInterval(function(){
	  	location.reload();
	  },3000);
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='修改密码失败';
  	}
  	 lion.util.error('提示',gmsg);
  }else{
  	 lion.util.error('提示','修改密码失败');
  }
}
//请求失败后信息
function errorRequest(data,arg){
	lion.util.error('提示','网络连接异常');
}
//修改密码验证表单
handlePasswordVForm=function(vForm,submitCallBackfn){
	var addError = $('.alert-danger', vForm), addSuccess = $('.alert-success',vForm);
	vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
         messages: {
        	oldpassword:{required:'请输入旧密码',rangelength:jQuery.validator.format('旧密码长度为{0}和{1}字符之间'),},
        	password:{required:'请输入新密码',rangelength:jQuery.validator.format('新密码长度为{0}和{1}字符之间')},
        	confirmpassword:{required:'请输入确认密码',rangelength:jQuery.validator.format('确认密码长度为{0}和{1}字符之间'),equalTo:'两次输入的密码不一致,请重新输入'}
        },
        rules: {
        	oldpassword:{required:true,rangelength:[6,30]},
        	password:{required:true,rangelength:[6,30]},
        	confirmpassword:{required:true,rangelength:[6,30],equalTo:'#password'},
        },
       
        invalidHandler: function (event, validator) {             
            addSuccess.hide();
            addError.show();
            Metronic.scrollTo(addError, -200);
        },

        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error'); 
        },

        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error'); 
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error'); 
        },
        errorPlacement:function(error,element){
        	//当遇到combo的对话框架的时，修改它的显示位置
        	if (element.hasClass('lion-combotree')){
        	    error.insertAfter(element.parent().find('div.btn-group'));
        	}else{
        		error.insertAfter(element);
        	}
        },
        submitHandler: function (form) {
        	addSuccess.show();
            addError.hide();
            submitCallBackfn(vForm);
        }
    });
};
//基本信息验证表单
handleVForm=function(vForm,submitCallBackfn){
	vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
      	messages: {
        	realnameZh:{maxlength:'真实姓名(中文)的最大长度为{0}字符'},
        	realnameEn:{maxlength:'真实姓名(中文)的最大长度为{0}字符'},
        },
        rules: {
        	realnameZh:{maxlength:128,},
            realnameEn:{maxlength:128,}
        },
        invalidHandler: function (event, validator) {             
            addSuccess.hide();
            addError.show();
            Metronic.scrollTo(addError, -200);
        },

        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error'); 
        },

        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error'); 
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error'); 
        },
        errorPlacement:function(error,element){
        	//当遇到combo的对话框架的时，修改它的显示位置
        	if (element.hasClass('lion-combotree')){
        		  error.insertAfter(element.parent().find('div.btn-group'));
        	}else{
        		error.insertAfter(element);
        	}
        },
        submitHandler: function (form) {
            submitCallBackfn(vForm);
        }
    });
};
//修改头像验证表单
handleImageVForm=function(vForm,submitCallBackfn){
	var addError = $('.alert-danger', vForm), addSuccess = $('.alert-success',vForm);
  vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
      	messages: {
      		image:{required:'请选择需要上传的头像'}
        },
        rules: {
        	image:{required:true}
        },
        invalidHandler: function (event, validator) {             
            addSuccess.hide();
            addError.show();
            Metronic.scrollTo(addError, -200);
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error'); 
        },

        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error'); 
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error'); 
        },
        errorPlacement:function(error,element){
        	//当遇到combo的对话框架的时，修改它的显示位置
        	if (element.hasClass('lion-combotree')){
        		  error.insertAfter(element.parent().find('div.btn-group'));
        	}else{
        		error.insertAfter(element);
        	}
        },
        submitHandler: function (form) {
        	//console.log('eeeeeeeeeeeeee');
            submitCallBackfn(vForm);
        }
    });
};
