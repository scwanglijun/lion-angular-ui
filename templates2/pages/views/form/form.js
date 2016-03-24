/**
 * Created by 阳葵 on 15/11/21.
 */
var DBApp = angular.module('DBApp');
DBApp.controller("formCtrl", ['$scope', '$modal', 'dbUtils', FormCtrl]);

function FormCtrl($scope, $modal, dbUtils) {
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 2
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "labelCols": "2", "placeholder": "选择类型/APP ID"},
                {"name": "businessType", "label": "配置类型", "type": "select", "dropDownItemType": "json", "dropDownItem": "businessType", "placeholder": "选择类型", "labelCols": "2"},
                {"label": "时间段", "type": "dateRange", "labelCols": "2"},
                {"name": "formDate", "label": "指定日期", "type": "date", "labelCols": "2"}
            ]
        },
        grid: {
            settings: {
                transCode: "5000",
                autoLoad: false,
                pageSize: 10,//可以省略不写
                showCheckBox: false
            },
            header: [
                {"name": "配置类型", "width": "10%", "field": "configType"},
                {"name": "appKey", "width": "10%", "field": "appKey"},
                {"name": "appId", "width": "10%", "field": "appId"},
                {"name": "appSecret", "width": "25%", "field": "appSecret"},
                {"name": "returnUrl", "width": "25%", "field": "returnUrl"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "appKeyColor": function (value, currentRecord) {
                    var color = "green";
                    value.indexOf("测试") > -1 ? color : color = "red";
                    return color;
                },
                "configTypeClick": function (currentRecord) {
                    openModal(currentRecord);
                }
            },
            rowOperations: [
                {
                    "name": "删除", "class": "btn-danger", "event": function (row) {
                    console.log(row);
                }
                },
                {
                    "name": "转移", "class": "btn-warning", "event": function (row) {
                    console.log(row);
                }
                }],
            operationEvents: [
                {
                    "name": "删除", "class": "btn-danger", icon: "shanchu", "event": function (row) {
                    console.log(row);
                }
                },
                {
                    "name": "转移", "class": "btn-warning", icon: "gengxin", "event": function (row) {
                    console.log(row);
                }
                }, {
                    name: "新增", class: "btn-primary", icon: "luru", click: function () {
                        openModal();
                    }
                }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};
    //弹出对话框
    function openModal(source) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: ['$scope', '$modalInstance', 'dbUtils', 'dbImService', 'source', function ($scope, $modalInstance, dbUtils, dbImService, source) {

                //!!FORM--START!!
                $scope.dbForm = {
                    settings: {showClose: true, transCode: "1001", cols: 2},// false 新增页面，true 修改页面
                    title: {icon: "luru", label: "DemoForm"},
                    sections: [{
                        sectionTitle: {show: true, icon: "jigou", label: "子title信息"},
                        fields: [
                            {"name": "businessType", "label": "配置类型", "type": "select", "dropDownItemType": "json", "dropDownItem": "businessType", "labelCols": "4", "editable": true, "required": true},
                            {"name": "appId", "label": "appId", "type": "text", "labelCols": "4", "editable": true, "dropDownItem": "", "format": "", "required": true, "placeholder": ""},
                            {"name": "appSecret", "label": "appSecret", "type": "text", "labelCols": "4", "editable": true, "dropDownItem": "", "format": "", "required": false, "placeholder": ""},
                            {"name": "appKey", "label": "appKey", "type": "text", "labelCols": "4", "editable": true, "dropDownItem": "", "format": "", "required": true, "placeholder": ""},
                            {"name": "returnUrl", "label": "returnUrl", "type": "text", "labelCols": "2", "editable": true, "required": false, "placeholder": "http://xxxx.com", "cols": "12"},
                            {"label": "时间段", "type": "dateRange", "labelCols": "2", "required": true, "editable": true, "cols": "12"},
                            {"name": "formDate", "label": "指定日期", "type": "date", "labelCols": "4", "required": true, "editable": true},
                            {"name": "textarea", "label": "备注", "type": "textarea", "labelCols": "2", "required": true, "editable": true, "cols": "12"}],
                        originData: source
                    }],
                    events: {
                        beforeSubmit: function (reqBody) {

                        },
                        afterSubmit: function (data) {
                            $modalInstance.close();
                        },
                        modalClose: function () {
                            $modalInstance.dismiss("cancel");
                        }
                    }
                    //!!FORM-END!!
                }
            }],
            size: "md",
            backdrop: "static",
            resolve: {
                source: function () {
                    return source;
                }
            }
        });
        instance.rendered.then(function () {
            console.log("rendered");
        });
        instance.result.then(function () {
            $scope.dbForm.reLoadData();
        }, function () {

        });
    }
}
