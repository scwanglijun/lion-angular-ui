/**
 * Created by ziv.hung.
 * 管理人员 CRUD
 * v1.0.0 15/10/15
 */
var DBApp = angular.module('DBApp');

DBApp.controller("userListCtrl", ['$scope', '$modal', 'dbUtils', '$window', UserListCtrl]);

function UserListCtrl($scope, $modal, dbUtils, $window) {

    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "登陆用名/真实姓名/联系电话", "labelCols": "2", cols: 8}
            ]
        },
        grid: {
            settings: {
                transCode: "9000",
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
            rowOperation: {show: true, width: "10%"}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "loginNameClick": function (currentRecord) {
                    openModal(currentRecord);
                }
            },
            rowEvents: [{
                "name": "修改密码", "class": "btn-warning", "click": function (row) {
                    changePwd(row);
                }
            }],
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    remove();
                }
            }, {
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};
    /**
     * 批量删除
     * @param rows
     */
    function remove() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.confirm("确定要删除吗？", function () {
                dbUtils.post("9003", {"reqs": selectRows}, function () {
                    dbUtils.success("用户批量删除成功!", "用户删除");
                    $scope.dbFormGrid.reLoadData();
                }, function (error) {
                    dbUtils.error(error, "用户删除");
                });
            });
        });
    }

    /**
     * 新增修改用户信息
     * @param user
     */
    function openModal(user) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/security/userEditor.html',
            controller: 'userEditorCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                user: function () {
                    return user;
                }
            }
        });
        instance.rendered.then(function () {
            var $ = $window.jQuery;
            if ($().datepicker) {
                $('.date-picker').datepicker({
                    rtl: Metronic.isRTL(),
                    orientation: "left",
                    autoclose: true,
                    language: 'zh-CN',
                    startDate: "-1m",
                    endDate: "+1y"
                });
            }
            if ($().datepicker) {
                $('.date-picker-birth').datepicker({
                    rtl: Metronic.isRTL(),
                    orientation: "left",
                    autoclose: true,
                    language: 'zh-CN',
                    endDate: "-18y"
                });
            }
        });

        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }

    /**
     * 用户密码修改
     * @param user
     */
    function changePwd(user) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/security/changePwd.html',
            controller: 'changePwdCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                user: function () {
                    return user;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }
}