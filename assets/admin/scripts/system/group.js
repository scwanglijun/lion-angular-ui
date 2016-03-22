var groupdg=$('#sys_group_list_tb'); //datagrids
var addForm=$('#sysGroupForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
	//默认加载函数
	lion.web.AppInit();

	groupdg=$("#sys_group_list_tb");
	addForm=$('#sysGroupForm');
	addDialog=$('#basic');
	var modalGroupAuth=$('#modalGroupAuth');
	var queryForm=$('#queryform');
  //已关联角色
  var grouproledg=$("#grouprole_list");
  //已关联用户
  var groupuserdg=$("#groupuser_list");
  //授权用户列表
  var authuserdg=$('#authuser_list');
  //授权角色列表
  var authroledg=$('#authrole_list');  
  //默认隐藏第一个tab的modal-footer
  modalGroupAuth.find('.modal-footer').hide();
	//绑定tab事件
  modalGroupAuth.find('.nav-tabs a').click(function(){
      var row=groupdg.datagrids('getSelected');
      var idObj={'id':row.id};
      var selectTabId=$(this).attr('href').substring(1);
      switchTab(selectTabId,idObj);
  });

  //验证表单
  handleVForm(addForm,submitForm);
  
  //角色授权列表创建行调用
  authroledg.on('datagrids.createdrow',function(row,data,index){
      if(index.hasOwnProperty('groupId')){
           selectedChecked(row,data,index);
      }
  });
   //角色加载数据完成
  authroledg.on('datagrids.reload',function(){
      grouproledg.datagrids('checkselected');
      //groupuserdg.datagrids('checkboxdisabled');
  });
  //用户授权列表创建行调用
  authuserdg.on('datagrids.createdrow',function(row,data,index){
      if(index.hasOwnProperty('groupId')){
           selectedChecked(row,data,index);
      }
  });
   //重新加载数据完成
  authuserdg.on('datagrids.reload',function(){
      authuserdg.datagrids('checkselected');
  });
  //创建行回调事件
  groupuserdg.on('datagrids.createdrow',function(row,data,index){
      selectedChecked(row,data,index);
  });
  //创建行内回调事件
  grouproledg.on('datagrids.createdrow',function(row,data,index){
      selectedChecked(row,data,index);
  });
  //重新加载数据完成
  groupuserdg.on('datagrids.reload',function(){
      groupuserdg.datagrids('checkselected');
  });
  //重新加载数据完成
  grouproledg.on('datagrids.reload',function(){
      grouproledg.datagrids('checkselected');
  });
  //选中事件
  function selectedChecked(row,data,index){
     var $checkbox=$(data).find("td input[type=checkbox]");
     $checkbox.attr('checked',true);
     $checkbox.parent('span').addClass('checked');
  }

	
	//用户组授权
	$('#btnAuth').click(function(){
      var selectTabId=modalGroupAuth.find('.tab-pane.active').attr('id');
      var row=groupdg.datagrids('getSelected');
      if(!row){
        lion.util.info('提示','请选择要授权记录');
        return;
      }
      var idObj={'id':row.id};
      //设置ID
      $('#groupId').val(row.id);
      //显示对话框
      modalGroupAuth.modal('toggle');
      switchTab(selectTabId,idObj);
	});

 function switchTab(selectTabId,idObj){
     if(selectTabId==='tab_3_1'){
         //重新加载 用户组角色数据
         grouproledg.datagrids({querydata:idObj});
         grouproledg.datagrids('reload');
         //重新加载 用户组所关联用户数据 
         groupuserdg.datagrids({querydata:idObj});
         groupuserdg.datagrids('reload');
         modalGroupAuth.find('.modal-footer').hide();
         return;
      }else if(selectTabId==='tab_3_2'){
         authroledg.datagrids({querydata:idObj});
         authroledg.datagrids('reload');
         modalGroupAuth.find('.modal-footer').show();
         return;
      }else if(selectTabId==='tab_3_3'){
         authuserdg.datagrids({querydata:idObj});
         authuserdg.datagrids('reload');
         modalGroupAuth.find('.modal-footer').show();
         return;
      }
  }
  

  //用户组授权保存
  $('#btnAuthSave').click(function(){
      var selectTabId=modalGroupAuth.find('.tab-pane.active').attr('id');
      var row=groupdg.datagrids('getSelected');
      var groupId=row.id,param='';
      if(selectTabId==='tab_3_2'){
          param=authSelected(groupId,authroledg);         
          lion.util.postjson('addroletogroup.json',param,authRoleSuccess,errorRequest,authroledg);
      }else if(selectTabId==='tab_3_3'){
          param=authSelected(groupId,authuserdg);
          lion.util.postjson('addusertogroup.json',param,authRoleSuccess,errorRequest,authuserdg);
      }
  }); 

  function authRoleSuccess(data,authdg){
      if(data!==null&&!(data.hasError)){
        lion.util.success('提示',data.message);
        authdg.datagrids('reload');
      }else if(data!==null&&data.hasError){
        var gmsg='';
        for(var msg in data.errorMessage){
          gmsg+=data.errorMessage[msg];
        }
        if(lion.util.isEmpty(gmsg)){
          gmsg='授权出错';
        }
         lion.util.error('提示',gmsg);
      }else{
         lion.util.error('提示','授权出错');
      }
  }
  //将授权信息组合成一个请求对象
  function authSelected(groupId,authdg){
     var allData=authdg.datagrids('getdata'),
          selctedData=authdg.datagrids('getSelections'),
          roleIds=[],
          selectedRoledIds=[];
      $.each(allData,function(key,item){
           roleIds.push(item.id);
      });
      $.each(selctedData,function(key,item){
          selectedRoledIds.push(item.id);
      });
      var param={'id':groupId,'auths':roleIds,'selecteds':selectedRoledIds};
      return param;
  }

	//查询
	$('#btnQuery').click(function(){
		groupdg.datagrids({querydata:queryForm.serializeObject()});
		var queryparam=groupdg.datagrids('queryparams'); 
		groupdg.datagrids('reload');
	});
	//刷新
	$('#btnRefresh').click(function(){		 
        groupdg.datagrids('reload');
    });
	//添加
    $('#btnAdd').click(function(){
      	addForm.reset();
 	    addDialog.find('.modal-header h4 span').text('添加用户组');
	    return;
    });

    //编辑
    $('#btnEdit').click(function(){
      var row=groupdg.datagrids('getSelected');
      if(!row){
        lion.util.info('提示','请选择要编辑记录');
        return;
      }
      addForm.reset();
      addDialog.find('.modal-header h4 span').text('编辑用户组');
      addDialog.modal('toggle');
      addForm.fill(row);
    });

  //删除
	$('#btnDelete').on('click',function(){
		var row=groupdg.datagrids('getSelected');
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
        dgtableId=groupdg.attr('id');
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
	      groupdg.datagrids('reload');
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
          groupdg.datagrids('reload');
        },
        msg:'添加用户组未成功'
      });
}

//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        groupdg.datagrids('reload');
    },
    msg:'编辑用户组未成功'
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
        		required:'请输入用户组名称(中文)',
        		rangelength:jQuery.validator.format('用户组名称(中文)长度为{0}和{1}字符之间')
        	},
            nameEn:{
        		required:'请输入用户组名称(英文)',
        		rangelength:jQuery.validator.format('用户组名称(英文)长度为{0}和{1}字符之间'),
        		remote:'该用户组名称已存在，请输入其它用户组名称'
        	},
        	description:{
        		required:'请输入用户组的描述',
        		maxlength:jQuery.validator.format('用户组描述的最大长度为:{0}'),
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
        invalidHandler: function (event,validator) {             
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
	var name = lion.lang.editable.n;
	if (data) {
		name = lion.lang.editable.y;
	}
	return name;
}