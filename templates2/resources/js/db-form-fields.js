/**
 * Created by ziv.hung on 16/1/18.
 * @yangkui  修改整个指令的功能范围,以及补充注释文档
 *
 */
'use strict';
/**
  1.功能说明
      1.1 用于渲染表单页面当中的表单字段,提供表单数据初始化\重置\获取修改后的表单数据功能.
      1.2 本指令不具备表单事件功能,但为dbForm提供了一些前提条件
 2.使用方式
    2.1 直接html页面上使用<div class="portlet-body"><db-form-fields></db-form-fields></div>
        2.1.1 要求包含该指令的元素需要定义一个form表单,且表单的name必须为dataForm,否则校验不起作用.
    2.2 结合dbForm功能,dbForm已经默认包含了该指令,具体使用方法参见dbForm指令
 3. js定义示例:

 //!!FORM--START!!
 $scope.dbForm = {
        settings: {cols: 3},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "机构"},
            fields: [
                     {name: "name", readonly:false,label: "", type: "text",  labelCols: "", editable:true , required: true, placeholder: ""},
                     {name: "", label: "", type: "password", labelCols: "", editable:true , required: true, placeholder: ""},
                     {name: "", label: "", type: "hide",     labelCols: "", editable:true , required: true, placeholder: ""},
                     {name: "", label: "", type: "select",   dropDownItemType: "", dropDownItem: "", labelCols: "", editable:true , required: true},
                     {name: "", label: "", type: "date",     labelCols: "", editable:true , required: true},
                     {label: "", type: "dateRange",labelCols: "", editable:true , required: true},
                     {name: "", label: "", type: "textarea", labelCols: "", editable:true , required: true, cols: "", "placeholder": ""}
                    ]
        }],
        originData:null
    };
 //!!FORM-END!!

 $scope.dbForm.events={
        "nameClick":function(fieldName,field){

        }
 }

 4. 字段说明
         字段名称        |    说明
    4.1 settings            --  整个指令的可设置项内容,如果是直接使用dbForm,则参见dbForm的settings定义
            cols            --  用来定义每行显示多少个field 每个field包含一个label和输入框(或下拉框)
    4.2 sections            --  用来定义整个表单当中有多少个区域,每个section都是一个独立的区域
            sectionTitle    --  用来定义每个子区域的标题\是否显示\对应的icon图标class名称
                show        是否显示
                icon        图标对应的class名字,从项目当中的icon-font查找
                label       标题名称
            fields          --  每个区域下的表单字段具体定义
                name        --  字段名称与后台数据结构保持一致命名
                label           字段名称显示的中文标签
                type            控件类型： text password hide select date dateRange textarea; dateRange(内置起止时间字段名称:startDate, endDate)
                dropDownItemType    下拉框数据来源,可选值:
                                        1.im        指定数据来源于系统字典数据
                                        2.json      指定数据来源于项目json文件定义
                dropDownItem        下拉框具体的数据来源约定关系,规则如下:
                                        1.当dropDownItemType为im时,该值为字典大类的名称
                                        1.当dropDownItemType为json时,该值为db-im-data.json文件里面的key值

                editable             指定当前字段是否允许编辑，如果为false则在表单为编辑状态的时候为依然为disabled状态
                required             是否必填
                placeholder          空白占位符提示内容
                labelCols           label占用宽度值，取值范围为[1-12],与bootstrap 网格布局保持一致
                readonly            控件是否为只读状态
                cols                当前元素占用整行的列数取值范围为[1-12],与bootstrap 网格布局保持一致
                showDelete          如果type为select时,可以设置是否显示下拉框清空按钮
    4.3 originData                  表单的原始数据对象,如果该值存在,则会自动进行初始化表单,对象的字段与整个fields保持一致
    4.4 events
            "字段的name"+"Click":function(fieldName,field){} 控件的点击事件
 5.接口API
    5.1
        //还原表单数据到最初始状态
        $scope.dbForm.resetFormData()
    5.2
        //获取表单当中所有下拉框类型的field
      (Array)  $scope.dbForm.getSelectFields() //返回表单当中所有下拉框类型的field
    5.3
        //设置表单初始值,便于表单渲染完成后再初始化表单数据使用
        $scope.dbForm.setOriginData(originData)
    5.4
        //为dbForm指令提供的事件.当点击编辑、取消按钮时恢复数据及更改相关字段的状态
        $scope.dbForm.changeEditStatus()
    5.5
        //当数据还原为原始状态时触发的回调事件方法,传入的参数为原始数据
        $scope.dbForm.resetFormDataCallBack($scope.dbForm.originData);
    5.6
        //如果定义了该方法,则指令在加载完成后直接调用该方法,而不执行默认的日历控件初始化事件
        $scope.dbForm.datepickerInit()
    5.7
        //为表单对象设置值
        $scope.dbForm.setFormDataField(field,value);
    5.8
        //获取表单对象
        $scope.dbForm.getFormData()
    5.9
        //设置指定字段为指定值 接收对象为数组对象,field的定义参考上面的field结构定义
        var fields =[{
                name:"orgCode",
                label:"机构代码"
        }]

        $scope.dbForm.reSetFormField(fields);
    5.10
        //获取指定field的数据

        $scope.dbForm.getFieldData(fieldName);
 */





