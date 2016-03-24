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
                {name: "organizationName", label: "直属机构/部门", type: "orgTree", required: true, placeholder: "直属机构/部门", readonly: true, labelCols: "3"}
            ]
        },
        grid: {
            settings: {
                transCode: "partyRoleQuitPage",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: true
            },
            header: [
                {name: "人员代码", width: "10%", field: "partyNo"},
                {name: "人员名称", width: "10%", field: "partyName"},
                {name: "机构名称", width: "10%", field: "organizationName"},
                {name: "部门名称", width: "10%", field: "departmentName"},
                {name: "业务类型", width: "10%", field: "businessType"},
                {name: "证件类型", width: "10%", field: "certificateType"},
                {name: "证件号码", width: "10%", field: "certificateNo"},
                {name: "人员状态", width: "10%", field: "status"},
                {name: "审核状态", width: "8%", field: "auditStatus"},
                {name: "创建时间", width: "12%", field: "firstInsert"}
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
                    if (value == "离职") {
                        color = "#B0B6C3"
                    } else if (value == "暂停") {
                        color = "red"
                    }
                    return color;
                },
                "auditStatusClick": function (currentRecord) {
                    auditStatusHistory(currentRecord);
                },
                "partyNameClick": function (currentRecord) {
                    viewPartyRoleDetail(currentRecord);
                }
            },
            operationEvents: [{
                name: "离职", class: "btn-danger", icon: "lizhi", click: function () {
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
     * 离职操作
     */
    function quit() {
        var selectRows = $scope.dbFormGrid.getAllSelectRows();
        if (selectRows.length === 0) {
            return;
        }
        var ids = dbUtils.getFieldArray(selectRows, "id");
        dbUtils.confirm("确定要对所选人员进行<span style='color: red'>离职</span>操作?", function () {
            dbUtils.post('partyRoleQuit', {'ids': ids}, function (data) {
                if (data) {
                    dbUtils.error(data + "以上渠道维护人员不能离职，请先迁移其所辖的代理机构！")
                } else {
                    dbUtils.success("渠道维护人员离职成功！!");
                }
                $scope.dbFormGrid.reLoadData();
            }, function (error) {
                dbUtils.error("人员离职处理异常!" + error);
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
            templateUrl: 'views/role/partNoAuditHistoryView.html',
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
                templateUrl: 'views/role/partyRoleDetailView.html',
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