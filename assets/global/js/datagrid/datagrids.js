/**
 * Newtouch Lion UI 0.1
 * 
 * Copyright (c) 2014 www.newtouch.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at lijun.wang1@newtouch.cn
 */
/**
 * @author wanglijun
 * @date 2015-01-19
 * lion datagrids lib - jQuery Lion UI
 * 对话框
 * Dependencies js:
 * jQuery.js bootstrap.js lion.js datatables.js
 * Depedencies css
 * bootstrap.css datatalbes.css lion.css,datagrids.css (Bootstrap v3.3.1)
 */
 ;(function($){
 	 'use strict';// js hint ;_;
	 this.ui = this.ui || {}; //定义ui对象。为避免覆盖如果存在ui对象则使用，不存在则新建
	 var util = this.util, //用变量存储util.js中的方法，方便调用
         exports = this.ui, //用变量存储ui下的方法，可直接使用此变量追加组件。如不这样需要this.ui.add追加
         _version = this.version,//组件版本号
         _id = 0,//id
         _catchPrefix = 'ui-datagrids-',//组件缓存对象前缀
         _idPrefix = this.namespace + '-datagrids-',//自定义id前缀
         events = {};//按钮事件缓存区
   //默认HTML模板
   var templates={
      checkboxs:'<input type="checkbox" class="checkboxes"/>'//checkbox的模板
   };
 
	var defaults={
		id:'',
		singleselect:false,//默认单项选择=true
		lengthchange:false,//不显示下拉页面选择器
		searching:false,//不显示搜索框
        querydata:{},//查询参数
    	processing:true,//服务器
        serverside:true, //服务器处理
        statesave:true,//保存当前状态
        scrolly:'',//垂直滚动条的区域大小
        scrollx:false,//水平滚动条的区域大小
        jqueryui:false,//是否采用jqueryUI滚动条的样式
        scrollcollapse:false,//是否采用垂直滚动条
        sort:true,//是否排序
        order:[], //默认排序
        deferRender: true,
        pagelist:[[5,10,15,20],[5,10,15,20]],//下拉菜单
        pagesize:10,//默认页面显示记录数
        columnDefs:[ {'bSortable': false,'aTargets': [0]}],//默认第一列不排序
        loadurl:'',//加载URL
        loading:true,//是否立即加载数据
        checkbox:false,//显示复选框
        paginate:true,//是否显示分页
        language: lion.lang,//语言选项
        column:{field:'',//字段名称
                formatter:'',//格式化函数
                sortable:true,//默认为可排序 true
                sortDir:'acs', //排序默认升序：desc
                checkbox:false,//默认函数
               }//默认的列的模型
	};

	//组件函数
	var Datagrids=function Datagrids(element,options,e){
  
		//参数选项
		this.options=options;
		//datagrid节点
	    this.$element = $(element);
	    //ID
	    this.id=this.$element.attr('id');
	    this.options.id=this.id;
	    //DataTable对象
	    this.$odatatale=null;
	    //表头
	    this.headerCols=null;
	    //配置信息
	    this.osettings=null;
	    //单行;
	    this.rows=null;
	    //是否是单行选择
	    this.singleselect=this.options.singleselect;
	    //单行选择的行对象
	    this.selectedrow=null;
	    //不排序
	    this.sorttargets=[];
	    //初始化函数
	    this.init();
	};
	//版本数据
	Datagrids.version=_version;
	//创建Combox对象
 	Datagrids.prototype = {
        //设置构造函数
        constructor: Datagrids,
        //设置初始化方法
        init:function(){
        	//加载样式
            this.loadTableClass();
            //创建表
        	this.$odatatale=this.buildTable();
        	//创建列
        	//this.columns();
        	this.osettings=this.settings();
            //加载事件
            this.initComplete();
        },
        //查询参数
        queryparams:function(data){
           if(util.isEmpty(data)){
              return this.options.querydata;
           }else{
              this.options.querydata=data;
           }

        },
        //获取查询参数
        querydata:function(){
            return this.options.querydata;
        },
       	//创建表格样式
       	loadTableClass:function(){
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
       	},
       	//创建自定义列
       	columnDefs:function(){
          var colDefs=[{'sDefaultContent': '','aTargets':'_all'}],colDef={};
          if(this.sorttargets.length>0){
              colDef['bSortable']=false;
              colDef['aTargets']=this.sorttargets;
              
              colDefs.push(colDef);
          }else{
       		   colDefs=[{'bSortable':false,'aTargets': [0],},{'sDefaultContent': '','aTargets':'_all'}];
          }

       		return colDefs;
       	},
       	//表格头构造
       	columns:function(){
          var cols=[],//列表头集合
              headers=this.buildHeader(),//列的信息
              that=this,
              firstSortable=-1,firstSortDir='asc'; //默认无指定排序列及顺序

          $.each(headers,function(key,item){
              var col={};
              col['data']=item.field;
              //判断是否有checkbox
              if(item.checkbox){
                col['render']=function(data,type,full){                  
                   that.sorttargets.push(key);
                   return  '<input type="checkbox" class="checkboxes" value="'+data+'"/>';
                };
              }else if(!item.sortable){
                  //将是否排序
                  that.sorttargets.push(key);                   
              }
              //为列添加自定义函数
              if(util.isNotEmpty(item.formatter)&&!item.checkbox){
                  var tempFn=eval(item.formatter);
                  col['render']=function(data,type,full){
                      return tempFn.call(this,data,type,full);
                  };
              }

              //确定 需要排序的第一列排序
              if(firstSortable===-1&&!item.checkbox&&item.sortable){
                  firstSortable=key;
                  firstSortDir=item.sortDir.toLowerCase()==='asc'?'asc':'desc';
                  that.options.order.push(firstSortable);
                  that.options.order.push(firstSortDir);
              }
              //将列表添加到
              cols.push(col);
          });
        	return cols;
       	},
        //构建表头
        buildHeader:function(){
            var that=this,headers=[];
            this.$element.find('thead th').each(function(){
                  var  $this=$(this),thdata=$this.data(),coldata=$.extend({},that.options.column,thdata);                  
                  headers.push(coldata);
            });
            return headers;
        },

       	orders:function(){
          if(this.options.order.length===0){
       		 return [[1, 'asc']];
          }else{
             var corders=[];
             corders.push(this.options.order);
             return corders;
          } 

       	},
       	//构造表格
       	buildTable:function(){
              var that=this, 
              tableOptions={
              language:that.options.language,//语言
              columns:that.columns(),//列创建  
              ajaxSource:that.options.loadurl,//数据加载URL
              columnDefs:that.columnDefs(),//自定义列
              bLengthChange:that.options.lengthchange,//不显示下拉页面选择器
              searching:that.options.searching,//不显示搜索框
              processing:that.options.processing,//服务器
              serverSide:that.options.serverside, //服务器处理
              bStateSave:that.options.statesave,//保存翻页状态
              order:that.orders(),//默认排序
              deferRender:that.options.deferRender,
              lengthMenu:that.options.pagelist,
              pageLength:that.options.pagesize,
              bAutoWidth:false,
              bPaginate:that.options.paginate,
              fnInitComplete:function(){
                that.loadinitComplete();
                that.initComplete();
              },//初始化事件
              fnDrawCallback:function(){
                that.drawCallback();
              },//表格重绘回调函数
              fnServerData:function(source, sdata, fnCallback){
                 that.loaddata(source,sdata,fnCallback);
              },//加载服务器数据       
              createdRow:function(row, data, index){
                that.createdRow(row, data, index);
              },//创建行调用回调
              
              //add by wuxiang
              footerCallback:function(row, data, start, end, display){
            	  if(that.$element.find('tfoot').length != 0){
            		  var api = this.api(), data;
                	  
                      // Remove the formatting to get integer data for summation
                      var intVal = function ( i ) {
                          return typeof i === 'string' ?
                              i.replace(/[\$,]/g, '')*1 :
                              typeof i === 'number' ?
                                  i : 0;
                      };
           
                      // Total over all pages
                      var total = api
                          .column( 5 )
                          .data()
                          .reduce( function (a, b) {
                              return intVal(a) + intVal(b);
                          }, 0 );
           
                      // Total over this page
                      var pageTotal = api
                          .column( 5, { page: 'current'} )
                          .data()
                          .reduce( function (a, b) {
                              return intVal(a) + intVal(b);
                          }, 0 );
           
                      // Update footer
                      $( api.column( 5 ).footer() ).html(
                          '$'+pageTotal
                      );  
            	  }       	  
               }
              };
              if(!that.options.sort){
                 tableOptions['bSort']=that.options.sort;
              }
              //垂直滚动条
              if(util.isNotEmpty(that.options.scrolly)){
                  tableOptions['scrollY']=that.options.scrolly;
                  tableOptions['scrollCollapse']=this.options.scrollcollapse;
                  if(that.options.jqueryui===true){
                      tableOptions['jQueryUI']=this.options.jqueryui;
                  }
              }
              
              //console.dir(tableOptions);     	 
       		    var odatatable=this.$element.dataTable(tableOptions);
       		    return odatatable;
       	},
       	//获取表格设置
       	settings:function(){
       		var odatatable=this.$element.dataTable();
       	 	return odatatable.fnSettings();
       	},
       	//多行数据返回已选择的数据
       	getSelections:function(){
       		var datas=[],odatatable=this.$element.dataTable();
       		this.$element.find('tbody tr').each(function(){
       		 	 var $checkbox=$(this).find('input[type=checkbox]:checked');
       		 	 if($checkbox.size()>0){
       			 	var row=odatatable.fnGetData(this);
       				datas.push(row);
       			}
       		});
       		return datas;
       	},
       	//获取选择的行数据row
       	getSelected:function(){
       		 if(this.selectedrow){
       		 	  return this.$element.dataTable().fnGetData(this.selectedrow);
       		 }
           return '';
       	},
        //获取所有数据
        getdata:function(){
            var aoData=this.settings().aoData,datas=[];
            $.each(aoData,function(key,item){
                 datas.push(item._aData);
            });
            return datas;
        },
       	//表格重绘回调函数
       	drawCallback:function(){
       		var that=this,
              $thatelement=that.$element,
              $wrapper=$('#'+this.id+'_wrapper'),
              tbodytr=$thatelement.find('tbody tr'),
              tbodytrsize=tbodytr.length;
          //多行选择取消
          if(this.options.checkbox){
              $thatelement.find('thead th input[type=checkbox]').each(function(){                
                  var $box=$(this); 
                  $box.removeAttr('checked');
                  $box.parent('span').removeClass('checked');
              });
          }
          //表单美化
       		$thatelement.find('tbody tr input,textarea,select,button').uniform();
          //单点checkbox
          $thatelement.find('tbody tr td input[type=checkbox]').click(function(e){            
              $(e.target ).closest('tr').trigger('click');
          });
          //单元格事件
       		tbodytr.click(function(e){
                    var $thattr=$(this),$checkbox=$thattr.find('input[type=checkbox]');
                    that.selectedrow=this;
                    if(that.options.singleselect===true){
                        $thatelement.find('tbody tr td input[type=checkbox]').each(function(){
                            var $box=$(this); 
                            $box.removeAttr('checked');
                            $box.parent('span').removeClass('checked');
                        });
                    }        
                    if(!$checkbox.attr('checked')){
                        $checkbox.attr('checked',true);
                        $checkbox.parent('span').addClass('checked');
                        $thattr.addClass('selected');
                    }else{
                        $checkbox.removeAttr('checked');
                        $checkbox.parent('span').removeClass('checked');
                        $thattr.removeClass('selected');
                    }
      
                  
                    if(that.options.checkbox){
                       var selectedsize=$thatelement.find('tbody tr input[type=checkbox]:checked').length;
                       if(selectedsize===tbodytrsize){
                          $thatelement.find('thead th input[type=checkbox]').each(function(){                
                              var $box=$(this); 
                              $box.attr("checked",true);
                              $box.parent('span').addClass('checked');
                          });
                      }else{
                           $thatelement.find('thead th input[type=checkbox]').each(function(){                
                              var $box=$(this); 
                              $box.removeAttr('checked');
                              $box.parent('span').removeClass('checked');
                          });
                      }
                    }
                  //事件停止
                 // event.stopPropagation();
            });

          var e = $.Event('datagrids.reload');
          this.$element.trigger(e);
            //如已经事件阻止，则返回
          if (e.isDefaultPrevented()) return;
       	},
       	//初始化事件,提供给外部使用
       	initComplete:function(){            
       		var e = $.Event('datagrids.initcomplete');
            this.$element.trigger(e);
            //如已经事件阻止，则返回
            if (e.isDefaultPrevented()) return;
       	},
       	//DataTable初始化事件
       	loadinitComplete:function(){        
          //选择table外的表格DIV对象_wrapper
          var $wrapper=$('#'+this.id+'_wrapper'),that=this,$thatelement=$wrapper;
       		//表头美化[ipnut textarea select button]
       		$wrapper.find('th input,textarea,select,button').uniform();
          //设置表格的大小
          
          $wrapper.find('.dataTables_scrollHead table').each(function(){
                 $(this).css({'width':that.$element.attr('width')});
          });
          //调用初始化事件
         
       		//单行选择的和checkbox,表头的checkbox   设置为:disabled
       		if(this.options.singleselect===true&&this.options.checkbox){
                 $thatelement.find('thead th input[type=checkbox]').each(function(){         				
                        $(this).attr('disabled',true);
                 });
                 return;
            }
           	//多行选择
           	if(this.options.checkbox){
           		 $thatelement.find('thead th input[type=checkbox]').click(function(e){
	                 var selectedCbx=$thatelement.find('tbody tr input[type=checkbox]:checked'),
	                 	 allCbx=$thatelement.find('tbody tr input[type=checkbox]'),
	                 	 $thcheckbox=$(this);
	                
	                 if(!$thcheckbox.attr('checked')&&selectedCbx.size()>0&&selectedCbx.size()==allCbx.size()){
	                     
	                      $thatelement.find('tbody tr').each(function(){
	                        var $tr=$(this),$checkbox=$tr.find('input[type=checkbox]'); 
	                        $checkbox.removeAttr('checked');
	                        $checkbox.parent('span').removeClass('checked');
	                     });
	                 }else{
	                     $thatelement.find('tbody tr').each(function(){
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
        //检查选中状态
        checkselected:function(){
             var $thatelement=this.$element,
                  tbodytrsize=$thatelement.find('tbody tr').length,
                  selectedsize=$thatelement.find('tbody tr input[type=checkbox]:checked').length;
             if(selectedsize===tbodytrsize){
                $thatelement.find('thead th input[type=checkbox]').each(function(){                
                    var $box=$(this); 
                    $box.attr("checked",true);
                    $box.parent('span').addClass('checked');
                });
            }
        },
        //让所有checkboxdis
        checkboxdisabled:function(){
            var $thatelement=this.$element;
            $thatelement.find('input[type=checkbox]').each(function(){
                 $(this).attr('disabled',true);
            });
        },
       	//重新加载数据
       	reload:function(){
       		var odatatable=this.$element.dataTable();
       		odatatable.fnDraw(this.settings());
       		
       		if(!this.options.singleselect){
	       		this.$element.find('thead th input[type=checkbox]:checked').each(function(){
	       			$(this).removeAttr('checked');
	                $(this).parent('span').removeClass('checked');
	       		});
       		}
          var e = $.Event('datagrids.reload');
          this.$element.trigger(e);
            //如已经事件阻止，则返回
          if (e.isDefaultPrevented()) return;
       	},
        //创建行回调函数
        createdRow:function(row, data, index){
           var e = $.Event('datagrids.createdrow');
           this.$element.trigger(e,[row,data,index]);
            //如已经事件阻止，则返回
           if (e.isDefaultPrevented()) return;
        },
//        addNewRow:function(data){
//           var odatatable=this.$element.DataTable(); 
//           odatatable.row.add(data).draw( false );
//        },
      //逻辑删除 add by Jovi
        deleteRow:function(){
        	this.$element.find('.selected').remove();
        },
        //逻辑添加 add by Jovi
        addRow:function(row){
        	var that=this,
            $thatelement=that.$element,
            $wrapper=$('#'+this.id+'_wrapper'),
            tbodytr=$thatelement.find('tbody tr'),
            tbodytrsize=tbodytr.length;
        	
        	//判断原来是否有数据
        	if(this.settings().aoData.size==undefined||this.settings().aoData.size==null){
        		$thatelement.find('tbody').empty();
        	}
        	
        	//选择table外的表格DIV对象_wrapper
        	this.settings().aoData.push(row);
        	
        	var html = '';
        	
        	
        	if(this.settings().aoData.size%2!=0){
        		html += '<tr role="row" class="odd">';
        	}else{
        		html += '<tr role="row" class="even">';
        	}
        	html += '<td><input type="checkbox" class="checkboxes" value="'+row.id+'" ></td>';
        	$.each(this.buildHeader(), function(key, val) {   
        	    if(val.field != 'id'){
        	    	for(var i in row){
        	    		if(i === val.field){
        	    			html += '<td>'+row[i]+'</td>';
        	    			break;
        	    		}
        	    	}
        	    	
        	    }
        	});   
        	html += '</tr>';
        	this.$element.append(html);
        	//表单美化
        	this.$element.find('tbody tr input,textarea,select,button').uniform();
        	that.drawCallback();
        },
        //加载列表
       	loaddata:function(url, data, fnCallback){
           //是否初始化立即加载数据 
           var param=this.params(data),that=this,$thatelement=this.$element,processing=$('#'+that.id+'_processing');
           if(!this.options.loading){              
              var vdata={'draw':param.requestId,'recordsFiltered':0,'recordsTotal':0,'total':0,'data':{}};
              this.options.loading=true;              
              fnCallback.call(this,vdata);
              return;
           }
          
           util.post(url,param,handleAjaxSuccess,handleAjaxError);
           
           //加载成功的函数
           function handleAjaxSuccess(data,arg){
        	   if(data.data.length==0&&param.page!=0){
	   	   	   		$('.pagination').find('li')[1].firstChild.click();
	   	   	   	}
           		fnCallback.call(this,data);
           }
           //加载失败的错误
   		     function handleAjaxError(xhr,textStatus, error) {
             console.dir(error);
             console.dir(textStatus);
             //$(that.osettings.aanFeatures.r).css('display','none');
              processing.css('display','none');
		        }
        },
        //请求参数构建
        params:function(sdata){
        	var param={}, that=this,
        		columns=[],orders=[],
        		column={},order={},
        		ordersKey='orders',
        		columnsKey='columns',
        		cname='',nameVal='',sortable='',sortableVal='',
        		sortCol='',sortColVal=-1,sortDir='',sortDirVal='';
        		$.each(sdata,function(n,value){
        			var paramVal='',paramKey='',dataProp='';
        			 $.each(value,function(key,item){
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
        			 	 }else if(key==='value'&&(util.isEmpty(dataProp))){
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
               //列名
               if(util.isNotEmpty(cname)&&util.isNotEmpty(nameVal)&&util.isNotEmpty(sortable)&&util.isNotEmpty(sortableVal)){
                   column[cname]=nameVal;
                   column[sortable]=sortableVal;
                   columns.push(column);                       
                   cname='';nameVal='';sortable='';sortableVal='';
                   column={};
               }
               //排序过滤
               if(util.isNotEmpty(sortCol)&&util.isNotEmpty(sortColVal)&&util.isNotEmpty(sortDir)&&util.isNotEmpty(sortDirVal)){
                   order[sortCol]=sortColVal;
                   order[sortDir]=sortDirVal;
                   orders.push(order);
                   sortCol='';sortColVal='';sortDir='';sortColVal='';
                   order={};
               }                     
        			 if(util.isNotEmpty(paramKey)){
        			 	     param[paramKey]=paramVal;
                     paramVal='';
        			 }
        		 });
             
             //单行排序的情况
             if(orders.length==1){
                 var tempOrder=orders[0],dir='order',colIndex=tempOrder.sortCol,columnName='';
                 sortCol='sort';
                 for(var i=0;i<columns.length;i++){
                      if(i===colIndex){
                          columnName=columns[i].column;
                          break;
                      }
                 }
                 param[sortCol]=columnName;
                 param[dir]=tempOrder.dir;
             }
             //添加查询参数  
             //console.dir(this.options.querydata);           
             $.each(this.options.querydata,function(key,item){
                  param[key]=item;
                  //console.dir(key+"  item:"+item);
             });              
             //console.dir(param);
        	   return param;
        }

	};
	
	
	function Plugin(option, event){
        //获取参数
        var args = arguments;
        //定义参数和事件，并赋值给并变量
        var _option = option;
        option= args[0];
        event = args[1]|{};
        [].shift.apply(args);
        // This fixes a bug in the js implementation on android 2.3 #715
        if (typeof option =='undefined') {
            option = _option;
        }
        var value;
        var chain = this.each(function () {
             var $this = $(this);
             if ($this.is('table')) {
                  var data = $this.data('datagrids'),
                  options = typeof option == 'object' && option;
                  if (!data) {
                    var config = $.extend({},defaults,$.fn.datagrids.defaults||{},$this.data(),options);
                    $this.data('datagrids', (data = new Datagrids(this, config, event)));  //此处调用
                  } else if (options) {
                    for (var i in options) {
                      if (options.hasOwnProperty(i)) {
                        data.options[i] = options[i];
                      }
                    }
                  }

                  if (typeof option == 'string') {
                    if (data[option] instanceof Function) {
                        value = data[option].apply(data, args);
                    } else {
                        value = data.options[option];
                    }
                  }
             }
        });

        if (typeof value !== 'undefined') {
            return value;
        } else {
           return chain;
        }
    }
 	  var old = $.fn.datagrids;
    $.fn.datagrids = Plugin;
    $.fn.datagrids.Constructor = Datagrids;

    $.fn.datagrids.noConflict = function () {
       $.fn.datagrids = old;
       return this;
    }; 
	 //加载datagrid组件
    $(function () {
      $('.lion-datagrids').each(function () {
           var $datagrids = $(this);
           Plugin.call($datagrids,$datagrids.data()); //把html5  data-数据传进去
      });
    });
 }).call(lion,jQuery);
