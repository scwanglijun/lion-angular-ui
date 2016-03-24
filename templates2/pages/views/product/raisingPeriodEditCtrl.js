/**
 * Created by ziv.hung on 16/3/18.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("raisingPeriodEditCtrl", ['$scope', '$modal', '$modalInstance', 'dbUtils', 'source', RaisingPeriodEditCtrl]);

function RaisingPeriodEditCtrl($scope, $modal, $modalInstance, dbUtils, source) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, transCode: angular.isUndefined(source) ? "raisingPeriodHandle" : "raisingPeriodModify", cols: 3},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "募集期次"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "产品信息"},
            fields: [
                {"name": "productName", "label": "产品名称", "type": "text", "labelCols": "4", "editable": true, readonly: true, "required": true, "placeholder": "点击选择所辖机构定义的产品"},
                {"name": "productCode", "label": "产品代码", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "publishOrgName", "label": "发行机构", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "productType", "label": "产品大类", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "productSubType", "label": "产品小类", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "riskAssessment", "label": "风险评级", "type": "text", "labelCols": "4", "disabled": true},
                {"name": "amountLimits", "label": "计划投放额度(元)", "type": "text", "labelCols": "4", "disabled": true}/*,
                 {"name": "surplusAmount", "label": "募集剩余金额", "type": "text", "labelCols": "4", "disabled": true},
                 {"name": "raiseAmount", "label": "已募集金额", "type": "text", "labelCols": "4", "disabled": true}*/
            ]
        }, {
            sectionTitle: {show: true, icon: "chanpinku", label: "募集期次基本信息"},
            fields: [
                {"name": "raisingProductName", "label": "募集期次", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "募集期次名称"},
                {"label": "计划募集期", "type": "dateRange", "labelCols": "4", "editable": true, "required": true},
                {"name": "raisingAmount", "label": "募集额度", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "本期募集计划额度(数值,单位:元)"},
                {"name": "startAmount", "label": "起投金额", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "募集金额起投金额(数值,单位:元)"},
                {"name": "increaseAmount", "label": "递增单位", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "募集金额递增单位(数值,单位:元)"},
                {"name": "termType", "label": "投资期限类型", "type": "select", dropDownItemType: "json", dropDownItem: "termType", "labelCols": "4", "editable": true, "required": true},
                {"name": "term", "label": "投资期限", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "投资期限依赖其类型(数值)"},
                {"name": "incomeType", "label": "收益率类型", "type": "select", dropDownItemType: "json", dropDownItem: "incomeType", "labelCols": "4", "editable": true, "required": true},
                {"name": "incomeRate", "label": "年化收益率", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "年化收益率:(0.5%录入0.05)"},
                {"name": "earningMode", "label": "收益计算", "type": "select", dropDownItemType: "json", dropDownItem: "earningMode", "labelCols": "4", "editable": true, "required": true},
                {"name": "allocationScheme", "label": "结算方式", "type": "select", dropDownItemType: "json", dropDownItem: "allocationScheme", "labelCols": "2", "editable": true, "required": true, cols: "8"}
            ]
        }],
        originData: source,
        events: {
            beforeSubmit: function (reqBody) {
            },
            afterSubmit: function (data) {
                if (data === "exist") {
                    dbUtils.error("募集期次处理失败,募集期次已存在!");
                } else if (data === "amount") {
                    dbUtils.error("募集期次处理失败,募集额度设置超出有效募集额度!");
                } else {
                    $modalInstance.close();
                }
            },
            modalClose: function () {
                $modalInstance.dismiss("cancel");
            },
            "productNameClick": function (fieldName, field) {
                showSelectProduct();
            }
        }
    };

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: true}};
    $scope.dbOrgTree = {
        onOrgSelected: function (org) {
            $scope.dbForm.setFormDataField("publishOrgCode", org['orgCode']);
            $scope.dbForm.setFormDataField("publishOrgName", org['orgName']);
        }
    };
    //!!FORM-END!!
    function showSelectProduct() {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'db/db-form-grid.html',
            controller: 'selectProductCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                source: function () {
                    return source;
                }
            }
        });
        instance.result.then(function (data) {
            $scope.dbForm.setFormDataField('publishOrgName', data['publishOrgName']);
            $scope.dbForm.setFormDataField('productType', data['productType']);
            $scope.dbForm.setFormDataField('productSubType', data['productSubType']);
            $scope.dbForm.setFormDataField('productCode', data['productCode']);
            $scope.dbForm.setFormDataField('productName', data['productName']);
            $scope.dbForm.setFormDataField('riskAssessment', data['riskAssessment']);
            $scope.dbForm.setFormDataField('amountLimits', data['amountLimits']);
            $scope.dbForm.setFormDataField('surplusAmount', data['surplusAmount']);
            $scope.dbForm.setFormDataField('raiseAmount', data['raiseAmount']);
        });
    }
}