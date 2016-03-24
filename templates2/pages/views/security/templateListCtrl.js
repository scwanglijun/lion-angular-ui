/**
 * Created by ziv.hung.
 * 角色管理 CRUD
 * v1.0.0 15/11/2
 */
var DBApp = angular.module('DBApp');

DBApp.controller("roleListCtrl", ['$scope', '$modal', 'dbUtils', RoleListCtrl]);

function RoleListCtrl($scope, $modal, dbUtils) {

    //设置项，由插件生成。
    //!!conditionGrid-START!!
    var setting = {
        queryFormFields: [{
            "name": "keyWord",
            "label": "关键字",
            "type": "text",
            "placeholder": "人员名称/登陆名称/工号",
            "dropDownItem": "",
            "dropDownItemType": "",
            "labelCols": "2"
        }],
        gridHeader: [
            {"name": "工号", "width": "10%", "field": "employeeNo"},
            {"name": "姓名", "width": "10%", "field": "name"},
            {"name": "职务", "width": "10%", "field": "post_name"},
            {"name": "性别", "width": "10%", "field": "gender_name"},
            {"name": "出生日期", "width": "10%", "field": "birthDate"},
            {"name": "身份证号码", "width": "10%", "field": "idCard"},
            {"name": "联系方式", "width": "10%", "field": "mobile"},
            {"name": "民族", "width": "10%", "field": "nation"},
            {"name": "现居住地址", "width": "10%", "field": "currentAddress"},
            {"name": "入职时间", "width": "10%", "field": "joinDate"},
            {"name": "人员状态", "width": "10%", "field": "status_name"},
            {"name": "在职模式", "width": "10%", "field": "jobType_name"}
        ],
        "transCode": "9000",
        "autoLoad": true,
        "page": {"pageSize": 2}
    };
    //!!conditionGrid-END!!

    var conditionGrid = {
        "action": {
            "show": true,
            "label": "人员",
            "titleIcon": "user",
            "event": function () {
                openModal();
            }
        },
        "queryForm": {
            "cols": 2,
            "fields": setting["queryFormFields"]
        },
        "queryGrid": {
            "transCode": setting["transCode"],
            "autoLoad": setting["autoLoad"],
            "page": setting["page"],
            "gridHeader": setting["gridHeader"],
            "gridHeaderEvents": {},
            "operation": {
                "multiple": {
                    "show": true,
                    "events": [
                        {
                            "label": "删除", "class": "btn-danger", "event": function (rows) {
                            removeRoles(rows);
                        }
                        }]
                }
            }
        }
    };
    $scope.dbConditionGrid = conditionGrid;

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
            $scope.dbGridReLoadData();
        });
    }

    //批量删除角色资源
    function removeRoles(rows) {
        if (rows.length == 0) {
            return;
        }
        dbUtils.confirm("<span style='color: red'>⚠️️同时会删除与用户、资源之间的关系</span><br>确定要删除吗？", function () {
            dbUtils.post("9103", {"reqs": rows}, function () {
                dbUtils.tip("数据删除成功");
                $scope.dbGridReLoadData();
            });
        });
    }

    //角色授权资源
    function authorizeResource(role) {
        $modal.open({
            animation: true,
            templateUrl: 'views/security/authorizeResource.html',
            controller: 'authorizeResourceCtrl',
            size: "lg",
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