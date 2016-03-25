/**
 * Created by ziv.hung on 2016-01-18.
 * dbFormGrid 指令
 * @version 1.1
 1.功能说明
 实现一个带自定义条件查询功能的grid
 2.使用方式
 2.1 直接在html页面当中使用<db-form-grid></db-form-grid>
 3.js定义示例(这里将options与events分开定义,目的是为将来开发工具插件自动生成使用,请保留注释和变量名称):
 //设置项，由插件生成
 //!!formGridOptions-START!!
 var options = {
        form:{
            settings:{
                cols:2,
                showClose:false
            },
            fields:[
                {"name": "businessType", "label": "配置类型", "type": "select", "dropDownItemType": "json", "dropDownItem": "businessType", "labelWidth": "4", "editable": true, "required": true},
                 ],
            hiddenParams:{}
        },
        grid:{
            settings:{
                transCode:"",
                autoLoad:true,
                pageSize:10,
                showCheckBox:true,
                allRowChecked:false
            }
            header:[{"name": "大类代码", "width": "10%", "field": "code"}],
            rowOperation:{show:true,width:"10%"}

        }
 }
 //!!formGridOptions-END!!
 var events = {
        form:{
            modalClose:function(){//当showClose为true时有效

            }
        }
        grid:{
            fieldEvents:{
                "codeClick":function(row){
                    //code 字段点击事件
                },
                "codeFormat":function(value,row){
                    //code 字段数据格式化事件(grid渲染时会调用)
                },
                "codeColor":function(value,row){
                    //code 字段渲染时文字颜色
                }
            },
            rowEvents: //行级事件
                [{name:"编辑",class:"",click:function(row){
                    alert(row["name"]);
                }},{name:"删除",class:"btn-danger",click:function(row){
                    alert(row["name"]);
                },isDisabled:function(row){
                        return true;
                }},{name:"查看",class:"btn-default",click:function(row){
                    alert(row["name"]);
            }}],
            operationEvents:[{name:"删除",class:"",icon:"",click:function(rows){
                    var rows = $scope.dbFormGrid.getSelectedRows();
                    //TODO
                }},{name:"批量转义",class:"btn-danger",icon:"",click:function(rows){
                    alert(row["name"]);
                },isDisabled:function(row){
                        return true;
                }},{name:"新增",class:"btn-default",icon:"",click:function(rows){
                    alert(row["name"]);
            }}]
        }
 }

 $scope.dbFormGrid = {options:options,events:events}

 4.字段说明
 字段名称                |         说明
 options                         所有配置类型的值在此定义
 form                        查询表单相关的配置
 settings                表单全局设置项
 cols                表单内的元素每行个数,与db-form-fields指令当中的cols含义一致
 showClose           是否显示关闭图标,如果当前form-grid是在模态窗口当中显示时,可以设置此值为true.同时后面的events当中可以定义事件
 fields                  表单内需要显示的字段,具体字段的定义格式参见db-form-fields当中的fields定义格式
 hiddenParams            表单提交时,默认隐藏的参数,当页面上不需要显示但需要隐藏提交时,可以在此设置.格式为json格式
 grid                        grid相关配置
 settings                grid全局配置项
 transCode           grid数据查询交易代码
 autoLoad            grid是否自动加载
 pageSize        分页大小,默认值为10,可以不用设置
 showCheckBox        是否显示复选框,当需要进行多选时,可以设置该值为true
 allRowChecked       如果有复选框,默认全选复选框是否选中
 header                  grid header字段定义,多项
 {
   name :"姓名"             显示的名称
   width :"10%"            占用的宽度百分比
   field :"name"            查询结果返回值列表当中对应的字段名称
   }
 rowOperation            行级操作设置
 show                是否在最后一列显示"操作"列
 width               占用的宽度百分比

 events                          事件相关定义
 form                        表单事件定义
 modalClose:function(){}              当options.form.settings.showClose为true时,该事件会在用户点击关闭图标时被触发
 grid                         grid事件定义
 fieldEvents             grid每列元素的事件定义,为了解决插件自动生成的代码里面无法在定义字段的时候将事件一并定义,而在此单独定义事件
 事件定义的规则如下
 "字段名称"+"事件名称",如需要定义字段name的点击事件,则事件名称为:"nameClick":function(row)
 "字段名称"+"Click":function(row){} 字段的点击事件
 "字段名称"+"Format":function(value,row){return value} grid数据初始化时会调用该事件,value为当前字段的值,row为整行的值
 "字段名称"+"Color":function(value,row){return "red";} 字段显示什么颜色所调用的方法,需要return 具体的颜色值或名称.
 rowEvents                   行级事件,每一行数据最后一列的操作列当中显示的按钮对应的事件
 {
     name:"删除"                       按钮名称
     class:"btn-danger"               按钮样式
     click:function(row){}            按钮点击事件,传入的参数只是当前行的数据
     isDisabled:function(row){return false} 按钮是否禁用事件,需要返回true或者false
 }
 operationEvents           全局的grid操作按钮事件,显示在grid右上角
 {
    name:"删除"                       按钮名称
     class:"btn-danger"              按钮样式
     icon:""                         按钮前icon 来源 系统icon-font
     click:function(rows){}          按钮点击事件,传入的参数是所有勾选的数据,有可能为null
     isDisabled:function(row){return false} 按钮是否禁用事件,需要返回true或者false
 }

 5.对外提供的API
 5.1
 //grid数据加载完成后的事件
 $scope.dbFormGrid.gridLoaded(rows) rows为当前页所有数据
 5.2
 //重新以当前参数查询第一页数据
 $scope.dbFormGrid.reLoadData();
 5.3
 //当showClose为true时有效
 $scope.dbFormGrid.modalClose();

 5.3
 //提供获取所有被选中的数据
 $scope.dbFormGrid.getAllSelectRows();

 5.4
 //为表单对象设置值
 $scope.dbForm.setFormDataField(fieldName,value);

 */

