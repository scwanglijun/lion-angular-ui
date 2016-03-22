$(function(){
	var title	= ['请选择类型' , '请选择表格名称'];
	var options1 = title[0];
	var options2 = title[1];
	$('.lion-casc1').each(function () {
		$(this).select2({
	   		minimumResultsForSearch:-1,
	        allowClear:true
		});
	});
	$('.lion-casc2').each(function () {
		$(this).select2({
	   		minimumResultsForSearch:-1,
	        allowClear:true
		});
	});
	
});