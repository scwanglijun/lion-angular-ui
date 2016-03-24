/** * Created by ziv.hung. * 机构录入 CRUD * v1.0.0 16/01/07 */var DBApp = angular.module('DBApp');
DBApp.controller("divisionEntryCtrl", ['$scope','dbUtils', function ($scope,dbUtils) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {transCode: "divisionCreate", cols: 3, showClose: false},
        title: {label: "行政机构"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "机构"},
            fields: [{
                name: "parentOrgNamePath",
                label: "上级机构",
                type: "orgTree",
                required: true,
                placeholder: "请选择上级机构",
                readonly:true
            }, {label: "生效日",name:"createDate", type: "date", required: true, placeholder: ""}, {name: "orgName", label: "机构名称", type: "text", required: true, placeholder: "机构名称"}, {
                name: "orgCode",
                label: "机构代码",
                type: "text",
                required: true,
                placeholder: "机构代码"
            }, {name: "orgLevel", label: "行政级别", type: "select", required: true,dropDownItemType:"json",dropDownItem:"orgLevel"},
                {name: "orgType", label: "机构类型", type: "select", required: true,dropDownItemType:"json",dropDownItem:"orgType"},
                {name: "conName", label: "联系人姓名", type: "text", required: false}, {
                name: "conPhone",
                label: "联系人电话",
                type: "text"
            }, {name: "principalName", label: "负责人姓名", type: "text", required: false}, {
                name: "fax",
                label: "传真",
                type: "text"
            }, {name: "postCode", label: "邮编", type: "text", required: false}, {
                name: "phone",
                label: "电话",
                type: "text"
            }, {name: "address", label: "地址", type: "text", required: false}, {
                name: "comment",
                label: "备注",
                type: "textarea",
                labelCols:2,
                cols:8
            }]
        }]
    };
//!!FORM-END!!

    //表单处理事件
    $scope.dbForm.events = {
        "afterSubmit":function(retval){
            dbUtils.success("添加成功","提示");
        }
    };
//页面日历控件初始化事件
    $scope.dbForm.datepickerInit = function () {
        var $ = window.jQuery;
        if ($().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true,
                language: 'zh-CN',
                endDate: "+0d"

            });
        }
    };
    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings:{noCache:true,showDepartment:false}};
    $scope.dbOrgTree.onOrgSelected = function(item){
        $scope.dbForm.setFormDataField("parentOrgNamePath",item.orgNamePath);
        $scope.dbForm.setFormDataField("parentOrgPath",item.orgPath);
        $scope.dbForm.setFormDataField("parentOrgId",item.orgId);
        $scope.dbForm.setFormDataField("parentOrgType",item.orgType);
    }

}]);