'use strict';
var dbFormGridDirectives = angular.module('db.components.form.grid', ['dbUtils']);
dbFormGridDirectives.directive('dbFormGrid', ['dbUtils', function (dbUtils) {
    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbFormGrid.html",
        replace: true,
        require:'dbFormGrid',
        controller: ['$scope', 'dbImService', function ($scope, dbImService) {
            //queryForm

            if (angular.isUndefined($scope.dbFormGrid)) {
                return;
            }

            $scope.dbFormGrid.queryParams = $scope.dbFormGrid.options.form.hiddenParams || {};

            var selectFields = [];
            //计算每个占用的列数
            var fieldCols = 12 / $scope.dbFormGrid.options.form.settings.cols;
            angular.forEach($scope.dbFormGrid.options.form.fields, function (field) {
                if (angular.isUndefined(field.cols)) {
                    field.cols = fieldCols;
                }
                if (angular.isUndefined(field.labelCols)) {
                    field.labelCols = 4;
                }
                $scope.dbFormGrid.queryParams[field.name] = null;
                if (!angular.isArray(field.dropDownItem) && field.dropDownItem && field.type == "select") {
                    $scope.dbFormGrid.queryParams[field.name] = {"name": "", "value": null};
                    selectFields.push(field.name);
                    var codeValue = field.dropDownItem;
                    if (field.dropDownItemType == "json") {
                        dbImService.queryByJSON(codeValue, function (dictS) {
                            field.dropDownItemValue = dictS;
                        });
                    } else if (field.dropDownItemType == "im") {
                        dbImService.queryImCode(null, codeValue, function (dictS) {
                            field.dropDownItemValue = dictS;
                        });
                    }
                } else {
                    field.dropDownItemValue = field.dropDownItem;
                }
            });
            //定义grid数据集
            $scope.dbFormGrid.rows = [];
            //定义grid的Page对象
            $scope.dbFormGrid.page = {
                pageNumber: 1,
                pageSize: $scope.dbFormGrid.options.grid.settings.pageSize || 10,
                prevPageDisabled: 'disabled',
                nextPageDisabled: 'disabled'
            };

            //queryForm

            var autoLoad = $scope.dbFormGrid.options.grid.settings.autoLoad;
            autoLoad = angular.isUndefined(autoLoad) ? true : autoLoad;
            if (!autoLoad) {
                $scope.dbFormGrid.loadingTip = "大饼君，正在候驾中...";
            } else {
                queryData();
            }

            //ajax异步获取数据
            function queryData() {
                $scope.dbFormGrid.loadingTip = "大饼君，正在努力为您加载数据,请稍候...";
                var queryParams = angular.copy($scope.dbFormGrid.queryParams);
                angular.forEach(selectFields, function (selectField) {
                    queryParams[selectField] = $scope.dbFormGrid.queryParams[selectField].value;
                });
                queryParams["page"] = {
                    keyWord: $scope.dbFormGrid.queryParams.keyWord || "",
                    pageNumber: $scope.dbFormGrid.page.pageNumber,
                    pageSize: $scope.dbFormGrid.page.pageSize
                };
                dbUtils.post($scope.dbFormGrid.options.grid.settings.transCode, queryParams, function (data) {
                    //获取每行数据，并调用format方法进行处理，最后赋值给$scope.dbFormGrid.rows
                    var rows = data.content;
                    for (var i in rows) {
                        var row = rows[i];
                        for (var j in $scope.dbFormGrid.options.grid.header) {
                            var header = $scope.dbFormGrid.options.grid.header[j];
                            header.sortingClass = "sorting_both";
                            var value = (row[header.field] || "");
                            if (!angular.isUndefined($scope.dbFormGrid.events.grid.fieldEvents)) {
                                var colorEvent = $scope.dbFormGrid.events.grid.fieldEvents[header.field + 'Color'];
                                colorEvent ? header.colorEvent = colorEvent : null;

                                var clickEvent = $scope.dbFormGrid.events.grid.fieldEvents[header.field + 'Click'];
                                clickEvent ? header.clickEvent = clickEvent : null;

                                var formatEvent = $scope.dbFormGrid.events.grid.fieldEvents[header.field + 'Format'];
                                formatEvent ? header.formatEvent = formatEvent : null;
                            }
                            //格式化数据
                            if (header.formatEvent) {
                                value = header.formatEvent(value, row);
                            }
                            row[header.field] = value;
                        }
                        //添加一个是否选择的字段，默认值为false
                        row.checked = false;
                    }
                    $scope.dbFormGrid.rows = rows;
                    //分页数据处理
                    var pages = {};
                    pages.totalRecords = data.totalElements;
                    pages.pageNumber = data.pageNumber;
                    pages.pageSize = data.pageSize;
                    pages.totalPages = data.totalPages;
                    var totalPage = pages.totalPages;
                    //分页算法，页面只显示固定数量的分页按钮。
                    var pageNumbers = [];
                    var startPage = 1;
                    var endPage = totalPage;
                    var pageStep = 2;//以当前页为基准，前后各显示的页数量
                    if (totalPage >= 6) {
                        startPage = pages.pageNumber;
                        if (startPage >= pageStep) {
                            startPage -= pageStep;
                        }
                        if (startPage <= 1) {
                            startPage = 1;
                        }
                        endPage = (totalPage - pages.pageNumber) >= pageStep ? pages.pageNumber + pageStep : totalPage;
                        if (endPage > totalPage) {
                            endPage = totalPage;
                        }
                        if (startPage != 1) {
                            pageNumbers.push({number: "1"});
                            if (startPage - 1 != 1) {
                                pageNumbers.push({number: "...", disabled: "disabled"});
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
                    if (endPage != totalPage) {
                        if (endPage + 1 != totalPage) {
                            pageNumbers.push({number: "...", disabled: "disabled"});
                        }
                        pageNumbers.push({number: totalPage});
                    }
                    pages.pageNumbers = pageNumbers;
                    if (pages.pageNumber == 1 || pages.totalPages == 0) {
                        pages.prevPageDisabled = "disabled";
                    }
                    if (pages.pageNumber == totalPage || pages.totalPages == 0) {
                        pages.nextPageDisabled = "disabled";
                    }
                    $scope.dbFormGrid.page = pages;
                    if (angular.isFunction($scope.dbFormGrid.gridLoaded)) {
                        $scope.dbFormGrid.gridLoaded($scope.dbFormGrid.rows);
                    }
                    Metronic.stopPageLoading();
                    checkAllowSelect();
                    $scope.dbFormGrid.loadingTip = "大饼君已努力，但并无数据...";
                }, function () {
                    $scope.dbFormGrid.loadingTip = "大饼君貌似生病啦，请稍等，再重试...";
                });
            }

            $scope.dbFormGrid.reLoadData = function () {
                $scope.dbFormGrid.page.pageNumber = 1;
                queryData();
            };

            //分页数量点击事件
            $scope.dbFormGrid.pageNumberClick = function (pageNumber) {
                var prevPage = $scope.dbFormGrid.page.prevPageDisabled;
                if (pageNumber === "prev" && prevPage && prevPage != "") {
                    return false;
                }
                var nextPage = $scope.dbFormGrid.page.nextPageDisabled;
                if (pageNumber === "next" && nextPage && nextPage != "") {
                    return false;
                }
                if (pageNumber == $scope.dbFormGrid.page.pageNumber) {
                    return false;
                }
                if (pageNumber === "...") {
                    return false;
                }
                if (pageNumber === "prev") {
                    $scope.dbFormGrid.page.pageNumber--;
                } else if (pageNumber === "next") {
                    $scope.dbFormGrid.page.pageNumber++;
                } else {
                    $scope.dbFormGrid.page.pageNumber = pageNumber;
                }
                queryData();
            };
            //grid上方按钮点击事件
            $scope.dbFormGrid.operationButtonClick = function (clickFun) {
                //获取所有已经选择的行数据传递给回调方法。
                var rows = getAllSelectRows();
                clickFun(rows, $scope.dbFormGrid.rows);
                checkAllowSelect();
            };

            //每行点击事件
            $scope.dbFormGrid.rowClick = function (row) {
                row.checked = !row.checked;
                checkAllowSelect();
            };

            //点击全选复选框事件
            $scope.dbFormGrid.allRowClick = function () {
                $scope.dbFormGrid.options.grid.settings.allRowChecked = !$scope.dbFormGrid.options.grid.settings.allRowChecked;
                angular.forEach($scope.dbFormGrid.rows, function (row) {
                    row.checked = $scope.dbFormGrid.options.grid.settings.allRowChecked;
                });
            };

            function checkAllowSelect() {
                if (!$scope.dbFormGrid.options.grid.settings.showCheckBox) {
                    return;
                }
                //如果所有行数据为非选中状态，则全选按钮为非选中状态，反之一样
                var flag = true;
                if ($scope.dbFormGrid.rows.length == 0) {
                    flag = false;
                }
                angular.forEach($scope.dbFormGrid.rows, function (row) {
                    if (!row.checked) {
                        flag = false;
                    }
                });
                $scope.dbFormGrid.options.grid.settings.allRowChecked = flag;
            }

            //获取所有选中的行数据
            function getAllSelectRows() {
                var rows = [];
                angular.forEach($scope.dbFormGrid.rows, function (row) {
                    if (row.checked) {
                        rows.push(row);
                    }
                });
                return rows;
            }

            $scope.dbFormGrid.getAllSelectRows = function () {
                return getAllSelectRows();
            };

            /**
             * 为表单对象设置值
             * @param fieldName 要设置的属性名称
             * @param value 值
             */
            $scope.dbFormGrid.setFormDataField = function (fieldName, value) {
                $scope.dbFormGrid.queryParams[fieldName] = value;
            };
            $scope.dbFormGrid.sorting=function(header){
                angular.forEach($scope.dbFormGrid.options.grid.header, function (h) {
                    if(angular.equals(h.field,header.field)){
                        if(angular.isUndefined(header.sortingClass)){
                            h.sortingClass="sorting_asc";
                        }else if( h.sortingClass =="sorting_asc"){
                            h.sortingClass = "sorting_desc";
                        }else{
                            h.sortingClass = "sorting_asc";
                        }
                    }else{
                        h.sortingClass = "sorting_both";
                    }
                });
                // 执行排序功能
                if(header.sortingClass=="sorting_desc"){
                    $scope.dbFormGrid.rows = descSort($scope.dbFormGrid.rows,header.field);
                }else{
                    $scope.dbFormGrid.rows = ascSort($scope.dbFormGrid.rows,header.field);
                }

                function ascSort(json,key){
                    return json.sort(function(a, b) {
                        var x = a[key];
                        var y = b[key];
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                function descSort(json,key){
                    return json.sort(function(a, b) {
                        var x = a[key];
                        var y = b[key];
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }

            }

        }],
        link: function (scope, element, attrs,controller) {
            scope.sortingClass="sorting_both";

        }
    }
}]);