var roledg=$('#sys_rolelist_tb'); //datagrids
var addForm=$('#sysRoleForm');  //编辑或添加表单
var addDialog=$('#basic'); //编辑或添加对话框
$(function () {
	//默认加载函数
	lion.web.AppInit();

	roledg=$("#sys_rolelist_tb");
	addForm=$('#sysRoleForm');
	addDialog=$('#basic');
	var modalRoleAuth=$('#modalRoleAuth');
	var queryForm=$('#queryform');
	//已关联用户组
	var rolegroupdg=$("#rolegroup_list");
	//已关联用户
	var roleuserdg=$("#roleuser_list");
	//授权用户列表
	var authuserdg=$('#authuser_list');
	//授权用户组列表
	var authgroupdg=$('#authgroup_list');
  //授权资源列表
  var resourcetree=$('#resourcetree');
  /**资源树型结构设置*/
  var settingrt= {
      check: {enable: true},
      view: {dblClickExpand: false},
      callback: {beforeClick:beforeClick,onClick:onClick}
  };
  function beforeClick(treeId, treeNode){

  }
  /**资源树型结构-单点事件*/
  function onClick(e, treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj("resourcetree"),
          nodes = zTree.getSelectedNodes(),v = "";
          
          nodes.sort(function compare(a,b){return a.id-b.id;});
          for (var i=0, l=nodes.length; i<l; i++) {
              v += nodes[i].name + ",";
          }
          if (v.length > 0 ) v = v.substring(0, v.length-1);
   }
  //默认隐藏第一个tab的modal-footer
    modalRoleAuth.find('.modal-footer').hide();
	//绑定tab事件
    modalRoleAuth.find('.nav-tabs a').click(function(){
      //var selectTabId=modalRoleAuth.find('.tab-pane.active').attr('id');
      var row=roledg.datagrids('getSelected');
      var idObj={'id':row.id};
      var selectTabId=$(this).attr('href').substring(1);
      switchTab(selectTabId,idObj);
  });
  
  //角色授权列表创建行调用
  authgroupdg.on('datagrids.createdrow',function(row,data,index){
      if(index.hasOwnProperty('roleId')){
           selectedChecked(row,data,index);
      }
  });
  //角色加载数据完成
  authgroupdg.on('datagrids.reload',function(){
      authgroupdg.datagrids('checkselected');
  });

  //用户授权列表创建行调用
  authuserdg.on('datagrids.createdrow',function(row,data,index){
      if(index.hasOwnProperty('roleId')){
           selectedChecked(row,data,index);
      }
  });
   //重新加载数据完成
  authuserdg.on('datagrids.reload',function(){
      authuserdg.datagrids('checkselected');
  });
  //创建行回调事件
  roleuserdg.on('datagrids.createdrow',function(row,data,index){
      selectedChecked(row,data,index);
  });
  //创建行内回调事件
  rolegroupdg.on('datagrids.createdrow',function(row,data,index){
      selectedChecked(row,data,index);
  });

  function selectedChecked(row,data,index){
     var $checkbox=$(data).find("td input[type=checkbox]");
     $checkbox.attr('checked',true);
     $checkbox.parent('span').addClass('checked');
  }

	//验证表单
	handleVForm(addForm,submitForm);
	//用户组授权
	$('#btnAuth').click(function(){
      var selectTabId=modalRoleAuth.find('.tab-pane.active').attr('id');
      var row=roledg.datagrids('getSelected');
      if(!row){
        lion.util.info('提示','请选择要授权记录');
        return;
      }
      var idObj={'id':row.id};
      //设置ID
      $('#roleId').val(row.id);
      //显示对话框
      modalRoleAuth.modal('toggle');
      switchTab(selectTabId,idObj);
	});
	//切换Tab加载不同dataGrids的数据
	function switchTab(selectTabId,idObj){
		  if(selectTabId==='tab_3_1'){
	         //重新加载 用户组角色数据
	         rolegroupdg.datagrids({querydata:idObj});
	         rolegroupdg.datagrids('reload');
	         //重新加载 用户组所关联用户数据 
	         roleuserdg.datagrids({querydata:idObj});
	         roleuserdg.datagrids('reload');
	         modalRoleAuth.find('.modal-footer').hide();
	         return;
	      }else if(selectTabId==='tab_3_2'){
	         authgroupdg.datagrids({querydata:idObj});
	         authgroupdg.datagrids('reload');
	         modalRoleAuth.find('.modal-footer').show();
	         return;
	      }else if(selectTabId==='tab_3_3'){
           modalRoleAuth.find('.modal-footer').show();
	         authuserdg.datagrids({querydata:idObj});
	         authuserdg.datagrids('reload');
	         return;
	      }else if(selectTabId==='tab_3_4'){
          modalRoleAuth.find('.modal-footer').show();
          initZTree(idObj);
          return;
        }
	}

  function initZTree(idObj){
     var nodes={},context=lion.util.context,url=context+'/system/role/resources.json?';
     lion.util.postasync(url,idObj,successTree,errorRequest);    
     function successTree(data){
          nodes=data;
     }
     $.fn.zTree.init(resourcetree,settingrt,nodes);  
  }
  //重新加载数据完成
  roleuserdg.on('datagrids.reload',function(){
      roleuserdg.datagrids('checkselected');
  });
  //重新加载数据完成
  rolegroupdg.on('datagrids.reload',function(){
      rolegroupdg.datagrids('checkselected');
  });

  //用户组授权保存
  $('#btnAuthSave').click(function(){
      var selectTabId=modalRoleAuth.find('.tab-pane.active').attr('id');
      var row=roledg.datagrids('getSelected');
      var roleId=row.id,param='';
      if(selectTabId==='tab_3_2'){
          param=authSelected(roleId,authgroupdg);         
          lion.util.postjson('addgrouptorole.json',param,authgroupSuccess,errorRequest,authgroupdg);
      }else if(selectTabId==='tab_3_3'){
          param=authSelected(roleId,authuserdg);
          lion.util.postjson('addusertorole.json',param,authgroupSuccess,errorRequest,authuserdg);
      }else if(selectTabId==='tab_3_4'){
          //保存数据已选中树型结构
          var zTree = $.fn.zTree.getZTreeObj("resourcetree"),
          checkedNodes = zTree.getCheckedNodes(true),v = "";
          param=authResourceTree(roleId,checkedNodes);
          lion.util.postjson('addresources.json',param,authgroupSuccess,errorRequest,authuserdg);
      }
  }); 

  function authgroupSuccess(data,authdg){
      if(data!==null&&!(data.hasError)){
        lion.util.success('提示',data.message);
        if(authdg!==null){
            authdg.datagrids('reload');
        }
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
  /**树授权参数组合*/
  function authResourceTree(roleId,checkedNodes){
      var selectedRoledIds=[];
      $.each(checkedNodes,function(key,item){
          selectedRoledIds.push(item.id);
      });
      var param={'id':roleId,'selecteds':selectedRoledIds};
      return param;
  }
  //将授权信息组合成一个请求对象
  function authSelected(roleId,authdg){
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
      var param={'id':roleId,'auths':roleIds,'selecteds':selectedRoledIds};
      return param;
  }

	//查询
	$('#btnQuery').click(function(){
		roledg.datagrids({querydata:queryForm.serializeObject()});
		var queryparam=roledg.datagrids('queryparams'); 
		roledg.datagrids('reload');
	});
	//刷新
	$('#btnRefresh').click(function(){		 
        roledg.datagrids('reload');
    });
	//添加
    $('#btnAdd').click(function(){
      	addForm.reset();
	 	addDialog.find('.modal-header h4 span').text('添加角色');
		return;
    });

    //编辑
    $('#btnEdit').click(function(){
      var row=roledg.datagrids('getSelected');
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
		var row=roledg.datagrids('getSelected');
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
        dgtableId=roledg.attr('id');
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
	      roledg.datagrids('reload');
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
            roledg.datagrids('reload');
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
        roledg.datagrids('reload');
    },
    msg:'编辑角色未成功'
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
