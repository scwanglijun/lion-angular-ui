/**
 * Created by ziv.hung on 16/3/15.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("productDetailCtrl", ['$scope', '$modalInstance', 'source', ProductDetailCtrl]);

function ProductDetailCtrl($scope, $modalInstance, source) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, cols: 3, isDetail: true},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "产品"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "发布机构"},
            fields: [
                {"name": "publishOrgName", "label": "机构名称", "type": "orgTree", "labelCols": "3"},
                {"name": "publishOrgCode", "label": "机构代码", "type": "text", "labelCols": "3"}]
        }, {
            sectionTitle: {show: true, icon: "chanpinku", label: "基本信息"},
            fields: [
                {"name": "productCode", "label": "产品代码", "type": "text", "labelCols": "3"},
                {"name": "productName", "label": "产品名称", "type": "text", "labelCols": "3"},
                {"name": "productType", "label": "产品大类", "type": "text", "labelCols": "3"},
                {"name": "productSubType", "label": "产品小类", "type": "text", "labelCols": "3"},
                {"name": "riskAssessment", "label": "风险评级", "type": "text", "labelCols": "3"},
                {"name": "amountLimits", "label": "投放额度", "type": "text", "labelCols": "3"}
            ]
        }],
        originData: source
    };
    //!!FORM-END!!

    var dbDataTable = {
        title: {icon: "dizhi", label: "产品募集期次"},
        tableHeaders: [
            {label: "产品期次", width: "10%", field: "raisingProductName", dataType: "text"},
            {label: "期次阶段", width: "10%", field: "periodStage", dataType: "text"},
            {label: "募集金额(元)", width: "10%", field: "raisingAmount", dataType: "text"},
            {label: "计划募集起期", width: "10%", field: "startDate", dataType: "text"},
            {label: "计划募集止期", width: "10%", field: "endDate", dataType: "text"},
            {label: "起投金额(元)", width: "10%", field: "startAmount", dataType: "text"},
            {label: "递增单位(元)", width: "10%", field: "increaseAmount", dataType: "text"},
            {label: "投资期限类型", width: "10%", field: "termType", dataType: "text"},
            {label: "投资期限", width: "10%", field: "term", dataType: "text"},
            {label: "收益率类型", width: "10%", field: "incomeType", dataType: "text"},
            {label: "年化收益率", width: "10%", field: "incomeRate", dataType: "text"},
            {label: "收益计算", width: "10%", field: "earningMode", dataType: "text"},
            {label: "结算方式", width: "10%", field: "allocationScheme", dataType: "text"}
        ],
        rows: source['raisingPeriods']
    }
    $scope.dbDataTable = dbDataTable;


    $scope.modalClose = function () {
        $modalInstance.dismiss("cancer");
    }
}