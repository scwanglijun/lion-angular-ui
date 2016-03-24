/**
 * Created by ziv.hung.
 * 授权用户 CRUD
 * v1.0.0 15/11/2
 */


var DBApp = angular.module('DBApp');

DBApp.controller("authorizeUserCtrl", ['$scope', '$modal', 'dbUtils', 'role', '$modalInstance', AuthorizeUserCtrl]);

function AuthorizeUserCtrl($scope, $modal, dbUtils, role, $modalInstance) {

    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1,
                showClose: true
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "登陆用名/真实姓名/联系电话", "labelCols": "2", cols: 8}
            ],
            modalClose: function () {
                $modalInstance.dismiss("cancer");
            },
            hiddenParams: {roleCode: role['code']}
        },
        grid: {
            settings: {
                transCode: "viewPermissionUser",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {"name": "登陆用名", "width": "10%", "field": "loginName"},
                {"name": "真实姓名", "width": "10%", "field": "name"},
                {"name": "联系电话", "width": "10%", "field": "mobile"},
                {"name": "电子邮件", "width": "20%", "field": "email"},
                {"name": "直属机构", "width": "20%", "field": "orgName"},
                {"name": "创建时间", "width": "12%", "field": "firstInsert"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    };
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            operationEvents: [{
                "name": "删除", "class": "btn-danger", icon: "shanchu", "click": function (rows) {
                    removeUser(rows);
                }
            }, {
                name: "授权用户", class: "btn-primary", icon: "authorization", click: function () {
                    showUsers();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    //修改密码弹出框
    function showUsers() {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/security/selectUser.html',
            controller: 'selectUserCtrl',
            size: "lg",
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

    //批量删除角色用户
    function removeUser(rows) {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.confirm("确定要删除吗？", function () {
                dbUtils.post("9113", {"roleCode": role['code'], "reqVos": selectRows}, function () {
                    dbUtils.success("授权用户批量删除成功");
                    $scope.dbFormGrid.reLoadData();
                }, function (error) {
                    dbUtils.error(error);
                });
            });
        });
    }


    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    }
}