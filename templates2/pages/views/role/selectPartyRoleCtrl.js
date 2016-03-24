/**
 * Created by ziv.hung on 16/1/27.
 */
var DBApp = angular.module('DBApp');

DBApp.controller('selectPartyRoleCtrl', ['$scope', '$modalInstance', SelectPartyRoleCtrl]);

function SelectPartyRoleCtrl($scope, $modalInstance) {

    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1,
                showClose: true
            },
            fields: [
                {name: "keyWord", label: "关键字", type: "text", placeholder: "人员名称/代码", labelCols: "3", cols: 8}
            ],
            modalClose: function () {
                $modalInstance.dismiss("cancer");
            }
        },
        grid: {
            settings: {
                transCode: "partyRolePageBy",
                autoLoad: true,
                showCheckBox: false
            },
            header: [
                {name: "人员代码", width: "10%", field: "partyNo"},
                {name: "人员名称", width: "10%", field: "partyName"},
                {name: "机构名称", width: "10%", field: "organizationName"},
                {name: "部门名称", width: "10%", field: "departmentName"},
                {name: "业务类型", width: "10%", field: "businessType"}
            ],
            rowOperation: {show: true, width: "10%"}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "auditStatusColor": function (value) {
                    var color = "red";
                    value == "审核失败" ? color : color = "green";
                    return color;
                },
                "statusColor": function (value) {
                    var color = "green";
                    if (value == "离职") {
                        color = "#B0B6C3"
                    } else if (value == "暂停") {
                        color = "red"
                    }
                    return color;
                }
            },
            rowEvents: [{
                name: "确定", class: "btn-primary", icon: "queding", click: function (row) {
                    makeSure(row);
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    function makeSure(row) {
        $modalInstance.close(row);
    }
}