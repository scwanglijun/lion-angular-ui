/**
 * Created by ziv.hung on 16/1/6.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("departmentDisableCtrl", ['$scope', '$window','dbImService','dbUtils','$timeout', DepartmentDisableCtrl]);

function DepartmentDisableCtrl($scope,$window,dbImService,dbUtils,$timeout) {
    //设置不使用缓存和查询范围
    $scope.dbOrgTreeSearch = {settings: {noCache: true, showSearch: true, showDivision: false,showDepartment:true}};

    var formData = {
        orgNamePath:'',
        orgName: '',
        orgCode: '',
        conName: '',
        conPhone: '',
        principalName: '',
        fax: '',
        postCode: '',
        phone: '',
        address: '',
        comment: '',
        createDate: '',
        orgId: 0,
        orgLevel: '',
        orgType:'',
        deptType:'',
        deptLevel:'',
        chaType:'',
        areaType:'',
        direct:'',
    };
    $scope.dbTree = {settings: {treeScrollHeight: "429px"}};
    $scope.dbTree.itemClickEvent = function (item, parent) {
        if (item.orgId == 0) {//总公司不允许编辑
            return;
        }
        //机构不能编辑
        if(!item.canSelect){
            return;
        }
        var originData = angular.copy(formData);
        dbUtils.post("departmentGet", {id: item.orgId}, function (retval) {
            console.log(retval);
            originData = angular.extend({}, originData, item.attr,retval);
            $scope.dbForm.setOriginData(originData);

        });
    };

    //!!FORM--START!!
    $scope.dbForm = {
        settings: {transCode: "departmentHandle", cols: 3, showClose: false,isDetail: true},
        title: {label: "行政部门"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "行政部门"},
            fields: [{
                name: "orgNamePath",
                label: "上级机构",
                type: "orgTree",
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
                name: "orgCode",
                label: "部门代码",
                type: "text",
                required: true,
                placeholder: "部门代码"
            }, {
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
    //!!FORM-END!!

    //表单处理事件
    $scope.dbForm.events = {
        "afterSubmit": function (retval) {
            //refresh tree
            $scope.dbOrgTreeSearch.refreshTree();
            dbUtils.success("修改成功", "提示");
            // $scope.dbForm.setData(formData);
        }
    };

    //临时解决编辑按钮不出现的问题
    $timeout(function () {
        $scope.dbForm.setOriginData(formData);
    }, 500);
}