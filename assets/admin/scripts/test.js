
$(function() {
	//加载bootstrap
	Metronic.init(); // init metronic core componets
	Layout.init(); // init layout
	Tasks.initDashboardWidget(); // init tash dashboard widget
	ComponentsDropdowns.init();

	//$("#d11").click(WdatePicker());
     //$.fn.datepicker({language:'zh-CN'});

	 $(".date-picker").datepicker({
                autoclose: true,
                language:'zh-CN'
            });
});
