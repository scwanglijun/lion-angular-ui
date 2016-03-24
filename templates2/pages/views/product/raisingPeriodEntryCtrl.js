/**
 * Created by ziv.hung on 16/3/17.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("raisingPeriodEntryCtrl", ['$scope', '$modal', RaisingPeriodEntryCtrl]);

function RaisingPeriodEntryCtrl($scope, $modal) {
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 3
            },
            fields: [
                {name: "publishOrgName", label: "发布机构", type: "orgTree", required: true, placeholder: "点击选择发布机构", readonly: true, labelCols: "3"},
                {name: "keyWord", label: "关键字", type: "text", placeholder: "产品代码/名称/期次名称", labelCols: "3", cols: "6"}
            ]
        },
        grid: {
            settings: {
                transCode: "raisingPeriodPage",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: false
            },
            header: [
                {name: "产品名称", width: "8%", field: "productName"},
                {name: "募集期次", width: "8%", field: "raisingProductName"},
                {name: "期次阶段", width: "8%", field: "periodStage"},
                {name: "投放额度(元)", width: "8%", field: "raisingAmount"},
                {name: "计划募集起期", width: "8%", field: "startDate"},
                {name: "计划募集止期", width: "8%", field: "endDate"},
                {name: "起投金额(元)", width: "8%", field: "startAmount"},
                {name: "递增单位(元)", width: "8%", field: "increaseAmount"},
                {name: "投资期限类型", width: "8%", field: "termType"},
                {name: "投资期限", width: "8%", field: "term"},
                {name: "收益率类型", width: "8%", field: "incomeType"},
                {name: "年化收益率", width: "8%", field: "incomeRate"},
                {name: "收益计算", width: "8%", field: "earningMode"},
                {name: "结算方式", width: "8%", field: "allocationScheme"}
            ],
            rowOperation: {show: false}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            operationEvents: [{
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: true, showDepartment: false}};
    $scope.dbOrgTree.onOrgSelected = function (item) {
        $scope.dbFormGrid.setFormDataField("publishOrgName", item['orgName']);
        $scope.dbFormGrid.setFormDataField("publishOrgCode", item['orgCode']);
    };

    function openModal(source) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'db/db-form.html',
            controller: 'raisingPeriodEditCtrl',
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