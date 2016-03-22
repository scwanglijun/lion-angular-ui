$(function() {
	//默认加载函数
	lion.web.AppInit();
 	var treegridId='#sys_department_lists';
	var addForm=$('#addform');
	var queryForm=$('#queryform');
	var addDialog=$('#basic');
	//验证表单
	handleVForm(addForm,submitForm);
 	 //选择DataGrid单行
	 function getSelectedRow(){
		row=$(treegridId).treegrid('getSelected');
		return row;
	 }
	 //重新加载DataGrid
	 function dataGridReload(dataGridId){
		$(dataGridId).treegrid('reload');
	 }
	 //刷新
	 $('#btnRefresh').on('click',function(){
		 dataGridReload(treegridId);
	 });
	 //添加
	 $('#btnAdd').on('click',function(){
		 addForm.reset();
	 	 addDialog.find('.modal-header h4 span').text('添加部门');
	 	 var row=getSelectedRow();
		 if(row){
			 $("#parentDepartmentId").combotree('val',row.id);
		 }
		 return;
	 });
	 //保存方法
	 $('#btnSave').click(function(){

	 	addForm.submit();
	 });
	  //编辑
	 $('#btnEdit').on('click',function(){
		 var row=getSelectedRow();
		 if(!row){
			 lion.util.info('提示','请选择要编辑记录');
			 return;
		 }
 		 addForm.reset();
    	 addDialog.find('.modal-header h4 span').text('编辑部门');
		 addDialog.modal('toggle');
		 addForm.fill(row);
		 $("#parentDepartmentId").combotree('val',row._parentId);
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
              }
          }); 
	 });
	 //导出Excel
	 $('#btnExport').on('click',function(){
		     var params=queryForm.serialize(),url='export.json?tableId='+$(treegridId).attr('id');
	       var options=$(treegridId).treegrid('options');       
	       if(options.hasOwnProperty('sortName')&&lion.util.isNotEmpty(options.sortName)){
	           url+='&sort='+options.sortName;
	       }
	       if(options.hasOwnProperty('sortOrder')&&lion.util.isNotEmpty(options.sortOrder)){
	          url+='&order='+options.sortOrder;
	       }
	       if(lion.util.isNotEmpty(params)){
	          url+='&'+params;
	       }
	       window.open(url,'_blank');
	 });		
});
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
    $('#sys_department_lists').treegrid('reload');
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='添加用户失败';
  	}
  	lion.util.error('提示',gmsg);
  }else{
  	lion.util.error('提示','添加用户失败');
  }
}
//请求失败后信息
function errorRequest(data,arg){
	lion.util.error('提示','网络连接异常');
}
function successForDelete(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      $('#sys_department_lists').treegrid('reload');
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

//验证表单
handleVForm=function(vForm,submitCallBackfn){
	var addError = $('.alert-danger', vForm), addSuccess = $('.alert-success',vForm),context=lion.util.context;
	vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
        messages: {
        	nameZh:{required:'请输入部门名称(中文)',rangelength:'部门名称(中文)的最大长度为{0}和{1}字符之间'},
        	nameEn:{required:'请输入部门名称(英文)',rangelength:'部门名称(中文)的最大长度为{0}和{1}字符之间'},
        	departmentNo:{required:'请输入部门编号',rangelength:'部门编号(中文)的最大长度为{0}和{1}字符之间'},
        },
        rules:{
            nameZh:{required:true,rangelength:[4,128]},
            nameEn:{required:true,rangelength:[4,128]},
            departmentNo:{required:true,rangelength:[4,30]}
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



//判断是否编辑
//判断是否编辑
function formatterEidtable(data,type,full) { 
	console.dir(data);
	if (data) {
	    return lion.lang.editable.y;
	}
	  	return lion.lang.editable.n;
}