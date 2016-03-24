/**
 * Created by ziv.hung on 16/3/18.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("selectProductCtrl", ['$scope', '$modalInstance', SelectProductCtrl]);

function SelectProductCtrl($scope, $modalInstance) {
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 2,
                showClose: true
            },
            fields: [
                {name: "publishOrgName", label: "发布机构", type: "orgTree", required: true, placeholder: "点击选择发布机构", readonly: true, labelCols: "4"},
                {name: "keyWord", label: "关键字", type: "text", placeholder: "产品代码/名称", labelCols: "4"}
            ]
        },
        grid: {
            settings: {
                transCode: "selectProductPage",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: false
            },
            header: [
                {name: "发行机构", width: "18%", field: "publishOrgName"},
                {name: "产品代码", width: "15%", field: "productCode"},
                {name: "产品名称", width: "18%", field: "productName"},
                {name: "产品分类", width: "15%", field: "productType_"},
                {name: "风险评级", width: "15%", field: "riskAssessment"},
                {name: "投放额度（元）", width: "15%", field: "amountLimits"}
            ],
            rowOperation: {show: true}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "productType_Format": function (value, row) {
                    return row['productType'] + "/" + row['productSubType'];
                },
                "auditStatusColor": function (value, currentRecord) {
                    var color = "red";
                    value == "不通过" ? color : color = "green";
                    return color;
                }
            },
            rowEvents: //行级事件
                [{
                    name: "选择", class: "btn-primary", click: function (row) {
                        choiceRow(row);
                    }
                }]
        },
        modalClose: function () {
            $modalInstance.dismiss("cancer");
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: true, showDepartment: false}};
    $scope.dbOrgTree.onOrgSelected = function (item) {
        $scope.dbFormGrid.setFormDataField("publishOrgName", item['orgName']);
        $scope.dbFormGrid.setFormDataField("publishOrgCode", item['orgCode']);
    };

    /**
     * 修改
     * @param row
     */
    function choiceRow(row) {
        $modalInstance.close(row);
    }

}