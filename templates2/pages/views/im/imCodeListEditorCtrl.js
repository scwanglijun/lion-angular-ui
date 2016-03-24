/**
 * Created by ziv.hung on 15/10/23.
 */

var DBApp = angular.module('DBApp');

DBApp.controller("imCodeListEditorCtrl", ['$scope', '$modalInstance', 'imCodeList', ImCodeListEditorCtrl]);

function ImCodeListEditorCtrl($scope, $modalInstance, imCodeList) {
    console.log(imCodeList);
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, transCode: "1021", cols: 1},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "字典数据项"},
        sections: [{
            sectionTitle: {show: true, icon: "shujuzidianguanli", label: "字典项信息"},
            fields: [
                {"name": "typeCode", "label": "字典大类", "type": "select", dropDownItemType: "im", dropDownItem: "global", "labelCols": "3", "editable": true, "required": true, "cols": "11"},
                {"name": "code", "label": "字典代码", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "数据字典项代码", "cols": "11"},
                {"name": "nameCn", "label": "中文名称", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "中文名称", "cols": "11"},
                {"name": "nameEn", "label": "英文名称", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "英文名称", "cols": "11"},
                {"name": "sortNo", "label": "排序", "type": "text", "labelCols": "3", "editable": true, "required": false, "placeholder": "字典项排序", "cols": "11"}]
        }],
        originData: imCodeList,
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
    //!!FORM--END!!
}