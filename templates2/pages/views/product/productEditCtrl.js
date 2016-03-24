/**
 * Created by ziv.hung on 16/3/15.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("productEditCtrl", ['$scope', '$modalInstance', 'dbUtils', 'source', ProductEditCtrl]);

function ProductEditCtrl($scope, $modalInstance, dbUtils, source) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, transCode: angular.isUndefined(source) ? "productHandle" : "productModify", cols: 2},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "产品"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "发布机构"},
            fields: [
                {"name": "publishOrgName", "label": "机构名称", "type": "orgTree", "labelCols": "3", "editable": true, "required": true, readonly: true, "placeholder": "点击选择发布机构"},
                {"name": "publishOrgCode", "label": "机构代码", "type": "text", "labelCols": "3", "disabled": true, "required": true, "placeholder": "发布机构代码"}]
        }, {
            sectionTitle: {show: true, icon: "chanpinku", label: "基本信息"},
            fields: [
                {"name": "productCode", "label": "产品代码", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "产品编码"},
                {"name": "productName", "label": "产品名称", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "产品名字"},
                {"name": "productType", "label": "产品大类", "type": "select", dropDownItemType: "json", dropDownItem: "productType", "labelCols": "3", "editable": true, "required": true},
                {"name": "productSubType", "label": "产品小类", "type": "select", dropDownItemType: "json", dropDownItem: "productSubType", "labelCols": "3", "editable": true, "required": true},
                {"name": "riskAssessment", "label": "风险评级", "type": "select", dropDownItemType: "json", dropDownItem: "riskAssessment", "labelCols": "3", "editable": true, "required": true},
                {"name": "amountLimits", "label": "投放额度", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "投放额度（单位:元）"}
            ]
        }],
        originData: source,
        events: {
            beforeSubmit: function (reqBody) {
            },
            afterSubmit: function (data) {
                if (data) {
                    dbUtils.error("产品信息处理失败,原因:" + data + "产品代码重复!");
                } else {
                    $modalInstance.close();
                }
            },
            modalClose: function () {
                $modalInstance.dismiss("cancel");
            }
        }
    };

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: true, showDepartment: false}};
    $scope.dbOrgTree = {
        onOrgSelected: function (org) {
            $scope.dbForm.setFormDataField("publishOrgId", org['orgId']);
            $scope.dbForm.setFormDataField("publishOrgCode", org['orgCode']);
            $scope.dbForm.setFormDataField("publishOrgName", org['orgName']);
        }
    };
    //!!FORM-END!!
}