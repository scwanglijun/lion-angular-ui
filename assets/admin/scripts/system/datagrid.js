var datagridId='#datagrid_dt';
var addForm=$('#sysDataGridForm');
var addDialog=$('#basic');
var queryForm=$('#queryform');
$(function() {
	//默认加载函数
	lion.web.AppInit();
	
	datagridId='#datagrid_dt';
	addForm=$('#sysDataGridForm');
	addDialog=$('#basic');
	queryForm=$('#queryform');
	
	handleVForm(addForm,submitForm);
	//选择DataGrid单行
	function getSelectedRow(){return $(datagridId).datagrids('getSelected');}
	 
	/**
	 * [查询]
	 */
	 $('#btnQuery').click(function(){
		 $(datagridId).datagrids({querydata:queryForm.serializeObject()});
	      var queryparam=$(datagridId).datagrids('queryparams'); 
	      //重新加载数据
	      $(datagridId).datagrids('reload');
	 });
	 
	//重新加载DataGrid
	  function dataGridReload(dataGridId){
	     $(datagridId).datagrid('reload');
	  }
	 //刷新
	 $('#btnRefresh').on('click',function(){
		 $(datagridId).datagrids('reload');
	 });
	 //新增
	 $('#btnAdd').on('click',function(){
		  addForm.reset();
		  addDialog.find('.modal-header h4 span').text('添加DataGrid');
		  $('.lion-combo').combo('reloadLi');
	 });

	 addForm.on('show.bs.modal',function(){
	 	 addForm[0].reset(); 
	 }); 

	 $('#btnSave').click(function(){
	 		addForm.submit();
	 });

	 //编辑
	 $('#btnEdit').on('click',function(){
		 var row=$(datagridId).datagrids('getSelected');
		 if(!row){
			 lion.util.info('提示','请选择要编辑记录');
			 return;
		 }
		 addForm[0].reset();
		 addForm.find('.form-group').removeClass('has-error');
		 addForm.find('.help-block').remove();
		 addDialog.find('.modal-header h4').text('编辑DataGrid');
		 $('#basic').modal('toggle');
		 $('#codeList').combo('val',[row.type]);
		 addForm.fill(row);
	 });
	 //删除
	 $('#btnDelete').on('click',function(){
		 var row=$(datagridId).datagrids('getSelected');
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
		var params=queryForm.serialize(),url='export.json?tableId1='+$(datagridId).attr('id');
       if(lion.util.isNotEmpty(params)){
          url+='&'+params;
       }
       window.open(url,"_blank");
	 });
});

function successForDelete(data,arg){
   if(data!==null&&!(data.hasError)){
	  $(datagridId).datagrids('reload');
      lion.util.success('提示',data.message);
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
  if(data!==null&&!(data.hasError)){
	$(datagridId).datagrids('reload');
  	lion.util.success('提示',data.message);
  	$('#basic').modal('toggle');
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='添加DataGrid出错';
  	}
  	lion.util.error('提示',gmsg);
  }else{
  	lion.util.error('提示','添加DataGrid失败');
  }

}
//请求失败后信息
function errorRequest(data,arg){
	lion.util.error('提示','网络连接异常');
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
        	  type: {
                required: '请选择type'
            },
            tableId:{
              required: '请输入tableId',
              rangelength:jQuery.validator.format('tableId长度为{0}和{1}字符之间'),
              remote: '该tableId已存在，请输入其他tableId'
            },
            title:{
              required: '请输入title',
              rangelength: jQuery.validator.format('title长度为{0}和{1}字符之间')
            }
        },
        rules: {
        	type: {
                required:true
            },
            tableId:{
            	required: true,
              rangelength:[1,60],
            	remote:{
                url:'checkisexitnameen.htm', //后台处理程序
                type: 'post',               //数据发送方式
                dataType: 'json',           //接受数据格式   
                data: {                     //要传递的数据
                     nameEn: function() {
                      return $('#name').val();
                     },
                     	tableId:function(){
                           var id=($('#tableId').val());
                           if(lion.util.isNotEmpty(id)){
                             return id;
                           }
                           return '';
                         }
                  }
                }
            },
            title:{
            	required: true,
            	rangelength: [4,128]
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
//判断是否编辑
function formatterEidtable(val,row) {
	var name =$.lion.lang.editable.n;
	if (val) {
		name = $.lion.lang.editable.y;
	}
	return name;
}