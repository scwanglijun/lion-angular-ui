/**
 * Created by kui.yang on 15/7/24.
 dbGrid 指令
 @version 1.1 
 @modify 1. keyword参数并入page对象当中。调用方式不便（放在params当中）
         2. 修改注释当中的内容
         3.增加单击某一行的事件回调，便于调用放监听事件 需要在$scope.dbGrid.operation.rowClick(row,selectedRows);
 */

'use strict';
var dbGridDirectives = angular.module('db.components.grid', ['dbUtils']);

/**
 * grid使用示例
 * 在controller当中定义一个对象
 * var grid = {};
  //定义要显示的表头
   grid.header = [{"name":"序号","width":"10%","field":"id",link:function(row){
        //点击改字段链接时所调用的方法。加了link就会自动增加链接样式和事件
   },format:function(value,row){
    //对当前一行的值进行格式化，默认给出当前列的值和整行的数据
    需要返回value
   },color:function(value,row){
    //返回颜色值
   }},
 {"name":"姓名","width":"10%","field":"name"},
 {"name":"性别","width":"10%","field":"sex"},
 {"name":"年纪","width":"10%","field":"grade"},
 {"name":"登记时间","width":"10%","field":"registerDate"}];
 //定义要提交查询的参数
 grid.query = {params:{"keyWord":""}};
 //操作按钮配置
 grid.operation={
        //单行数据操作
        single:{
            show:true,//是否显示
            width:"10%",//列所占的宽度
            //所需要显示的按钮
            list:[{name:"编辑",class:"",click:function(row){
                alert(row["name"]);
            }},{name:"删除",class:"btn-danger",click:function(row){
                alert(row["name"]);
            },isDisabled:function(row){
                    return true;
            }},{name:"查看",class:"btn-default",click:function(row){
                alert(row["name"]);
            }}],
            //双击行
            dbClick:function(row){

            }
        },
        //多行数据操作，有此参数才会出现复选框
        multiple:{
            allRowChecked:false,//标题栏全选复选框是否默认选中
            show:true,//是否显示
            width:"5%",//列所占的宽度
            //所需要显示的按钮
            list:[{name:"批量转移",class:"",click:function(rows){
                alert(rows.length);
            }},{name:"批量删除",class:"btn-danger",click:function(rows){
                alert(rows.length);
            }}]
        }
    };


 //将对象赋值给$scope.dbGrid
 $scope.dbGrid = grid;
 在页面上使用自定义标签进行占位
 <div class="from-body">
 <db-grid></db-grid> //占位标签
 </div>

 *
 */
