/**
 * Created by ziv.hung on 2016-01-06.
 * 人员管理控制层:人员录入
 * @since 1.0
 */
var DBApp = angular.module('DBApp');

DBApp.controller('partyRoleEntryCtrl', ['$scope', '$modal', 'dbUtils', PartyRoleEntryCtrl]);

function PartyRoleEntryCtrl($scope, $modal, dbUtils) {

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
                transCode: "partyRolePage",
                autoLoad: true,
                showCheckBox: false
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
            rowOperation: {show: false, width: "10%"}
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
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
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

    //弹出对话框
    function openModal(source) {
        if (source) {
            dbUtils.post("partyRoleGet", {id: source['id'], partyId: source['partyId'], businessType: source['businessType']}, function (data) {
                var instance = $modal.open({
                    animation: true,
                    templateUrl: 'views/roles.json/partyRoleEditorView.html',
                    controller: 'partyRoleEditorCtrl',
                    size: "lg",
                    backdrop: "static",
                    resolve: {
                        source: function () {
                            return data;
                        }
                    }
                });
                instance.result.then(function () {
                    $scope.dbFormGrid.reLoadData();
                });
            });
        } else {
            var instance = $modal.open({
                animation: true,
                templateUrl: 'views/roles.json/partyRoleEditorView.html',
                controller: 'partyRoleEditorCtrl',
                size: "lg",
                backdrop: "static",
                resolve: {
                    source: function () {
                        return source;
                    }
                }
            });
            instance.result.then(function () {
                $scope.dbFormGrid.reLoadData();
            });
        }

    }

    /**
     * 查看人员详细信息
     * @param currentRecord
     */
    function viewPartyRoleDetail(source) {

        dbUtils.post("partyRoleGet", {id: source['id'], partyId: source['partyId'], businessType: source['businessType']}, function (data) {
            var instance = $modal.open({
                animation: true,
                templateUrl: 'views/roles.json/partyRoleDetailView.html',
                controller: 'partyRoleDetailCtrl',
                size: "lg",
                backdrop: "static",
                resolve: {
                    source: function () {
                        data["infoUrl"] = "partyRoleInfo";
                        return data;
                    }
                }
            });
            instance.result.then(function () {
                $scope.dbFormGrid.reLoadData();
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
            templateUrl: 'views/roles.json/partyRoleNoAuditHistoryView.html',
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
}