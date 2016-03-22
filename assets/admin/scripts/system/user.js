var userdg='',addForm='',addDialog=$('#basic'); //编辑或添加对话框
$(function() {
	//默认加载函数
	lion.web.AppInit();
   //初始化日期
   $(".date-picker").datepicker({
      autoclose: true,
      language:'zh-CN'
   });
  userdg=$('#sys_user_list_tb');

	addForm=$('#addForm');
    var addDialog=$('#basic'),
	  queryForm=$('#queryform'),
	  userinfo=$('#modaluserinfo'),
	  modalUserAuth=$('#modalUserAuth'),
	  $usergroupdg=$('#usergroup_list'),
	  $userroledg=$('#userrole_list'),
	  $authgroupdg=$('#authgroup_list'),
	  $authroledg=$('#authrole_list');
  //默认隐藏第一个tab的modal-footer
  modalUserAuth.find('.modal-footer').hide();
  //绑定tab事件
  modalUserAuth.find('.nav-tabs a').click(function(){
      var row=userdg.datagrids('getSelected');
      var idObj={'id':row.id};
      var selectTabId=$(this).attr('href').substring(1);
      switchTab(selectTabId,idObj);
  });

  //用户组授权列表创建行调用
  $authgroupdg.on('datagrids.createdrow',function(row,data,index){
      if(index.hasOwnProperty('userId')){
           selectedChecked(row,data,index);
      }
  });
  //用户组加载数据完成
  $authgroupdg.on('datagrids.reload',function(){
      $authroledg.datagrids('checkselected');
  });
   //角色组加载数据完成
  $authgroupdg.on('datagrids.reload',function(){
      $authgroupdg.datagrids('checkselected');
  });
  //用户授权列表创建行调用
  $authroledg.on('datagrids.createdrow',function(row,data,index){
      if(index.hasOwnProperty('userId')){
           selectedChecked(row,data,index);
      }
  });
  //重新加载数据完成
  $authroledg.on('datagrids.reload',function(){
      $authroledg.datagrids('checkselected');
  });
  //用户组行内回调事件
  $usergroupdg.on('datagrids.createdrow',function(row,data,index){
      selectedChecked(row,data,index);
  });
  //用户组加载数据完成后事件
  $usergroupdg.on('datagrids.reload',function(row,data,index){
       $usergroupdg.datagrids('checkselected');
  });
  //用户角色创建行内回调事件
  $userroledg.on('datagrids.createdrow',function(row,data,index){
      selectedChecked(row,data,index);
  });
  //用户加载数据完成后事件
  $userroledg.on('datagrids.reload',function(row,data,index){
      $userroledg.datagrids('checkselected');
  });
  //选中事件
  function selectedChecked(row,data,index){
     var $checkbox=$(data).find("td input[type=checkbox]");
     $checkbox.attr('checked',true);
     $checkbox.parent('span').addClass('checked');
  }
	//验证表单
	handleVForm(addForm,submitForm);

	//选择DataGrid单行
	function getSelectedRow(){return userdg.datagrids('getSelected');}
  //用户授权
  $('#btnAuth').click(function(){
     var row=getSelectedRow();
     if(!row){
       lion.util.info('提示','请选择要授权用户记录');
       return;
     }
     $('#auth_username').text(row.username);
     $('#auth_employeeCode').text(row.employeeCode);
     $('#auth_accountLocked').text(row.accountLocked===true?'已锁定':'未锁定');
     $('#auth_accountExpired').text(row.accountExpired===true?'有效':'无效');
     $('#auth_credentialExpired').text(row.credentialExpired===true?'有效':'无效');
     $('#auth_accountExpiredDate').text(formatterDate(row.accountExpiredDate));
     $('#auth_credentialExpiredDate').text(formatterDate(row.credentialExpiredDate));
     $('#auth_department').text(formatterDepartment(row.department));
     modalUserAuth.modal('toggle');

      var selectTabId=modalUserAuth.find('.tab-pane.active').attr('id');
     
      var idObj={'id':row.id};
      //显示对话框
      switchTab(selectTabId,idObj);
    
  });
  //切换Tab加载不同dataGrids的数据
  function switchTab(selectTabId,idObj){
      if(selectTabId==='tab_3_1'){
         //重新加载 用户组角色数据
         $usergroupdg.datagrids({querydata:idObj});
         $usergroupdg.datagrids('reload');
         //重新加载 用户组所关联用户数据 
         $userroledg.datagrids({querydata:idObj});
         $userroledg.datagrids('reload');
         modalUserAuth.find('.modal-footer').hide();
         return;
      }else if(selectTabId==='tab_3_2'){
         $authgroupdg.datagrids({querydata:idObj});
         $authgroupdg.datagrids('reload');
         modalUserAuth.find('.modal-footer').show();
         return;
      }else if(selectTabId==='tab_3_3'){
         $authroledg.datagrids({querydata:idObj});
         $authroledg.datagrids('reload');
         modalUserAuth.find('.modal-footer').show();
         return;
      }
  }


  //用户组授权保存
  $('#btnAuthSave').click(function(){
      var selectTabId=modalUserAuth.find('.tab-pane.active').attr('id');
      var row=userdg.datagrids('getSelected');
      var groupId=row.id,param='';
      if(selectTabId==='tab_3_2'){
          param=authSelected(groupId,$authgroupdg);         
          lion.util.postjson('addgroups.json',param,authSuccess,errorRequest,$authgroupdg);
      }else if(selectTabId==='tab_3_3'){
          param=authSelected(groupId,$authroledg);
          lion.util.postjson('addroles.json',param,authSuccess,errorRequest,$authroledg);
      }
  }); 
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

  function authSuccess(data,authdg){
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

  //查看用户明细信息
  $('#btnDetails').click(function(){
     var row=getSelectedRow();
     if(!row){
       lion.util.info('提示','请选择查看明细信息记录');
       return;
     }
     $('#user_username').text(row.username);
     $('#user_employeeCode').text(row.employeeCode);
     $('#user_realnameZh').text(row.realnameZh);
     $('#user_realnameEn').text(row.realnameEn);
     $('#user_gender').text(row.gender===0?'男':'女');
     $('#user_telephone').text(row.telephone);
     $('#user_mobile').text(row.mobile);
     $('#user_email').text(row.email);
     $('#user_accountLocked').text(row.accountLocked===true?'已锁定':'未锁定');
     $('#user_accountExpired').text(row.accountExpired===true?'有效':'无效');
     $('#user_credentialExpired').text(row.credentialExpired===true?'有效':'无效');
     $('#user_accountExpiredDate').text(formatterDate(row.accountExpiredDate));
     $('#user_credentialExpiredDate').text(formatterDate(row.credentialExpiredDate));
     $('#user_department').text(formatterDepartment(row.department));
     $('#user_officePhone').text(row.officePhone);
     $('#user_fax').text(row.fax);
     $('#user_postcode').text(row.postcode);
     $('#user_location').text(row.location);
     $('#user_description').text(row.description);
     $('#userauth_list').datagrids('reload');
     userinfo.modal('toggle');
  });
	/**
	 * [查询]
	 */
	 $('#btnQuery').click(function(){
        //添加查询参数
	      userdg.datagrids({querydata:queryForm.serializeObject()});
	      //重新加载数据
	      userdg.datagrids('reload'); 
	 });
 
	 //刷新
	 $('#btnRefresh').on('click',function(){
		 userdg.datagrids('reload'); 
	 });
	 //添加
	 $('#btnAdd').on('click',function(){
	 	 addForm.reset();
     $('.date-picker[id=1]').datepicker('update',$('#credentialExpiredDate').val());
     $('.date-picker[id=2]').datepicker('update',$('#accountExpiredDate').val());
	 	 addDialog.find('.modal-header h4 span').text('添加用户');
		 return;
	 });
	 //编辑
	 $('#btnEdit').on('click',function(){
		 var row=getSelectedRow();
		 if(!row){
			 lion.util.info('提示','请选择要编辑记录');
			 return;
		 }
 		 addForm.reset();
     addDialog.find('.modal-header h4 span').text('编辑用户');
		 addDialog.modal('toggle');
     $('.date-picker[id=1]').datepicker('update',formatterDate(row.credentialExpiredDate));
     $('.date-picker[id=2]').datepicker('update',formatterDate(row.accountExpiredDate));
		 addForm.fill(row);
		 $("#departmentId").combotree('val',$("#departmentId").val());
	 });
	 //删除
	 $('#btnDelete').on('click',function(){
		 var row=userdg.datagrids('getSelected');
    lion.web.deletefn({
      url:'delete.json',
      data:row,
      unselectedmsg:'请选择要删除记录',
      confirmmsg:'确认要删除此记录？',
      success:successForDelete,
    });
	 });
	 //保存方法
	 $('#btnSave').click(function(){
	 	   addForm.submit();
	 });
   
    //重置密码
   $('#btnResetPwd').click(function(){
     var row=getSelectedRow();
     if(!row){
       lion.util.info('提示','请选择要重置密码的记录');
       return;
     }
     bootbox.confirm('确认要重置密码？', function(result) {
          if(result){              
              var param={'id':row.id};
              lion.util.post('resetpwd.json',param,successForResetPwd,errorRequest);
          }
      });
   });

   $("#btnLokced").click(function(){
      var row=getSelectedRow();
     if(!row){
       lion.util.info('提示','请选择要锁定用户');
       return;
     }
     bootbox.confirm('确认要锁定此用户，锁定后用户将不能登录？', function(result) {
          if(result){              
              var param={'id':row.id};
              lion.util.post('lock.json',param,successForLock,errorRequest);
          }
      });
   });

   $("#btnUnlock").click(function(){
      var row=getSelectedRow();
     if(!row){
       lion.util.info('提示','请选择要解锁用户');
       return;
     }
     bootbox.confirm('确认要解锁此用户？', function(result) {
          if(result){              
              var param={'id':row.id};
              lion.util.post('unlock.json',param,successForUnLock,errorRequest);
          }
      });
   });

	 //导出Excel
	 $('#btnExport').on('click',function(){
	     var params=queryForm.serialize(),
         dgtableId=userdg.attr('id');
         lion.web.exportfn({url:'export.json',data:params,tableId:dgtableId});
         return;
	 });	
});

function successForUnLock(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      userdg.datagrids('reload'); 
   }else if(data!==null&&data.hasError){
      var gmsg='';
      for(var msg in data.errorMessage){
        gmsg+=data.errorMessage[msg];
      }
      if(lion.util.isEmpty(gmsg)){
        gmsg='用户解锁未成功';
      }
      lion.util.error('提示',gmsg);
  }
}
function successForLock(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      userdg.datagrids('reload'); 
   }else if(data!==null&&data.hasError){
      var gmsg='';
      for(var msg in data.errorMessage){
        gmsg+=data.errorMessage[msg];
      }
      if(lion.util.isEmpty(gmsg)){
        gmsg='用户锁定未成功';
      }
      lion.util.error('提示',gmsg);
  }
}
function successForResetPwd(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      userdg.datagrids('reload'); 
   }else if(data!==null&&data.hasError){
      var gmsg='';
      for(var msg in data.errorMessage){
        gmsg+=data.errorMessage[msg];
      }
      if(lion.util.isEmpty(gmsg)){
        gmsg='用户重置密码未成功';
      }
      lion.util.error('提示',gmsg);
  }
}

