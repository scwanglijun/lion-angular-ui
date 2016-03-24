/**
* Created by wanglijun on 16/1/18.
*/
var DBApp = angular.module('DBApp');

DBApp.controller("departmentEditorCtrl", ['$scope', '$window','dbImService' ,'$modalInstance','dept', function($scope,$window,dbImService,$modalInstance,dept){
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {transCode: "departmentHandle", cols: 3, showClose: true},
        title: {label: "行政部门"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "行政部门"},
            fields: [{
                name: "parentOrgNamePath",
                label: "上级机构",
                type: "orgTree",
                required: true,
                placeholder: "请选择直属机构",
                readonly:true
            },{
                label:"部门类型",
                name:"deptType",
                type:'select',
                required: true,
                dropDownItemType:"json",
                dropDownItem:"deptType",
                placeholder: "请选择部门类型"
            }, {
                label:"部门级别",
                name:"deptLevel",
                type:'select',
                required: true,
                dropDownItemType:"json",
                dropDownItem:"deptLevel",
                placeholder: "请选择部门级别"
            }, {
                label:"渠道类型",
                name:"chaType",
                type:'select',
                required: true,
                dropDownItemType:"json",
                dropDownItem:"chaType",
                placeholder: "请选择渠道类型"
            }, {
                label:"地区类型",
                name:"areaType",
                type:'select',
                required: true,
                dropDownItemType:"json",
                dropDownItem:"areaType",
                placeholder: "请选择地区类型"
            },{name: "orgLevel", label: "行政级别", type: "select", required: true,dropDownItemType:"json",dropDownItem:"orgLevel"}, {
                name: "principalName",
                label: "部门主管",
                type: "text",
                required: true,
                placeholder: "部门主管"
            },{
                name: "orgName", label: "部门名称", type: "text", required: true, placeholder: "部门名称"
            },
                {name: "conName", label: "联系人姓名", type: "text", required: false}, {
                    name: "conPhone",
                    label: "联系人电话",
                    type: "text"
                },{name: "postCode", label: "邮编", type: "text", required: false}, {
                    name: "phone",
                    label: "电话",
                    type: "text"
                }, {name: "address", label: "地址", type: "text", required: false},
                {
                    name: "direct",
                    label: "是否直辖部门",
                    type: "checkbox",
                },
                {
                    name: "comment",
                    label: "备注",
                    type: "textarea",
                    labelCols:2,
                    cols:10
                }]
        }]
    };

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings:{noCache:true,showDepartment:false}};
    $scope.dbOrgTree.onOrgSelected = function(item){
        $scope.dbForm.setFormDataField("parentOrgNamePath",item.orgNamePath);
        $scope.dbForm.setFormDataField("parentOrgPath",item.orgPath);
        $scope.dbForm.setFormDataField("parentOrgId",item.orgId);
        $scope.dbForm.setFormDataField("parentOrgType",item.orgType);
    }

    //!!FORM-END!!
    //表单处理事件
    $scope.dbForm.events = {
        "parentDivisionClick": function (fieldName, field) {
           // console.log(fieldName);
        },
        "beforeSubmit":function(reqBody){
           // console.log(reqBody);
            // return false;
        },
        "afterSubmit":function(retval){
            dbUtils.success("添加成功","提示");
        },
        "modalClose":function(){
            $modalInstance.dismiss('cancel');
        }
    };
}]);