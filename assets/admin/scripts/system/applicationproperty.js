var appdg=$('#sys_app_property_list_tb'); //datagrids
var addForm=$('#sysAppPropertyForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
	//默认加载函数
	lion.web.AppInit();

	appdg=$("#sys_app_property_list_tb");
	addForm=$('#sysAppPropertyForm');
	addDialog=$('#basic');
	var queryForm=$('#queryform');

	//验证表单
    handleVForm(addForm,submitForm);
  
	//查询
	$('#btnQuery').click(function(){
		appdg.datagrids({querydata:queryForm.serializeObject()});
		var queryparam=appdg.datagrids('queryparams'); 
		appdg.datagrids('reload');
	});
	//刷新
	$('#btnRefresh').click(function(){		 
        appdg.datagrids('reload');
    });
	//添加
    $('#btnAdd').click(function(){
      addForm.reset();
 	    addDialog.find('.modal-header h4 span').text('添加项目属性配置');
	    return;
    });

    //编辑
    $('#btnEdit').click(function(){
      var row=appdg.datagrids('getSelected');
      if(!row){
        lion.util.info('提示','请选择要编辑记录');
        return;
      }
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('编辑项目属性配置');
      addDialog.modal('toggle');
      addForm.fill(row);
    });

    //删除
	  $('#btnDelete').on('click',function(){
		  var row=appdg.datagrids('getSelected');
      lion.web.deletefn({
        url:'delete.json',
        data:row,
        unselectedmsg:'请选择要删除记录',
        confirmmsg:'确认要删除此记录？',
        success:successForDelete,
      }); 
	 });
  //导出Excel
  $('#btnExport').on('click',function(){
	  var params=queryForm.serialize(),
        dgtableId=appdg.attr('id');
    lion.web.exportfn({url:'export.json',data:params,tableId:dgtableId});
    return;
  });

  //保存
  $('#btnSave').click(function(){
 	  addForm.submit();
  });

	//删除成功
	function successForDelete(data,arg){
	   if(data!==null&&!(data.hasError)){
	      lion.util.success('提示',data.message);
	      appdg.datagrids('reload');
	   }else if(data!==null&&data.hasError){
	      var gmsg='';
	      for(var msg in data.errorMessage){
	        gmsg+=data.errorMessage[msg];
	      }
	      if(lion.util.isEmpty(gmsg)){
	        gmsg='未删除成功';
	      }
	      lion.util.error('提示',gmsg);
		}
	}

});


/**新增或编辑的提交代码*/
function submitForm(frm){
	var param=frm.serialize(),id=($('#id').val());
  //ID为空时，为添加动作
  if(lion.util.isEmpty(id)){
      lion.web.post({url:'add.json',data:param,success:successAddFrm});
  }else{
      lion.web.post({url:'edit.json',data:param,success:successEditFrm});
  }
}

//添加成功的函数
function successAddFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
      addDialog.modal('toggle');
      appdg.datagrids('reload');
    },
    msg:'添加项目属性配置未成功'
  });
}

//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        appdg.datagrids('reload');
    },
    msg:'编辑项目属性配置未成功'
  });
}

//验证表单
handleVForm=function(vForm,submitCallBackfn){
  var addError = $('.alert-danger', vForm);
    var addSuccess = $('.alert-success',vForm);
  vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
        messages: {
          appId:{
            required:'请输入appId',
            maxlength:jQuery.validator.format('appId的最大长度为:{0}')
          },
          key:{
            required:'请输入键',
            rangelength:jQuery.validator.format('键的长度为{0}和{1}字符之间')
          },
          value:{
            required:'请输入值',
            rangelength:jQuery.validator.format('值的长度为{0}和{1}字符之间')
          },
          description:{
            required:'请输入描述',
            maxlength:jQuery.validator.format('描述的最大长度为:{0}')
          }
        },
        rules: {
            appId: {
                required:true,
                maxlength:20
            },
            key: {
              required:true,
              rangelength:[4,120]
            },
            value:{
              required: true,
                rangelength:[4,120]
            },
            description:{
              required:false,
              maxlength:255
            }
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
          if (element.hasClass('lion-combo')){           
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

//测试选择中checkbox
function formatterCheckBox(data,type,full){
  return data;
}
//判断是否编辑
function formatterEidtable(data,type,full) {
	var name =$.lion.lang.editable.n;
	if (data) {
		name = $.lion.lang.editable.y;
	}
	return name;
}