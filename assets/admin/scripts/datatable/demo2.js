$(function () {

	Metronic.init(); // init metronic core componets
	Layout.init(); // init layout
	Tasks.initDashboardWidget(); // init tash dashboard widget

	var demoDt=$("#sample_1");

	var queryForm=$('#queryform');

	$("#btnQuery").click(function(){
		demoDt.datagrids({querydata:queryForm.serializeObject()});
		var queryparam=demoDt.datagrids('queryparams'); 
		demoDt.datagrids('reload');
	});

	$("#btnRefresh").click(function(){
		demoDt.datagrids({querydata:{userid:1}});
        demoDt.datagrids('reload');
        //var settings=demoDt.datagrids('settings');
        //console.dir(settings);
    });


	demoDt.bind("datagrids.initcomplete",function(){
		console.dir('ddd');
	});

	demoDt.on('datagrids.createdrow',function(){
		console.dir('dddd111');
	});

    $("#btnAdd").click(function(){
        row=demoDt.datagrids('getSelected');
        console.dir(row);
    });

    //获取多行数据
    $("#btnEdit").click(function(){
        var rows=demoDt.datagrids('getSelections');
        console.dir(rows);
    });

	 
	demoDt.datagrids({initComplete:function(){
		console.dir('initComplete');
	}});

	  

	$("#btnQuery").click(function(){
		demoDt.datagrids({querydata:queryForm.serializeObject()});
		var queryparam=demoDt.datagrids('queryparams'); 
		demoDt.datagrids('reload');
	});
});

//部门显示方法
function formatterDarptment(data,type,full){
	//console.dir(data);
	if(data){
		return data.nameZh;
	}
	return '';
}