function successForDelete(data,arg){
   if(data!==null&&!(data.hasError)){
      lion.util.success('提示',data.message);
      userdg.datagrids('reload'); 
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
  console.dir('console');
	var param=frm.serialize(),id=($('#id').val());
  //ID为空时，为添加动作
  if(lion.util.isEmpty(id)){
      lion.web.post({url:'add.json',data:param,success:successAddFrm});
  }else{
    console.dir('dd');
      lion.web.post({url:'edit.json',data:param,success:successEditFrm});
  }
}

//添加成功的函数
function successAddFrm(result,args){
      lion.web.parsedata({
        data:result,
        success:function(){
          addDialog.modal('toggle');
          userdg.datagrids('reload');
        },
        msg:'添加用户未成功'
      });
}

//编辑成功的函数
function successEditFrm(result,args){
  lion.web.parsedata({
    data:result,
    success:function(){
        addDialog.modal('toggle');
        userdg.datagrids('reload');
    },
    msg:'编辑用户未成功'
  });
}

//验证表单
handleVForm=function(vForm,submitCallBackfn){
	var addError = $('.alert-danger', vForm), addSuccess = $('.alert-success',vForm),context=lion.util.context;
	var checkusernameUrl=context+'/system/useraccount/checkusername.json';
	var checkEmployeeCodeUrl=context+'/system/useraccount/checkemployeecode.json';
	var checkEmailUrl=context+'/system/useraccount/checkemail.json';
	vForm.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error', 
        focusInvalid: false, 
        onkeyup:false,
        ignore: '', 
        messages: {
        	username:{
        		required:'请输入用户名',
        		rangelength:jQuery.validator.format('用户名长度为{0}和{1}字符之间'),
        		remote:'该用户名已存在',

        	},
        	employeeCode:{
        		required:'请输入员工号',
        		rangelength:jQuery.validator.format('员工号长度为{0}和{1}字符之间'),
        		remote:'该员工号已存在'
        	},
        	email:{
        		required:'请输入邮箱',
        		email:'请输入正确格式的邮箱',
        		maxlength:jQuery.validator.format('邮箱的最大长度为{0}字符'),
        		remote:'该邮箱已存在'
        	},
        	departmentId:{required:'请选择部门'},
        	realnameZh:{maxlength:'真实姓名(中文)的最大长度为{0}字符'},
        	realnameEn:{maxlength:'真实姓名(中文)的最大长度为{0}字符'},
        },
        rules: {
            username:{
                required:true,
                rangelength:[4,30],
              	remote:{
              			url:checkusernameUrl, //后台处理程序
  					    type:'post',               //数据发送方式
  					    dataType:'json',           //接受数据格式   
  					    data: {                     //要传递的数据
					           nameEn: function() {
					            return $('#usename').val();
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
            employeeCode: {
                required:true,
                rangelength:[4,30],
                remote:{
              			url:checkEmployeeCodeUrl, //后台处理程序
  					    type:'post',               //数据发送方式
  					    dataType:'json',           //接受数据格式   
  					    data: {                     //要传递的数据
					           nameEn: function() {
					            return $('#employeeCode').val();
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
            email:{
            	required:true,
            	email:true,
            	maxlength:128,
            	remote:{
              			url:checkEmailUrl, //后台处理程序
      					    type:'post',               //数据发送方式
      					    dataType:'json',           //接受数据格式   
      					    data: {                     //要传递的数据
    					           nameEn: function() {
    					            return $('#email').val();
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
            departmentId:{required:true},
            realnameZh:{maxlength:128,},
            realnameEn:{maxlength:128,}
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
function formatterEidtable(data,type,full) {
	var name ='失效';
	if (data&&data===true) {
		name ='有效';
	}
	return name;
}
//判断是否编辑
function formatterAccountLocked(data,type,full) {
  var name ='未锁定';
  if (data&&data===true) {
    name ='已锁定';
  }
  return name;
}
//截取日期-YYYY-MM-DD
function formatterDate(data,type,full) {
  if (data) {
      return data.substring(0,10);
  }
  return data;
}
//部门显示方法
function formatterDepartment(data,type,full){
  if(data){
    return data.nameZh;
  }
  return '';
}