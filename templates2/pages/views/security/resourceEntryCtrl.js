/**
 * Created by ziv.hung on 16/2/19.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("resourceEntryCtrl", ['$scope', 'dbUtils', function ($scope, dbUtils) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {transCode: "resourceHandle", cols: 3, showClose: false},
        title: {label: "权限资源", icon: "fujiaxinxi"},
        sections: [{
            sectionTitle: {show: true, icon: "gengduo", label: "资源"},
            fields: [
                {name: "parentName", label: "上级资源", type: "resourceTree", required: true, placeholder: "请选择上级菜单资源", readonly: true},
                {name: "type", label: "资源类型", type: "select", dropDownItemType: "json", dropDownItem: "resourceType", required: true},
                {name: "isMenu", label: "是否菜单", type: "select", dropDownItemType: "json", dropDownItem: "yesOrNo", required: true},
                {name: "name", label: "资源名称", type: "text", required: true, placeholder: "资源中文名称"},
                {name: "permission", label: "资源", type: "text", required: true, placeholder: "菜单资源URL/权限识别码"},
                {name: "sortNo", label: "排序", type: "text", required: true, placeholder: "排序(纯数字有效)"}]
        }]
    };
    //!!FORM-END!!

    //表单处理事件
    $scope.dbForm.events = {
        "afterSubmit": function (retval) {
            dbUtils.success("添加成功", "提示");
        }
    };
    //机构树选择后的回调事件
    $scope.dbResourceTree = {settings: {noCache: true}};
    $scope.dbResourceTree.onResourceSelected = function (item) {
        $scope.dbForm.setFormDataField("parentName", item.name);
        $scope.dbForm.setFormDataField("parentCode", item.code);
    }

}]);