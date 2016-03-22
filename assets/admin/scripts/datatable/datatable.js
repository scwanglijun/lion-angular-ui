$(function() {
	//加载bootstrap
	Metronic.init(); // init metronic core componets
	Layout.init(); // init layout
	Tasks.initDashboardWidget(); // init tash dashboard widget
});

$(function () {
	TableAdvanced.init();
	 // console.dir($.lion);
	 // console.dir(lion.lang);

      //var alldata=$('#sample_1').dataTable().fnGetData();//得到页面中所有对象

      //console.dir(alldata);
      //
      //
      var oTable = $('#sample_1').dataTable();
 
      $('#sample_1').find('tbody tr').click( function () {
        var data = oTable.fnGetData(this);
        console.dir(data);
        // ... do something with the array / object of data for the row
      });

});


var TableAdvanced = function () {

    var initTable1 = function () {
        var table = $('#sample_1');
        var singleselect=table.data('singleselect');
       // console.dir(singleselect);
        $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-dropdown-on-portlet",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            },
            "collection": {
                "container": "DTTT_dropdown dropdown-menu tabletools-dropdown-menu"
            }
        });

        var oTable = table.dataTable({
            language: {
                'aria': {
                    'sortAscending': ':',
                    'sortDescending': ':'
                },
                'emptyTable': '无记录',
                'info': '从 _START_ 到 _END_ / 共 _TOTAL_ 条数据',
                'infoEmpty': '无记录',
                'infoFiltered': '(从 _MAX_ 条记录过滤)',
                'lengthMenu': '每页显示 _MENU_ 条数据',
                'search': '查找:',
                'sProcessing' : '数据加载中...',
                'zeroRecords': '没有找到'
            },
            columns: [
            	{'data': 'id',render:function(data, type, full){
                    return  '<input type="checkbox" class="checkboxes" value="'+data+'"/>';  
                }},
	            {'data': 'username'},
	            {'data': 'employeeCode'},
	            {'data': 'department.nameZh'},
	            {'data': 'realnameZh', 'class': 'center' },
	            {'data': 'email', 'class': 'center' }
        	],

        	ajaxSource:'/admin/sys/dt/list.json',
        	fnServerData : function(source, sdata, fnCallback) {
        		//console.dir(sdata);
            
        		var param={},that=this,columns=[],orders=[],column={},order={};
                var cname='',nameVal='',sortable='',sortableVal='';
                var sortCol='',sortColVal=-1,sortDir='',sortDirVal='';
                //console.dir(that);
        		$.each(sdata,function(n,value){
        			var paramVal='',paramKey='',dataProp='';
        			 $.each(value,function(key,item){
        			 	 //console.dir(item+" "+key);
        			 	 if(key==='name'){
        			 	 	if(item==='sEcho'){
        			 	 		paramKey='requestId';
        			 	 	}else if(item==='iDisplayStart'){
        			 	 		paramKey='page';
        			 	 	}else if(item==='iDisplayLength'){
        			 	 		paramKey='rows';
        			 	 	}else if(item==='iColumns'){
        			 	 	    paramKey='columnSize';
        			 	 	}else if(item==='iSortingCols'){
        			 	 		paramKey='sortingCols';
        			 	 	}else if(item.indexOf('mDataProp')>-1){
                                 cname='column';
                                 dataProp=cname;
        			 	 	}else if(item.indexOf('bSortable')>-1){
                                 sortable='sortable';
                                 dataProp=sortable;
        			 	 	}else if(item.indexOf('iSortCol')>-1){
                                 sortCol='sortCol';
                                 dataProp=sortCol;
                            }else if(item.indexOf('sSortDir')>-1){
                                 sortDir='dir';
                                 dataProp=sortDir;
                            }
        			 	 }else if(key==='value'&&(lion.util.isEmpty(dataProp))){
                            paramVal=item;
                         }else if(key==='value'&&dataProp==='column'){
                            nameVal=item;
                         }else if(key==='value'&&dataProp==='sortable'){
                            sortableVal=item;
                         }else if(key==='value'&&dataProp==='sortCol'){
                            sortColVal=item;
                         }else if(key==='value'&&dataProp==='dir'){
                            sortDirVal=item;
                         }

        			 });
                     //列单名
                     if(lion.util.isNotEmpty(cname)&&lion.util.isNotEmpty(nameVal)&&lion.util.isNotEmpty(sortable)&&lion.util.isNotEmpty(sortableVal)){
                         column[cname]=nameVal;
                         column[sortable]=sortableVal;
                         columns.push(column);
                        // console.dir('列');
                         cname='';nameVal='';sortable='';sortableVal='';
                         column={};
                     }
                     //排序过滤
                     if(lion.util.isNotEmpty(sortCol)&&lion.util.isNotEmpty(sortColVal)&&lion.util.isNotEmpty(sortDir)&&lion.util.isNotEmpty(sortDirVal)){
                         order[sortCol]=sortColVal;
                         order[sortDir]=sortDirVal;
                         orders.push(order);
                         sortCol='';sortColVal='';sortDir='';sortColVal='';
                         order={};
                     }
                     
        			 if(lion.util.isNotEmpty(paramKey)){
        			 	param[paramKey]=paramVal;
                        paramVal='';
        			 }
        		});
               // console.dir(orders);
               // console.dir(columns);
        	    var order1=[{
        	   		column:'nameZh',
        	   		dir:'asc'
        	   },{column:'username',
        	   		dir:'asc'}];
        	   param['orders']=order1;
        	
			     $.ajax({
					dataType:'json',
					type : 'POST',
					url:source,
					data:JSON.stringify(param),
					success : fnCallback,
					contentType:'application/json',
					timeout : 5000, // 连接超时时间
					error : function handleAjaxError(xhr,
							textStatus, error) {
					 		console.dir(xhr);
					 		console.dir(textStatus);
					 		console.dir(error);
                            $(that).dataTable().fnClearTable(false);
					}
				});
			},
            fnDrawCallback:function(){
                var $that=$(this);
                //表单美化
                $that.find('tbody tr input,textarea,select,utton').uniform(); 
                $that.find('tbody tr').click(function(e){
                   var data=$that.dataTable().fnGetData(this);
                   console.dir(data);
                    var $thattr=$(this),$checkbox=$thattr.find('input[type=checkbox]');
                    if(singleselect===true){
                        $that.find('tbody tr td input[type=checkbox]').each(function(){
                            var $box=$(this);
                            $box.removeAttr('checked');
                            $box.parent('span').removeClass('checked');
                        });
                    }        
                    if(!$checkbox.attr('checked')){
                        $checkbox.attr('checked',true);
                        $checkbox.parent('span').addClass('checked');
                        $thattr.addClass('selected');
                    }
                    //事件停止
                    event.stopPropagation();
                });
                //判断单格              
            },
            initComplete:function(){
                var $that=$(this);
                //单项选择让th 中的checkbox失效
                
                 if(singleselect===true){
                         $that.find('thead th input[type=checkbox]').each(function(){
                                var box=$(this);
                                box.attr('disabled',true);
                         });
                         return;
                 }else{
                        $that.find('thead th input[type=checkbox]').click(function(e){
                             var selectedCbx=$that.find('tbody tr input[type=checkbox]:checked');
                             var allCbx=$that.find('tbody tr input[type=checkbox]');
                             var $thcheckbox=$(this);
                            
                             if(!$thcheckbox.attr('checked')&&selectedCbx.size()>0&&selectedCbx.size()==allCbx.size()){
                                 
                                  $that.find('tbody tr').each(function(){
                                    var $tr=$(this),$checkbox=$tr.find('input[type=checkbox]'); 

                                    $checkbox.removeAttr('checked');
                                    $checkbox.parent('span').removeClass('checked');
                                 });
                             }else{
                                 $that.find('tbody tr').each(function(){
                                    var $tr=$(this),$checkbox=$tr.find('input[type=checkbox]');
                                    $checkbox.attr('checked',true);
                                    $checkbox.parent('span').addClass('checked');                         
                                });
                                $thcheckbox.attr('checked',true);
                                $thcheckbox.parent('span').addClass('checked');
                            }
                            //事件停止
                            event.stopPropagation();
                        });
                    }   
            },
        	columnDefs:[ {'bSortable': false,'aTargets': [0]}],
            //"bSort": true,
            bLengthChange:false,//不显示下拉页面选择器
            searching:false,//不显示搜索框
            processing:false,//服务器
            serverSide:true, //服务器处理
            //bSortClasses:true,//单排序
            "bStateSave": true,
            "order": [
                [1, 'asc']
            ],
            
            "lengthMenu": [
                [5,10,15,20],
                [5,10,15,20] 
            ],
            "pageLength": 5,
        });

        //var tableWrapper = $('#sample_1_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    };

  

     
    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            //console.log('me 1');

            initTable1();
            //initTable2();
            // initTable3();
            // initTable4();
            //initTable5();
            // initTable6();

            //console.log('me 2');
            //$.lion.datatables.language;
          

        }

    };

}();

$(function () {
    var demo2='#sample_2';


    //监听初始化事件
    $(demo2).on('init',function(){
        //初始化事件
    });

    $("#btnAdd").click(function(){
        row=$(demo2).datagrids('getSelected');
        console.dir(row);
    });

    //获取多行数据
    $("#btnEdit").click(function(){
        var rows=$(demo2).datagrids('getSelections');
       
        console.dir(rows);
    });

    $("#btnRefresh").click(function(){
        $(demo2).datagrids('reload');
         var settings=$(demo2).datagrids('settings');
         console.dir(settings);
    });


});

//查询列表
function  formatterDemo(data, type, full){

}