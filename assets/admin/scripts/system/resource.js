$(function() {
	//默认加载函数
	lion.web.AppInit();
	
	var datagridId='#sys_resource_lists_tb';
	var addForm=$('#addform');
	var addDialog=$('#basic');
	var queryForm=$('#queryform');
	
	handleVForm(addForm,submitForm);
	//选择DataGrid单行
	function getSelectedRow(){return $(datagridId).treegrid('getSelected');}
	 
	$(datagridId).treegrid({onLoadSuccess : function(data) {}	});		 
	 //重新加载DataGrid
	 function dataGridReload(dataGridId){$(datagridId).treegrid('reload');}
	 //刷新
	 $('#btnRefresh').on('click',function(){
		   dataGridReload(datagridId);
	 });
	 //新增
	 $('#btnAdd').on('click',function(){
		  addForm.reset();
      addDialog.find('.modal-header h4 span').text('添加资源');
      var row=getSelectedRow();
      if(row){
        $("#parentResourceId").combotree('val',row.id);
      }
      return;
	 });


	 $('#btnSave').click(function(){
		 	$('#btnSave').unbind('click');
	 		addForm.submit();
	 		
	 });
	 //编辑
	 $('#btnEdit').on('click',function(){
		 var row=getSelectedRow();
		 if(!row){
			 lion.util.info('提示','请选择要编辑记录');
			 return;
		 }
		 addDialog.find('.modal-header h4 span').text('编辑资源');
         addDialog.modal('toggle');
		 addForm.fill(row);
   
     $('#sysresourcetype').combo('val',[row.type]);
     $('#sysresourcetarget').combo('val',[row.target]); 
     $('#sys_resource_icon').combo('val',[row.icon]);
     $("#parentResourceId").combotree('val',row._parentId);
      
	 });
   //监听change事件
   $('#sys_resource_icon').on('combo.change',function(){
        var icon=$(this).combo('val');
        $('#span_resource_icon').html('<i class="'+icon+'"></>');
   });
	 //删除
	 $('#btnDelete').on('click',function(){
		 var row=getSelectedRow();
		 if(!row){
			 lion.util.info('提示','请选择要删除记录');
			 return;
		 }
		 bootbox.confirm('确认要删除此记录？', function(result) {
              if(result){            	 
            	  var param={'id':row.id};
                lion.util.post('delete.json',param,successForDelete,errorRequest);
            	  //lion.util.success('提示!', '已删除成功');
              }
          }); 
	 });
	//导出Excel
	 $('#btnExport').on('click',function(){
		   var params=queryForm.serialize(),url='export.json?tableId='+$(datagridId).attr('id');
       if(lion.util.isNotEmpty(params)){
          url+='&'+params;
       }
       window.open(url,"_blank");
	 });
});

function successForDelete(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      $('#sys_resource_lists_tb').treegrid('reload');
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
/**新增或编辑的提交代码*/
function submitForm(frm){
	var param=frm.serialize(),id=($('#id').val());
  //ID为空时，为添加动作
  if(lion.util.isEmpty(id)){
 	    lion.util.post('add.json',param,successAddFrm,errorRequest);
  }else{
      lion.util.post('edit.json',param,successAddFrm,errorRequest,param.id);
  }
}

//添加后&编辑后提交
function successAddFrm(data,arg,id){
  //TODO
  if(data!==null&&!(data.hasError)){
  	lion.util.success('提示',data.message);
  	$('#basic').modal('toggle');
  	$('#sys_resource_lists_tb').treegrid('reload');
  	$('#btnSave').click(function(){
	 	$('#btnSave').unbind('click');
	 	$('#addform').submit();
	});
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='添加资源出错';
  	}
  	lion.util.error('提示',gmsg);
  	$('#btnSave').click(function(){
	 	$('#btnSave').unbind('click');
	 	$('#addform').submit();
	});
  }else{
  	lion.util.error('提示','添加资源失败');
  	$('#btnSave').click(function(){
	 	$('#btnSave').unbind('click');
	 	$('#addform').submit();
	});
  }
}
//请求失败后信息
function errorRequest(data,arg){
	 lion.util.error('提示','网络连接异常');
	 $('#btnSave').click(function(){
	 	$('#btnSave').unbind('click');
	 	$('#addform').submit();
	});
}
//判断是否编辑
function formatterEidtable(val,row) {
  var name =$.lion.lang.editable.n;
  if (val) {
    name = $.lion.lang.editable.y;
  }
  return name;
}
/**sys_code_type 加载列表*/
function formatterCodeResource(val, row) {
  var data =$("#sysresourcetype").combo('getData');
  var nameZh = "";
  for ( var obj in data) {
    if (data[obj].codeValue == val) {
      nameZh = data[obj].nameZh;
      break;
    }
  }
  return nameZh;
}

//验证表单
handleVForm=function(vForm,submitCallBackfn){
    var addError = $('.alert-danger', vForm), addSuccess = $('.alert-success',vForm);
	   vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
        messages: {
          type:{required:'请选择资源类型'},
          nameZh:{required:'请输入资源名称(中文)',rangelength:'资源名称(中文)的最大长度为{0}和{1}字符之间'},
          nameEn:{required:'请输入资源名称(英文)',rangelength:'资源名称(中文)的最大长度为{0}和{1}字符之间'},
        	seqNum:{required:'请输入资源显示顺序',digits:'资源显示顺序为数字'},
          description:{
        		required:'请输入资源描述',
        		maxlength:jQuery.validator.format('描述的最大长度为:{0}')
        	}
        },
        rules: {
            type:{required:true},
            nameZh:{required:true,rangelength:[2,128]},
            nameEn:{required:true,rangelength:[2,128]},
            seqNum:{required:true,digits:true},
            description:{required:false,maxlength:255}
        },
        invalidHandler: function (event, validator) {             
            addSuccess.hide();
            addError.show();
            Metronic.scrollTo(addError, -200);
        },

        highlight: function (element) {
            $(element).closest('.form-filed').addClass('has-error'); 
        },

        unhighlight: function (element) {
            $(element).closest('.form-filed').removeClass('has-error'); 
        },
        success: function (label) {
            label.closest('.form-filed').removeClass('has-error'); 
        },
        errorPlacement:function(error,element){
        	//当遇到combo的对话框架的时，修改它的显示位置
        	if (element.hasClass('lion-combotree')){
              error.insertAfter(element.parent().find('div.btn-group'));
          }else if(element.hasClass('lion-combo')){        	 
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