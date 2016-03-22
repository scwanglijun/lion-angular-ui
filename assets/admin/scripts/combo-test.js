$(function() {
	//加载bootstrap
	Metronic.init(); // init metronic core componets
	Layout.init(); // init layout
	Tasks.initDashboardWidget(); // init tash dashboard widget
	//ComponentsDropdowns.init();

	//$("#d11").click(WdatePicker());
     //$.fn.datepicker({language:'zh-CN'});
     //
     
       var sample1=$('#select2_sample1').select2({
       		minimumResultsForSearch: -1,
       		language:'zh-CN',
            placeholder: "请选择...",
            allowClear: true
        });

       $("#btnGetVal").click(function(){
       		var val=$('#select2_sample1').select2('val');
       		console.dir(val);
       });

       $("#btnChangeVal").click(function(){
       	  $('#select2_sample1').select2({
       	  	minimumResultsForSearch: -1,
       		language:'zh-CN',
            placeholder: "请选择...",
            allowClear: true
       	  }).val('1').trigger('change');
       });

       $("#btnClear").click(function(){
		$('#select2_sample1').select2({
       	  	minimumResultsForSearch: -1,
       		language:'zh-CN',
            placeholder: "请选择...",
            allowClear: true
       	  }).val(null).trigger('change');
       });

       var data1 = [{ id: 0, text: 'enhancement' }, 
        				{ id: 1, text: 'bug' }, 
        				{ id: 2, text: 'duplicate' }, 
        				{ id: 3, text: 'invalid' }, 
        				{ id: 4, text: 'wontfix',selected:true}];
       var allowClear=true,keyId='id',textKey='text',selectedKey='selected';
	     $("#btnData").click(function(){
	  	 $frmselect=$('#select2_sample1');
	  	 $frmselect.empty();//清空内容
	  	 if(allowClear===true){
	  	 	$frmselect.append('<option value=""></option>');
	  	 }
	   	 $.each(data1,function(key,item){
	   	 	   var selected=item[selectedKey];
	   	 	   var itemId=item[keyId];
	   	 	   var itemText=item[textKey];
	   	       if(selected===true){
	   	 	  		$frmselect.append('<option value="'+itemId+'" selected="true">'+itemText+'</option>');
	   	 	   }else{
	   	 	   		$frmselect.append('<option value="'+itemId+'" >'+itemText+'</option>');
	   	 	   }
	   	 });
	   	 $('#select2_sample1').select2({
       	  	minimumResultsForSearch: -1,
       		language:'zh-CN',
            placeholder: "请选择...",
            allowClear: true
       	  }).val(null).trigger('change');
       });

	     $("#btnGetValCombo").click(function(){
	     	 var val=$('#select2_sample2').combo('getVal');
	     	 console.dir('getVal:'+val);
	     	 var allData=$('#select2_sample2').combo('val');
	     	 console.dir('val:'+allData);
	     });
	       //改变值内容
	     $('#btnChangeValCombo').click(function(){
	     	 $('#select2_sample2').combo('val',['systems']);	
	     });

	     //清除
	       $('#btnClearCombo').click(function(){
	     	$('#select2_sample2').combo('clear');
	     	 //console.dir(allData);	
	     });

	     //加载数据
	     $('#btnDataCombo').click(function(){
	     	$('#select2_sample2').combo('refresh');
	     });

	     //获取所有的数据
	     $('#btnGetAllDataCombo').click(function(){
	     	var allData=$('#select2_sample2').combo('getData');
	     	 console.dir(allData);	
	     });
        $("#select2_sample3").select2({
            placeholder: "Select...",
            allowClear: true,
            minimumInputLength: 1,
        });
});
