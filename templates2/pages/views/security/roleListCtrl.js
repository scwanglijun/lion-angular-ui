/**
 * Created by ziv.hung.
 * 角色管理 CRUD
 * v1.0.0 15/11/2
 */
var DBApp = angular.module('DBApp');

DBApp.controller("roleListCtrl", ['$scope', '$modal', 'dbUtils', RoleListCtrl]);

function RoleListCtrl($scope, $modal, dbUtils) {


    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "角色名称", "labelCols": "2", cols: 8}
            ]
        },
        grid: {
            settings: {
                transCode: "9100",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {"name": "角色代码", "width": "20%", "field": "code"},
                {"name": "角色名称", "width": "20%", "field": "name"},
                {"name": "备注", "width": "20%", "field": "remark"},
                {"name": "创建时间", "width": "20%", "field": "firstInsert"}
            ],
            rowOperation: {show: true, width: "20%"}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "nameClick": function (currentRecord) {
                    openModal(currentRecord);
                }
            },
            rowEvents: [
                {
                    "name": "资源授权", "class": "btn-warning", "click": function (row) {
                    authorizeResource(row);
                }
                },
                {
                    "name": "用户授权", "class": "btn-warning", "click": function (row) {
                    authorizeUser(row);
                }
                }],
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    removeRoles();
                }
            }, {
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};
    //弹出对话框，修改或新增角色
    function openModal(role) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/security/roleEditor.html',
            controller: 'roleEditorCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                role: function () {
                    return role;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }

    //批量删除角色资源
    function removeRoles() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length == 0) {
                return;
            }
            var codes = dbUtils.getFieldArray(selectRows, 'code');
            dbUtils.confirm("<span style='color: red'>⚠️️同时会删除与用户、资源之间的关系</span><br>确定要删除吗？", function () {
                dbUtils.post("9103", {"reqVos": codes}, function () {
                    dbUtils.success("角色批量删除成功!");
                    $scope.dbFormGrid.reLoadData();
                }, function (error) {
                    dbUtils.error(error);
                });
            });
        });
    }

    //角色授权资源
    function authorizeResource(role) {
        $modal.open({
            animation: true,
            templateUrl: 'views/security/authorizeResourceView.html',
            controller: 'authorizeResourceCtrl1',
            size: "md",
            backdrop: "static",
            resolve: {
                role: function () {
                    return role;
                }
            }
        });
    }

    //角色下用户管理
    function authorizeUser(role) {
        $modal.open({
            animation: true,
            templateUrl: 'views/security/authorizeUser.html',
            controller: 'authorizeUserCtrl',
            size: "lg",
            backdrop: "static",
            resolve: {
                role: function () {
                    return role;
                }
            }
        });
    }
}