var dbFormDirectives = angular.module('db.components.form.fields', ['dbUtils']);
dbFormDirectives.directive('dbFormFields', ['$window', '$timeout', 'dbUtils', function ($window, $timeout, dbUtils) {
    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbFormFields.html",
        replace: true,
        controller: ['$scope', 'dbImService', function ($scope, dbImService) {
            if (angular.isUndefined($scope.dbForm.sections)) {
                return;
            }
            //计算每个占用的列数
            var fieldCols = 12 / $scope.dbForm.settings.cols;

            var selectFields = [];
            angular.forEach($scope.dbForm.sections, function (section) {
                angular.forEach(section.fields, function (field) {

                    if (angular.isUndefined(field.cols)) {
                        field.cols = fieldCols;
                    }
                    if (angular.isUndefined(field.labelCols)) {
                        field.labelCols = 5;
                    }
                    if (angular.isUndefined(field.editable)) {
                        field.editable = true;
                    }
                    if (!angular.isUndefined($scope.dbForm.events)) {
                        var clickEvent = $scope.dbForm.events[field.name + 'Click'];
                        if (clickEvent) {
                            field.click = clickEvent;
                            field.clickEvent = true;
                        }
                    }

                    if (!angular.isArray(field.dropDownItem) && field.dropDownItem && field.type === "select") {
                        field.dropDownItemValue = [];//单独定义一个字段,默认为空数组,防止select.js异常
                        if (field.dropDownItemType == "json") {
                            dbImService.queryByJSON(field.dropDownItem, function (dict) {
                                field.dropDownItemValue = dict;
                            });
                        } else if (field.dropDownItemType == "im") {
                            dbImService.queryImCode(null, field.dropDownItem, function (dict) {
                                field.dropDownItemValue = dict;
                            });
                        }
                        selectFields.push(field);
                    } else {
                        field.dropDownItemValue = field.dropDownItem;
                    }

                });
            });

            //还原下拉框
            function resetData(data) {
                angular.forEach(selectFields, function (field) {
                    if (!angular.isObject(data[field.name])) {
                        if (!angular.isArray(field.dropDownItem) && field.dropDownItem != "") {
                            if (field.dropDownItemType == "json") {
                                dbImService.bindSelectByJSON($scope, field.dropDownItem, data, field.name);
                            } else if (field.dropDownItemType == "im") {
                                dbImService.bindSelect($scope, field.dropDownItem, data, field.name);
                            }
                        } else if (angular.isArray(field.dropDownItem) && field.dropDownItem != "") {
                            angular.forEach(field.dropDownItem, function (dict) {
                                if (dict.value == data[field.name]) {
                                    data[field.name] = dict;
                                }
                            });
                        }
                    }
                });

                if (!angular.isUndefined($scope.dbForm.resetFormDataCallBack)) {
                    $scope.dbForm.resetFormDataCallBack($scope.dbForm.originData);
                }
            }

            function setOriginData() {
                if ($scope.dbForm.originData) {
                    $scope.dbForm.isEditView = true;
                    $scope.dbForm.globalFieldEditor = true;
                    $scope.dbForm.showEditBtn = true;
                    $scope.dbForm.copyData = angular.copy($scope.dbForm.originData);
                    $scope.dbForm.formData = angular.copy($scope.dbForm.originData);
                    resetData($scope.dbForm.formData);
                } else {
                    $scope.dbForm.isEditView = false;
                    $scope.dbForm.globalFieldEditor = false;
                    $scope.dbForm.showEditBtn = false;
                    $scope.dbForm.formData = {};
                }
            }

            //初始化表单数据
            setOriginData();


            //----------------
            //  对外提供的API接口
            //----------------

            /**
             *为dbForm指令提供的事件.当点击编辑、取消按钮时恢复数据及更改相关字段的状态
             */
            $scope.dbForm.changeEditStatus = function () {
                $scope.dbForm.globalFieldEditor = !$scope.dbForm.globalFieldEditor;
                if ($scope.dbForm.globalFieldEditor) {
                    $scope.dbForm.formData = angular.copy($scope.dbForm.copyData);
                }
                resetData($scope.dbForm.formData);

            };
            /**
             * 还原表单数据到最初始状态
             */
            $scope.dbForm.resetFormData = resetData;

            /**
             * 获取表单当中所有下拉框类型的field
             * @returns {Array} field 集合
             */
            $scope.dbForm.getSelectFields = function () {
                return selectFields;
            };
            /**
             * 设置表单初始值,便于表单渲染完成后再初始化表单数据使用
             * @param originData 表单原始数据
             */
            $scope.dbForm.setOriginData = function (originData) {
                $scope.dbForm.originData = originData;
                setOriginData();
            };

            /**
             * 为表单对象设置值
             * @param field 要设置的属性名称
             * @param value 值
             */
            $scope.dbForm.setFormDataField = function (field, value) {
                $scope.dbForm.formData[field] = value;
            };

            /**
             * 获取表单对象
             * @returns {*}
             */
            $scope.dbForm.getFormData = function () {
                return $scope.dbForm.formData;
            };

            /**
             * 获取表单指定字段数据
             */
            $scope.dbForm.getFieldData = function (field) {
                return $scope.dbForm.formData[field];
            };

            /**
             * 重新设置dbForm当中定义的fields值
             * @param newFields
             */
            $scope.dbForm.reSetFormField = function (newFields) {
                angular.forEach($scope.dbForm.sections, function (section) {
                    angular.forEach(section.fields, function (field) {
                        angular.forEach(newFields, function (newField) {
                            if (newField.name == field.name) {
                                angular.forEach(newField, function (value, key) {
                                    field[key] = value;
                                });
                            }
                        });
                    });
                });
            }
        }],
        link: function (scope, element, attrs) {
            console.log("linked dbform-fields");
            $timeout(
                function () {
                    //如果定义datepickerInit方法则不执行默认事件
                    if (scope.dbForm.datepickerInit) {
                        scope.dbForm.datepickerInit();
                    } else {
                        var $ = $window.jQuery;
                        if ($().datepicker) {
                            $('.date-picker').datepicker({
                                rtl: Metronic.isRTL(),
                                orientation: "left",
                                autoclose: true,
                                language: 'zh-CN'
                            });
                            $('.date-picker-join').datepicker({
                                rtl: Metronic.isRTL(),
                                orientation: "left",
                                autoclose: true,
                                language: 'cn',
                                startDate: "-1y",
                                endDate: "+1y"
                            });
                            $('.date-picker-birth').datepicker({
                                rtl: Metronic.isRTL(),
                                orientation: "left",
                                autoclose: true,
                                language: 'cn',
                                startDate: "-65y",
                                endDate: "-18y"
                            });
                        }
                    }

                },
                100
            );
        }
    }
}]);