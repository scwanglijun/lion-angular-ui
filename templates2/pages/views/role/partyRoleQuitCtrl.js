/**
 * Created by ziv.hung on 16/1/6.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("partyRoleQuitCtrl", ['$scope', '$modal', 'dbUtils', PartyRoleQuitCtrl]);

function PartyRoleQuitCtrl($scope, $modal, dbUtils) {
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 2
            },
            fields: [
                {name: "organizationName", label: "角色名称", type: "text", required: true, placeholder: "角色名称", readonly: true, labelCols: "3"}
            ]
        },
        grid: {
            settings: {
                transCode: "../data/roles.json",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: true
            },
            header: [
                {name: "角色名称(英文)", width: "18%", field: "partyNo"},
                {name: "角色名称(中文)", width: "18%", field: "partyName"},
                {name: "描述", width: "18%", field: "organizationName"},
                {name: "可编辑", width: "10%", field: "departmentName"},
                {name: "创建时间", width: "18%", field: "businessType"},
                {name: "更新时间", width: "18%", field: "certificateType"},
            ],
            rowOperation: {show: false}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "auditStatusColor": function (value, currentRecord) {
                    var color = "red";
                    value == "审核失败" ? color : color = "green";
                    return color;
                },
                "statusColor": function (value, currentRecord) {
                    var color = "green";
                    if (value == "删除") {
                        color = "#B0B6C3"
                    } else if (value == "暂停") {
                        color = "red"
                    }
                    return color;
                }
            },
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    quit();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: true, showDepartment: true}};
    $scope.dbOrgTree.onOrgSelected = function (item) {
        $scope.dbFormGrid.setFormDataField("organizationName", item['orgNamePath']);
        $scope.dbFormGrid.setFormDataField("organizationId", item['orgId']);
        $scope.dbFormGrid.setFormDataField("departmentId", item['departId']);
    };


    /**
     * 删除操作
     */
    function quit() {
        var selectRows = $scope.dbFormGrid.getAllSelectRows();
        if (selectRows.length === 0) {
            return;
        }
        var ids = dbUtils.getFieldArray(selectRows, "id");
        dbUtils.confirm("确定要对所选人员进行<span style='color: red'>删除</span>操作?", function () {
            dbUtils.post('partyRoleQuit', {'ids': ids}, function (data) {
                if (data) {
                    dbUtils.error(data + "以上渠道维护人员不能删除，请先迁移其所辖的代理机构！")
                } else {
                    dbUtils.success("渠道维护人员删除成功！!");
                }
                $scope.dbFormGrid.reLoadData();
            }, function (error) {
                dbUtils.error("人员删除处理异常!" + error);
            });
        });
    }

    /**
     * 查看审核记录
     * @param currentRecord
     */
    function auditStatusHistory(currentRecord) {
        $modal.open({
            animation: true,
            templateUrl: 'views/roles/partNoAuditHistoryView.html',
            controller: 'partNoAuditHistoryCtrl',
            size: "lg",
            backdrop: "static",
            resolve: {
                source: function () {
                    return currentRecord;
                }
            }
        });
    }

    /**
     * 查看人员详细信息
     * @param currentRecord
     */
    function viewPartyRoleDetail(source) {

        dbUtils.post("partyRoleQuitGet", {id: source['id'], partyId: source['partyId'], businessType: source['businessType']}, function (data) {
            var instance = $modal.open({
                animation: true,
                templateUrl: 'views/roles.json/partyRoleDetailView.html',
                controller: 'partyRoleDetailCtrl',
                size: "lg",
                backdrop: "static",
                resolve: {
                    source: function () {
                        data["infoUrl"] = "partyRoleQuitInfo";
                        return data;
                    }
                }
            });
            instance.result.then(function () {
                $scope.dbFormGrid.reLoadData();
            });
        });
    }
}