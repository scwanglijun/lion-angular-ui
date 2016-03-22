var positiondg=$('#sys_position_tb'); //datagrids
var addForm=$('#sysPositionForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
	//默认加载函数
	lion.web.AppInit();

	positiondg=$("#sys_position_tb");
	addForm=$('#sysPositionForm');
	addDialog=$('#basic');
	var modalRoleAuth=$('#modalRoleAuth');
	var queryForm=$('#queryform');

	//验证表单
	handleVForm(addForm,submitForm);

	//查询
	$('#btnQuery').click(function(){
		positiondg.datagrids({querydata:queryForm.serializeObject()});
		var queryparam=positiondg.datagrids('queryparams'); 
		positiondg.datagrids('reload');
	});
	//刷新
	$('#btnRefresh').click(function(){		 
		positiondg.datagrids('reload');
    });
	//添加
    $('#btnAdd').click(function(){
      	addForm.reset();
	 	addDialog.find('.modal-header h4 span').text('添加职位');
		return;
    });

    //编辑
    $('#btnEdit').click(function(){
      var row=positiondg.datagrids('getSelected');
      if(!row){
        lion.util.info('提示','请选择要编辑记录');
        return;
      }
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('编辑角色');
      addDialog.modal('toggle');
      addForm.fill(row);
    });

  //删除
	$('#btnDelete').on('click',function(){
		var row=positiondg.datagrids('getSelected');
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
        dgtableId=positiondg.attr('id');
		console.dir("dgtableId:"+dgtableId);
    lion.web.exportfn({url:'export.json',data:params,tableId:dgtableId});
    return;
	});
	//保存
	$('#btnSave').click(function(){
//		document.sysPositionForm.attributes["action"].value  = "add.json";
	 	addForm.submit();
	});

	 //删除成功
	function successForDelete(data,arg){
	   if(data!==null&&!(data.hasError)){
	      lion.util.success('提示',data.message);
	      positiondg.datagrids('reload');
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
	console.dir(frm.serialize());
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
            positiondg.datagrids('reload');
        },
        msg:'添加角色未成功'
      });
}

//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        positiondg.datagrids('reload');
    },
    msg:'添加角色未成功'
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
          nameZh:{
            required:'请输入角色名称(中文)',
            rangelength:jQuery.validator.format('角色名称(中文)长度为{0}和{1}字符之间')
          },
            nameEn:{
            required:'请输入角色名称(英文)',
            rangelength:jQuery.validator.format('角色名称(英文)长度为{0}和{1}字符之间'),
            remote:'该角色名称已存在，请输入其它角色名称'
          },
          description:{
            required:'请输入角色的描述',
            maxlength:jQuery.validator.format('参数描述的最大长度为:{0}')
          }
        },
        rules: {
            nameZh: {
                required:true,
                rangelength:[4,128]
            },
            nameEn:{
              required: true,
                rangelength:[4,128],
                remote:{
                    url:'checkisexitnameen.htm', //后台处理程序
                    type: 'post',               //数据发送方式
                    dataType: 'json',           //接受数据格式   
                    data: {                     //要传递的数据
                       nameEn: function() {
                        return $('#nameEn').val();
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
            },
            description:{
              required:false,
              maxlength:512
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
//function formatterCodeList(val,row) {
//	var codeText='',data=$('#departmentList').combo('getData');
//	for (var i in data) {
//		if (data[i].codeValue == val) {
//			codeText = data[i].nameZh;
//			break;
//		}
//	}
//	return codeText;
//}


//测试选择中checkbox
function formatterCheckBox(data,type,full){
  return data;
}
//判断是否编辑
function formatterEidtable(data,type,full) {
	var name =lion.lang.editable.n;
	if (data) {
		name = lion.lang.editable.y;
	}
	return name;
}
