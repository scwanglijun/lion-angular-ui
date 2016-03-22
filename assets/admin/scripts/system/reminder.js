var reminderdg=$('#sys_reminder_tb'); //datagrids
var addForm=$('#sysReminderForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
  //加载bootstrap
  Metronic.init(); // init metronic core componets
  Layout.init(); // init layout
  Tasks.initDashboardWidget(); // init tash dashboard widget
  lion.util.menu();//加载导航栏
  var queryForm=$('#queryform');

  //验证表单
  handleVForm(addForm,submitForm);
  
  //查询
  $('#btnQuery').click(function(){
	reminderdg.datagrids({querydata:queryForm.serializeObject()});
    var queryparam=reminderdg.datagrids('queryparams'); 
    console.dir(queryparam);
    reminderdg.datagrids('reload');
  });
  //刷新
  $('#btnRefresh').click(function(){     
	  reminderdg.datagrids('reload');
    });
  //添加
    $('#btnAdd').click(function(){
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('添加消息');
      $('.lion-combo').combo('reloadLi');
      return;
    });

    //编辑
    $('#btnEdit').click(function(){
        var row=reminderdg.datagrids('getSelected');
	    if(!row){
	       lion.util.info('提示','请选择要编辑记录');
	       return;
	    }
	    addForm.reset();
	    addDialog.find('.modal-header h4 span').text('编辑消息');
	    addDialog.modal('toggle');
	    addForm.fill(row);
	    $('#ReminderType').combo('val',[row.type]);
    });

     //删除
   $('#btnDelete').on('click',function(){
    var row=reminderdg.datagrids('getSelected');
    lion.web.deletefn({
      url:'delete.json',
      data:row,
      unselectedmsg:'请选择要删除记录',
      confirmmsg:'确认要删除此记录？',
      success:successForDelete,
    });
   });
   
   //保存
   $('#btnSave').click(function(){
    addForm.submit();
   });

   //删除成功
  function successForDelete(data,arg){
     if(data!==null&&!(data.hasError)){
        lion.util.success('提示',data.message);
        reminderdg.datagrids('reload');
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
  console.dir(param);
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
      reminderdg.datagrids('reload');
    },
    msg:'添加消息未成功'
  });
}

//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        reminderdg.datagrids('reload');
    },
    msg:'编辑消息未成功'
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
        	reminderType:{
        		required:'请选择消息类型',
        		rangelength:jQuery.validator.format('消息类型长度为{0}和{1}字符之间')
        	},
        	reminderTitle:{
	            required:'请输入消息标题',
	            rangelength:jQuery.validator.format('请输入消息标题为{0}和{1}字符之间'),
	            remote:'该请输入消息标题已存在，请输入其它标题'
        	},
        	reminderContent:{
	            required:'请输入消息内容',
	            rangelength:jQuery.validator.format('消息内容长度为{0}和{1}字符之间')
        	},
        	reminderUrl:{
	            required:'请输入消息内容路径',
	            rangelength:jQuery.validator.format('消息路径长度为{0}和{1}字符之间')
        	},
        	reminderImportantlevel:{
	            required:'消息重要级别',
	            rangelength:jQuery.validator.format('消息重要级别为{0}和{1}字符之间')
        	},
        	reminderTitleparams:{
	            required:'请输入消息标题的参数',
	            rangelength:jQuery.validator.format('消息标题的参数为{0}和{1}字符之间')
        	}
        },
        rules: {
        	reminderType: {
                required:true,
                rangelength:[1,128]
            },
            title:{
              required: true,
                rangelength:[1,128],
                remote:{
                    url:'checkisexitnameen.htm', //后台处理程序
                    type: 'post',               //数据发送方式
                    dataType: 'json',           //接受数据格式   
                    data: {                     //要传递的数据
                       nameEn: function() {
                        return $('#title').val();
                       },
                       id:function(){
                         var id=($('#id').val());
                         if(lion.util.isNotEmpty(id)){
                           return id;
                         }
                         return '';
                       }
                    }
             }
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
//获取下拉列表数据
/**sys_code_type 加载列表*/
function formatterCodeList(val,row) {
	var codeText='',data=$('#ReminderType').combo('getData');
	for (var i in data) {
		if (data[i].codeValue == val) {
			codeText = data[i].nameZh;
			break;
		}
	}
	return codeText;
}

//测试选择中checkbox
function formatterCheckBox(data,type,full){
	return data;
}

