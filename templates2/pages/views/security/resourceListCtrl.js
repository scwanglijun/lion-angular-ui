/**
 * Created by ziv.hung.
 * 管理人员 CRUD
 * v1.0.0 15/10/15
 */
var DBApp = angular.module('DBApp');

DBApp.controller("resourceListCtrl", ['$scope', '$modal', 'dbUtils', ResourceListCtrl]);

function ResourceListCtrl($scope, $modal, dbUtils) {

    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "资源名称", "labelCols": "2", cols: 8}
            ]
        },
        grid: {
            settings: {
                transCode: "9200",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {"name": "资源类型", "width": "20%", "field": "type"},
                {"name": "资源名称", "width": "25%", "field": "resourceName"},
                {"name": "资源URL", "width": "20%", "field": "url"},
                {"name": "权限识别码", "width": "15%", "field": "permission"},
                {"name": "创建时间", "width": "20%", "field": "firstInsert"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    };
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "resourceNameClick": function (currentRecord) {
                    openModal(currentRecord);
                }
            },
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    removeResources();
                }
            }, {
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};
//操作按钮配置
    function removeResources() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.confirm("<span style='color: red'>⚠资源删除,同时会删除与角色之间的关系</span><br>确定要删除吗？", function () {
                dbUtils.post("9203", {"reqVos": selectRows}, function () {
                    dbUtils.success("资源数据批量删除成功");
                    $scope.dbFormGrid.reLoadData();
                }, function (error) {
                    dbUtils.error(error);
                });
            });
        });
    }

//弹出对话框
    function openModal(resource) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/security/resourceEditor.html',
            controller: 'resourceEditorCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                resource: function () {
                    return resource;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }

//创建按钮事件
    $scope.createDialog = function () {
        openModal();
    }
}