dbGridDirectives.directive('dbGrid',['$http','dbUtils',function ($http,dbUtils) {
    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath()+"templates/dbGrid.html",
        replace: true,
        controller: ['$scope',function ($scope) {
            var autoLoad = $scope.dbGrid.query.autoLoad;
            if(angular.isUndefined($scope.dbGrid.query.autoLoad)){
                autoLoad = true;
            }

            $scope.dbGrid.rows = [];
                $scope.dbGrid.page = {
                pageNumber: 1,
                pageSize: 10,
                prevPageDisabled:'disabled',
                nextPageDisabled:'disabled'
            };
            //ajax异步获取数据
            function queryData() {
                var object=$scope.dbGrid.query.params;
                    angular.extend($scope.dbGrid.page,$scope.dbGrid.query.page);
                    object["page"]={pageNumber:$scope.dbGrid.page.pageNumber,pageSize:$scope.dbGrid.page.pageSize,
                        keyWord:object["keyWord"]};
                $scope.dbGrid.loadingTip="正在查询,请稍候!";
                dbUtils.post($scope.dbGrid.query.transCode,object,function (data) {
                    //获取每行数据，并调用format方法进行处理，最后赋值给$scope.dbGrid.rows
                    var rows = data.content;
                    for (var i in rows) {
                        var row = rows[i];
                        for (var j in $scope.dbGrid.header) {
                            var header = $scope.dbGrid.header[j];
                            var value = (row[header.field] || "");
                            //格式化数据
                            if (header.format) {
                                value = header.format(value,row);
                            }
                            row[header.field] = value;
                        }
                        //添加一个是否选择的字段，默认值为false
                        row.checked = false;
                    }
                    $scope.dbGrid.rows = rows;
                    //分页数据处理
                    var pages = {};
                    pages.totalElements = data.totalElements;
                    pages.pageNumber = data.pageNumber;
                    pages.pageSize = data.pageSize;
                    pages.totalPages = data.totalPages;
                    var totalPage = pages.totalPages;
                    //分页算法，页面只显示固定数量的分页按钮。
                    var pageNumbers = [];
                    var startPage = 1;
                    var endPage = totalPage;
                    var pageStep = 2;//以当前页为基准，前后各显示的页数量
                    if(totalPage>=6){
                        startPage = pages.pageNumber;
                        if(startPage>=pageStep){
                            startPage -=pageStep;
                        }
                        if(startPage<=1){
                            startPage = 1;
                        }
                        endPage = (totalPage-pages.pageNumber)>=pageStep?pages.pageNumber+pageStep:totalPage;
                        if(endPage>totalPage){
                            endPage = totalPage;
                        }
                        if(startPage!=1){
                            pageNumbers.push({number: "1"});
                            if(startPage-1!=1){
                                pageNumbers.push({number: "...",disabled:"disabled"});
                            }
                        }
                    }
                    for (var i = startPage; i <= endPage; i++) {
                        if (i == pages.pageNumber) {
                            pageNumbers.push({number: i, active: "active"});
                        } else {
                            pageNumbers.push({number: i});
                        }
                    }
                    if(endPage!=totalPage){
                        if(endPage+1!=totalPage){
                            pageNumbers.push({number: "...",disabled:"disabled"});
                        }
                        pageNumbers.push({number: totalPage});
                    }
                    pages.pageNumbers = pageNumbers;
                    if (pages.pageNumber == 1||pages.totalPages==0) {
                        pages.prevPageDisabled = "disabled";
                    }
                    if (pages.pageNumber == totalPage||pages.totalPages==0) {
                        pages.nextPageDisabled = "disabled";
                    }
                    $scope.dbGrid.page = pages;
                    if(angular.isFunction( $scope.dbGrid.loaded)){
                        $scope.dbGrid.loaded( $scope.dbGrid.rows);
                    }
                    Metronic.stopPageLoading();
                    checkAllowSelect();
                    $scope.dbGrid.loadingTip="没有查询到数据!";
                },function(){
                    $scope.dbGrid.loadingTip="系统异常，请重试!";
                });
            }

            if (autoLoad){
                queryData();
            }

            //重新按原始条件加载数据 resetPage为true时，从第一页开始查询
            $scope.dbGridReLoadData = function(resetPage){
                resetPage = resetPage||false;
                if(!resetPage){
                    //分页参数恢复初始值
                    $scope.dbGrid.page.pageNumber = 1;
                }
                queryData();
            };
            //分页数量点击事件
            $scope.dbGridPageNumberClick = function (pageNumber) {
                var prevPage = $scope.dbGrid.page.prevPageDisabled;
                if (pageNumber === "prev" && prevPage && prevPage != "") {
                    return false;
                }
                var nextPage = $scope.dbGrid.page.nextPageDisabled;
                if (pageNumber === "next" && nextPage && nextPage != "") {
                    return false;
                }
                if (pageNumber == $scope.dbGrid.page.pageNumber) {
                    return false;
                }
                if(pageNumber==="..."){
                    return false;
                }
                if (pageNumber === "prev") {
                    $scope.dbGrid.page.pageNumber--;
                } else if (pageNumber === "next") {
                    $scope.dbGrid.page.pageNumber++;
                } else {
                    $scope.dbGrid.page.pageNumber = pageNumber;
                }
                queryData();
            };
            //批量按钮点击事件
            $scope.dbGridMultipleButtonClick = function (clickFun) {
                //获取所有已经选择的行数据传递给回调方法。
                var rows = getAllSelectRows();
                clickFun(rows,$scope.dbGrid.rows);
                checkAllowSelect();
            };
            //点击具体某一行事件
            $scope.dbGridRowClick = function (row) {
                row.checked = !row.checked;
                checkAllowSelect();
                //增加事件回调，便于调用放监听事件
                if(!angular.isUndefined($scope.dbGrid.operation)&&!angular.isUndefined($scope.dbGrid.operation.rowClick)){
                    var selectedRows = getAllSelectRows();
                    $scope.dbGrid.operation.rowClick(row,selectedRows);
                }
            };
            //点击全选复选框事件
            $scope.dbGridAllRowClick = function () {
                $scope.dbGrid.operation.multiple.allRowChecked = !$scope.dbGrid.operation.multiple.allRowChecked;
                angular.forEach($scope.dbGrid.rows, function (row) {
                    row.checked = $scope.dbGrid.operation.multiple.allRowChecked;
                });
                if(!angular.isUndefined($scope.dbGrid.customGetCheckRow)){
                    var allSelectRows = getAllSelectRows();
                    $scope.dbGrid.customGetCheckRow(allSelectRows);
                }
            };

            function checkAllowSelect(){
                if(!$scope.dbGrid.operation || !$scope.dbGrid.operation.multiple){
                    return;
                }
                //如果所有行数据为非选中状态，则全选按钮为非选中状态，反之一样
                var flag = true;
                if($scope.dbGrid.rows.length==0){
                    flag = false;
                }
                angular.forEach($scope.dbGrid.rows, function (row) {
                    if (!row.checked) {
                        flag = false;
                    }
                });
                $scope.dbGrid.operation.multiple.allRowChecked = flag;
            }

            //获取所有选中的行数据
            function getAllSelectRows() {
                var rows = [];
                angular.forEach($scope.dbGrid.rows, function (row) {
                    if (row.checked) {
                        rows.push(row);
                    }
                });
                return rows;
            }
            //
        }],
        link: function (scope, element, attrs) {
            console.log("linked dbGrid");
        }
    }
}]);