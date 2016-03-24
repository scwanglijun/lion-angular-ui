/**
 * Created by ziv.hung on 16/3/15.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("raisingPeriodDetailCtrl", ['$scope', '$modalInstance', 'source', RaisingPeriodDetailCtrl]);

function RaisingPeriodDetailCtrl($scope, $modalInstance, source) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, cols: 3},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "募集期次"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "产品信息"},
            fields: [
                {"name": "productName", "label": "产品名称", "type": "text", "labelCols": "4", "editable": true},
                {"name": "productCode", "label": "产品代码", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "publishOrgName", "label": "发行机构", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "productType", "label": "产品大类", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "productSubType", "label": "产品小类", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "riskAssessment", "label": "风险评级", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "amountLimits", "label": "计划投放额度(元)", "type": "text", "labelCols": "4", "disabled": true}
            ]
        }, {
            sectionTitle: {show: true, icon: "chanpinku", label: "募集期次基本信息"},
            fields: [
                {"name": "raisingProductName", "label": "募集期次", "type": "text", "labelCols": "4", "disabled": true},
                {"label": "计划募集期", "type": "dateRange", "labelCols": "4", "disabled": true},
                {"name": "raisingAmount", "label": "募集额度", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "startAmount", "label": "起投金额", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "increaseAmount", "label": "递增单位", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "termType", "label": "投资期限类型", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "term", "label": "投资期限", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "incomeType", "label": "收益率类型", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "incomeRate", "label": "年化收益率", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "earningMode", "label": "收益计算", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "allocationScheme", "label": "结算方式", "type": "text", "labelCols": "2", "disabled": true}
            ]
        }],
        originData: source
    };

    $scope.modalClose = function () {
        $modalInstance.dismiss("cancer");
    }
}