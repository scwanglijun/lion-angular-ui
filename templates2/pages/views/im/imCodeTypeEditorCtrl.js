/**
 * Created by ziv.hung on 15/10/23.
 */

var DBApp = angular.module('DBApp');

DBApp.controller("imCodeTypeEditorCtrl", ['$scope', '$modalInstance', 'imCodeType', ImCodeTypeEditorCtrl]);

function ImCodeTypeEditorCtrl($scope, $modalInstance, imCodeType) {
    console.log(imCodeType);
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, transCode: angular.isUndefined(imCodeType) ? "1011" : 'imCodeTypeModify', cols: 1},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "字典数据"},
        sections: [{
            sectionTitle: {show: true, icon: "shujuzidianguanli", label: "字典信息"},
            fields: [
                {"name": "code", "label": "字典代码", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "数据字典大类代码", "cols": "11"},
                {"name": "typeCode", "label": "类型代码", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "类型代码", "cols": "11"},
                {"name": "nameCn", "label": "中文名称", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "中文名称", "cols": "11"},
                {"name": "nameEn", "label": "英文名称", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "英文名称", "cols": "11"},
                {"name": "comment", "label": "备注", "type": "textarea", "labelCols": "3", "editable": true, "required": false, "placeholder": "对数据字典进行简明扼要的描述", "cols": "11"}]
        }],
        originData: imCodeType,
        events: {
            beforeSubmit: function (reqBody) {

            },
            afterSubmit: function (data) {
                $modalInstance.close();
            },
            modalClose: function () {
                $modalInstance.dismiss("cancel");
            }
        }
    };
}