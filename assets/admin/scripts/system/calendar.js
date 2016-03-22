var addform = $('#sysCalendarForm');
var addDialog=$('#basic'); //编辑或添加对话框
$(function(){
	//加载默认函数
	lion.web.AppInit();
	Calendar.init();
	addform = $('#sysCalendarForm');
	addDialog=$('#basic'); 
	//初始化日期
   $(".date-picker").datepicker({
      autoclose: true,
      language:'zh-CN'
   });
   $('#starttimepicker').timepicker({
	   showMeridian : false,
	   disableFocus : true
   });
   $('#endtimepicker').timepicker({
	   showMeridian : false,
	   disableFocus : true
   });
   //是否全天
   $('#isallday').click(function(){
	   if($(this).attr('checked')=='checked'){
		   $("div[name='timepicker']").css('display','none');
	   }else{
		   $("div[name='timepicker']").css('display','block');
	   }
   });
   $('#my-draggable').draggable({
	    revert: true,      // immediately snap back to original position
	    revertDuration: 0  //
	});
   $('#btnSave').click(function(){
	   var param=addform.serialize(),id=($('#id').val());
	   //ID为空时，为添加动作
	   if(lion.util.isEmpty(id)){
	       lion.web.post({url:'add.json',data:param,success:successAddFrm});
	   }else{
	       lion.web.post({url:'edit.json',data:param,success:successEditFrm});
	   }
   });
   $('#btnDelete').click(function(){
      lion.web.deletefn({
        url:'delete.json',
        data:{'id':function(){return $('#id').val();}},
        unselectedmsg:'请选择要删除记录',
        confirmmsg:'确认要删除此记录？',
        success:successForDelete,
      });
   });
   //添加成功的函数
   function successAddFrm(result,args){
     lion.web.parsedata({
       data:result,
       success:function(){
    	 $("#calendar").fullCalendar("refetchEvents");
         addDialog.modal('toggle');
       },
       msg:'添加待办事项未成功'
     });
   }

   //编辑成功的函数
   function successEditFrm(result,args){
     lion.web.parsedata({
       data:result,
       success:function(){
    	   $("#calendar").fullCalendar("refetchEvents");
           addDialog.modal('toggle');
       },
       msg:'编辑待办事项未成功'
     });
   }
   //删除成功
   function successForDelete(data,arg){
      if(data!==null&&!(data.hasError)){
    	 $("#calendar").fullCalendar("refetchEvents");
         lion.util.success('提示',data.message);
         addDialog.modal('toggle');
      }else if(data!==null&&data.hasError){
    	 addDialog.modal('toggle');
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
})