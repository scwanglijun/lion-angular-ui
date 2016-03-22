var codelistdg=$('#sys_codelist_tb'); //datagrids
var addForm=$('#sysCodeListForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
	//默认加载函数
	lion.web.AppInit();

  codelistdg=$("#sys_codelist_tb");
  addForm=$('#sysCodeListForm');
  addDialog=$('#basic');
  var queryForm=$('#queryform');

  //验证表单
  handleVForm(addForm,submitForm);
  
  //查询
  $('#btnQuery').click(function(){
    codelistdg.datagrids({querydata:queryForm.serializeObject()});
    var queryparam=codelistdg.datagrids('queryparams'); 
    codelistdg.datagrids('reload');
  });
  //刷新
  $('#btnRefresh').click(function(){     
        codelistdg.datagrids('reload');
    });
  //添加
    $('#btnAdd').click(function(){
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('添加编码列表');
      return;
    });

    //编辑
    $('#btnEdit').click(function(){
        var row=codelistdg.datagrids('getSelected');
        if(!row){
	       lion.util.info('提示','请选择要编辑记录');
	       return;
	    }
	    addForm.reset();
	    addDialog.find('.modal-header h4 span').text('编辑编码列表');
	    addDialog.modal('toggle');
	    addForm.fill(row);
	    $('#addCodeTypeList').combo('val',[row.codeTypeId]);  
    });

     //删除
   $('#btnDelete').on('click',function(){
      var row=codelistdg.datagrids('getSelected');
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
        dgtableId=codelistdg.attr('id');
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
        codelistdg.datagrids('reload');
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
      codelistdg.datagrids('reload');
    },
    msg:'添加编码列表未成功'
  });
}



//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        codelistdg.datagrids('reload');
    },
    msg:'编辑编码列表未成功'
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
        	codeTypeId:{
        		required:'请选择通用编码类型',
        	},
        	nameZh:{
        		required:'请输入编码列表名称(中文)',
        		rangelength:jQuery.validator.format('编码列表名称(中文)长度为{0}和{1}字符之间')
        	},
            nameEn:{
        		required:'请输入编码列表名称(英文)',
        		rangelength:jQuery.validator.format('编码列表名称(英文)长度为{0}和{1}字符之间'),
        		remote:'该编码列表名称已存在，请输入其它参数名称'
        	},
        	codeValue:{
        		required:'请输入编码值',
        		rangelength:jQuery.validator.format('编码值长度为{0}和{1}字符之间'),
        	},
        	sortNo:{
        		required:'请输入编码参数值长度',
        		number:jQuery.validator.format('编码参数值长度必须为数字')
        	}
        },
        rules: {
        	codeTypeId:{
                required:true,
            },
            nameZh: {
                required:true,
                rangelength:[1,128]
            },
            nameEn:{
            	required: true,
              	rangelength:[1,128],
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
            codeValue: {
                required:true,
                rangelength:[1,128]
            },
            sortNo:{
            	required: true,
            	number:true 
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

//获取下拉列表数据
/**sys_code_type 加载列表*/
function formatterCodeList(dval, row) {
  var codeText='',data=$('#CodeList').combo('getData');
  for (var i in data) {
    if (data[i].id ==val) {
      codeText = data[i].nameZh;
      break;
    }
  }
  return codeText;
}
//判断是否编辑
function formatterEidtable(data,type,full) {
  var name =lion.lang.editable.n;
  if (data) {
    name = lion.lang.editable.y;
  }
  return name;
}

//将JSON复杂对象显示到DataGird中
function formatterName(val, row) {
	var name = "";
	if (val !== null) {
		name = val.nameZh;
	}
	return name;
}