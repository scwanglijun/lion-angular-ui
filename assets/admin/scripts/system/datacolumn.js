var datagridId='#datacolumn_tb';
var addForm=$('#sysDataGridForm');
var addDialog=$('#basic');
var queryForm=$('#queryform');
$(function() {
	//默认加载函数
	lion.web.AppInit();;
	//加载combo
	var title	= ['请选择类型' , '请选择datagrid'];
	$.each(title , function(k , v) {
		title[k]	= '<option value="">'+v+'</option>';
	});
	
	datagridId='#datacolumn_tb';
	addForm=$('#sysDataColumnForm');
	addDialog=$('#basic');
	queryForm=$('#queryform');
	
	handleVForm(addForm,submitForm);
	//选择DataGrid单行
	function getSelectedRow(){return $(datagridId).datagrids('getSelected');}
	
	//重新加载DataGrid
	  function dataGridReload(dataGridId){
	     $(datagridId).datagrids('reload');
	  }
	
	/**
	 * [查询]
	 */
	 $('#btnQuery').click(function(){
		 $(datagridId).datagrids({querydata:queryForm.serializeObject()});
	      var queryparam=$(datagridId).datagrids('queryparams'); 
	      //重新加载数据
	      $(datagridId).datagrids('reload');
	 });
	 
	
	 //刷新
	 $('#btnRefresh').on('click',function(){
		 $(datagridId).datagrids('reload');
	 });
	 //新增
	 $('#btnAdd').on('click',function(){
		 addForm.reset();
		  addDialog.find('.modal-header h4 span').text('添加DataColumn');
		  $('.lion-combo').combo('reload');
	 });

	 addForm.on('show.bs.modal',function(){
	 	 addForm[0].reset(); 
	 }); 

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
		 addForm[0].reset();
		 addForm.find('.form-group').removeClass('has-error');
		 addForm.find('.help-block').remove();
		 addDialog.find('.modal-header h4').text('编辑DataColumn');
		 $('#basic').modal('toggle');  
		 $('#dataGridListType').combo('val',row.dataGrid.type);
		 $('#dataGridList').combo('val',row.dataGridId);
		 addForm.fill(row);
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
      $(datagridId).datagrids('reload');
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
      lion.util.post('edit.json',param,successEditFrm,errorRequest,param.id);
  }
}
//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        $(datagridId).datagrids('reload');
    },
    msg:'编辑DataColumn未成功'
  });
}

//添加后&编辑后提交
function successAddFrm(data,arg,id){
  if(data!==null&&!(data.hasError)){
  	lion.util.success('提示',data.message);
  	$('#basic').modal('toggle');
	  $(datagridId).datagrids('reload');
  }else if(data!==null&&data.hasError){
  	var gmsg='';
  	for(var msg in data.errorMessage){
  		gmsg+=data.errorMessage[msg];
  	}
  	if(lion.util.isEmpty(gmsg)){
  		gmsg='添加DataColumn出错';
  	}
  	lion.util.error('提示',gmsg);
  }else{
  	lion.util.error('提示','添加角色失败');
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
        	dataGridId: {
                required:'请选择datagrid'
            },
            showOrder:{
              required: '请输入showOrder',
              number: '请输入正确的数字'
            },
            field:{
              required: '请输入field',
              rangelength:jQuery.validator.format('field长度为{0}和{1}字符之间')
            },
            name:{
              required: '请输入name',
              rangelength:jQuery.validator.format('name长度为{0}和{1}字符之间'),
              remote:'该name已存在，请输入其它name'
            },
            width:{
              required: '请输入width',
              number:'请输入正确的数字'
            },
            align:{
              required: '请输入align',
              rangelength:jQuery.validator.format('align长度为{0}和{1}字符之间')
            }
        },
        rules: {
        	dataGridId: {
                required:true
            },
            showOrder:{
            	required: true,
            	number: true
            },
            field:{
            	required: true,
            	rangelength:[1,100]
            },
            name:{
            	required: true,
            	rangelength:[1,100],
            	remote:{
          			url:'checkisexitnameen.htm', //后台处理程序
  					    type: 'post',               //数据发送方式
  					    dataType: 'json',           //接受数据格式   
  					    data: {                     //要传递的数据
					          nameEn: function() {
					            return $('#name').val();
					          },
					          id:function(){
                      var id=($('#id').val());
                      if(lion.util.isNotEmpty(id)){
                        return id;
                      }
                      return '';
                    },
                    dataGridId:function(){
                      var dataGridId=$('#dataGridList').combo('val');
                      if(lion.util.isNotEmpty(dataGridId)){
                        return dataGridId;
                      }
	                    return '';
	                  }
				          }
          			}
            },
            width:{
            	required: true,
            	number:true
            },
            align:{
            	required: true,
            	rangelength:[1,10]
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
function formatterDataGridTitle(val,type,row) {
	return row.dataGrid.title;
}

function formatterSortable(val,type,row){
  var name =lion.lang.editable.n;
  if (val) {
    name = lion.lang.editable.y;
  }
  return name; 
}
//判断是否编辑
function formatterEidtable(val,row) {
	var name =lion.lang.editable.n;
	if (val) {
		name = lion.lang.editable.y;
	}
	return name;
}
