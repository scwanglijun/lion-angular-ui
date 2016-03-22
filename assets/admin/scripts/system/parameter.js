var parameterdg=$('#sys_parameter_lists_tb'),addDialog=$('#basic');
$(function() {
	//默认加载函数
	lion.web.AppInit();
	
	parameterdg=$('#sys_parameter_lists_tb');

	var addForm=$('#sysParameterForm');
	var queryForm=$('#queryform');
	addDialog=$('#basic');	
	
	handleVForm(addForm,submitForm);
	//选择DataGrid单行
	function getSelectedRow(){return parameterdg.datagrids('getSelected');}
	 
	 
	/**
	 * [查询]
	 */
	 $('#btnQuery').click(function(){
	 
	      parameterdg.datagrids({querydata:queryForm.serializeObject()});
	      //重新加载数据
	      parameterdg.datagrids('reload');
	 });
		
	 
	 //刷新
	 $('#btnRefresh').on('click',function(){
		    parameterdg.datagrids('reload');
	 });
	 //新增
	 $('#btnAdd').on('click',function(){
		  addForm.reset();
		  addDialog.find('.modal-header h4 span').text('添加系统参数');
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
	   addForm.reset();
	   addDialog.find('.modal-header h4 span').text('编辑系统参数');
		 addDialog.modal('toggle');
		 addForm.fill(row);
     $('#addParameterCodeList').combo('val',[row.type]);  
	 });
	 //删除
	 $('#btnDelete').on('click',function(){
		 var row=parameterdg.datagrids('getSelected');
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
		   dgtableId=parameterdg.attr('id');
		   lion.web.exportfn({url:'export.json',data:params,tableId:dgtableId});
           return;
   }); 
});

function successForDelete(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      parameterdg.datagrids('reload');
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
          parameterdg.datagrids('reload');
        },
        msg:'添加系统参数未成功'
      });
}

//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        parameterdg.datagrids('reload');
    },
    msg:'编辑系统参数未成功'
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
        	type:{
        		required:'请选择参数类型'
        	},
        	nameZh:{
        		required:'请输入参数名称(中文)',
        		rangelength:jQuery.validator.format('参数名称(中文)长度为{0}和{1}字符之间')
        	},
            nameEn:{
        		required:'请输入参数名称(英文)',
        		rangelength:jQuery.validator.format('参数名称(英文)长度为{0}和{1}字符之间'),
        		remote:'该参数名称已存在，请输入其它参数名称'
        	},
        	value:{
        		required:'请输入参数值',
        	 	rangelength:jQuery.validator.format('参数值必须介于{0}和{1}字符之间')
        	},
        	description:{
        		required:'请输入参数的描述',
        		maxlength:jQuery.validator.format('参数的的最大长度为:{0}'),
        	}
        },
        rules: {
            type:{
                required:true
            },
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
            value:{
            	required: true,
                rangelength:[4,128]
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
function formatterCodeList(val,row) {
	var codeText='',data=$('#parameterCodeList').combo('getData');
	for (var i in data) {
		if (data[i].codeValue ==val) {
			codeText = data[i].nameZh;
			break;
		}
	}
	return codeText;
}
//判断是否编辑
function formatterEidtable(val,row) {
	var name =lion.lang.editable.n;
	if (val) {
		name = lion.lang.editable.y;
	}
	return name;
}
