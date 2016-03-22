var codetypedg=$('#sys_codetype_lists_tb'); //datagrids
var addForm=$('#sysCodeTypeForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
	//默认加载函数
	lion.web.AppInit();

  codetypedg=$("#sys_codetype_lists_tb");
  addForm=$('#sysCodeTypeForm');
  addDialog=$('#basic');
  var queryForm=$('#queryform');

  //验证表单
  handleVForm(addForm,submitForm);
  
  //查询
  $('#btnQuery').click(function(){
    codetypedg.datagrids({querydata:queryForm.serializeObject()});
    var queryparam=codetypedg.datagrids('queryparams'); 
    codetypedg.datagrids('reload');
  });
  //刷新
  $('#btnRefresh').click(function(){     
        codetypedg.datagrids('reload');
    });
  //添加
    $('#btnAdd').click(function(){
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('添加编码类型');
      return;
    });

    //编辑
    $('#btnEdit').click(function(){
      var row=codetypedg.datagrids('getSelected');
      if(!row){
        lion.util.info('提示','请选择要编辑记录');
        return;
      }
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('编辑编码类型');
      addDialog.modal('toggle');
      $('#dataGridListType').combo('val',[row.type]);
      $('#dataGridList').combo('val',[row.dataGridId]);
      addForm.fill(row);
    });

     //删除
   $('#btnDelete').on('click',function(){
      var row=codetypedg.datagrids('getSelected');
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
      var params=queryForm.serialize(), dgtableId=codetypedg.attr('id');
      lion.web.exportfn({url:'export.json',data:params,tableId:dgtableId});
      return;
   });
   //保存
   $('#btnSave').click(function(){
      addForm.submit();
   });
});

   //删除成功
function successForDelete(result,arg){
    lion.web.parsedata({
                    data:result,
                    success:function(){
                        codetypedg.datagrids('reload');
                    },
                    msg:'删除编码类型未成功'});
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
                          codetypedg.datagrids('reload');
                      },
                      msg:'添加编码类型未成功'});
}
//编辑成功的函数
function successEditFrm(result,args){
   lion.web.parsedata({
                      data:result,
                      success:function(){
                          addDialog.modal('toggle');
                          codetypedg.datagrids('reload');
                      },
                      msg:'编辑编码类型未成功'});
}
//请求失败后信息
function errorRequest(xhr,status,error){    
  lion.util.error('提示','网络连接异常1');
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
            required:'请输入通用编码类型',
            maxlength:jQuery.validator.format('通用编码类型的最大长度为:{0}'),
          },
          nameZh:{
            required:'请输入通用编码类型名称(中文)',
            rangelength:jQuery.validator.format('通用编码类型名称(中文)长度为{0}和{1}字符之间')
          },
            nameEn:{
            required:'请输入通用编码类型名称(英文)',
            rangelength:jQuery.validator.format('通用编码类型名称(英文)长度为{0}和{1}字符之间'),
            remote:'该通用编码类型名称已存在，请输入其它参数名称'
          },
          codeLenLimit:{
            required:'请输入编码参数值长度',
            number:jQuery.validator.format('编码参数值长度必须为数字')
          }
        },
        rules: {
            type:{
                required:true,
                maxlength:20
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
            codeLenLimit:{
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
function formatterCodeList(data,type,row) {
   return row.codeName;
}
//判断是否编辑
function formatterEidtable(data,type,full) { 
  if (data) {
	   return lion.lang.editable.y;
  }
  return lion.lang.editable.n;
}

//将JSON复杂对象显示到DataGird中
function formatterName(val, row) {
	var name = "";
	if (val !==null) {
		name = val.nameZh;
	}
	return name;
}
