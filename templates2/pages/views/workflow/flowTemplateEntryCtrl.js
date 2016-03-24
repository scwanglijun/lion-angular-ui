/**
 * Created by ziv.hung on 16/1/6.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("flowTemplateEntryCtrl", ['$scope', '$window', 'dbImService', '$modal', 'dbUtils', FlowTemplateEntryCtrl]);

function FlowTemplateEntryCtrl($scope, $window, dbImService, $modal, dbUtils) {
    //设置项，由插件生成。
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 2
            },
            fields: [
                {
                    name: "roleCode",
                    label: "角色",
                    type: "text",
                    placeholder: "角色代码/名称",
                    labelCols: "2"
                }, {
                    name: "flowType",
                    label: "流程类型",
                    type: "select", dropDownItemType: "im", dropDownItem: "flowType", placeholder: "请选择业务审核流程类型", labelCols: "3"
                }
            ]
        },
        grid: {
            settings: {
                transCode: "flowTemplatePage",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {name: "业务类型", width: "10", field: "flowType_name"},
                {name: "流程名称", width: "10", field: "stepName"},
                {name: "顺序", width: "3%", field: "stepOrder"},
                {name: "流程编码", width: "12%", field: "stepNo"},
                {name: "角色名称", width: "15%", field: "roleName"},
                {name: "服务名", width: "15%", field: "serviceName"},
                {name: "方法名", width: "15%", field: "methodName"},
                {name: "下步流程编码", width: "12%", field: "nextStepNo"},
                {name: "是否结束", width: "8%", field: "stepEnd_"},
                {name: "流程描述", width: "12%", field: "desc"}
            ],
            rowOperation: {show: false, width: "25%"}
        }
    };
    //!!formGridOptions-END!!


    var formGridEvents = {
        grid: {
            fieldEvents: {
                "stepEnd_Format": function (value, row) {
                    if (row['stepEnd']) {
                        return '是';
                    }
                    return '否';
                },
                'stepNameClick': function (row) {
                    openModal(row);
                }
            },
            operationEvents: [
                {
                    "name": "删除", "class": "btn-danger", "icon": "shanchu",
                    click: function (rows) {
                        remove(rows);
                    }
                },
                {
                    name: "新增", class: "btn-primary", icon: "luru",
                    click: function () {
                        openModal();
                    }
                }
            ]
        }
    };
    //加载字典数据
    var gridLoadedFn = function (rows) {
        angular.forEach(rows, function (row) {
            //业务审核类型
            dbImService.queryImCode(null, 'flowType', function (dicts) {
                angular.forEach(dicts, function (dict) {
                    if (dict.value == row['flowType']) {
                        row['flowType_name'] = dict.name;
                    }
                })
            });
        });
    };
    //构建dbFromGrid
    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents, gridLoaded: gridLoadedFn};


    //删除
    function remove(rows) {
        if (rows.length === 0) {
            return;
        }
        dbUtils.post("flowTemplateRemove", {'dataVo': rows}, function () {
            dbUtils.success("审批流程批量删除成功!");
            $scope.dbFormGrid.reLoadData();
        });
    }


    //弹出对话框
    function openModal(flowTemplate) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/workflow/flowTemplateEditorView.html',
            controller: 'flowTemplateEditorCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                flowTemplate: function () {
                    return flowTemplate;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });

    }
}