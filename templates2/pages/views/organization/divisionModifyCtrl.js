/**
 * @author yangkui
 * 行政机构修改
 */
var DBApp = angular.module('DBApp');

DBApp.controller("divisionModifyCtrl", ['$scope', 'dbUtils', '$timeout', function ($scope, dbUtils, $timeout) {
    //设置不使用缓存和查询范围
    $scope.dbOrgTreeSearch = {settings: {noCache: true, showSearch: true, showDivision: true}};

    var formData = {
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
        createDate: null,
        orgId: 0,
        orgLevel: null,
        orgType: null
    };
    $scope.dbTree = {settings: {treeScrollHeight: "400px"}};
    $scope.dbTree.itemClickEvent = function (item, parent) {
        if (item.orgId == 0) {//总公司不允许编辑
            return;
        }
        var originData = angular.copy(formData);
        dbUtils.post("divisionGet", {id: item.orgId}, function (retval) {
            originData = angular.extend({}, originData, item.attr, retval);
            $scope.dbForm.setOriginData(originData);
        });
    };

    //!!FORM--START!!
    $scope.dbForm = {
        settings: {transCode: "divisionModify", cols: 3, showClose: false},
        title: {label: "行政机构"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "机构"},
            fields: [
                {name: "orgNamePath", label: "机构路径", type: "text", readonly: true, editable: false},
                {label: "生效日", name: "createDate", type: "date", required: true},
                {name: "orgName", label: "机构名称", type: "text", required: true, placeholder: "机构名称"},
                {name: "orgCode", label: "机构代码", type: "text", required: true, editable: true},
                {name: "orgLevel", label: "行政级别", type: "select", required: true, dropDownItemType: "json", dropDownItem: "orgLevel"},
                {name: "orgType", label: "机构类型", type: "select", required: true, dropDownItemType: "json", dropDownItem: "orgType"},
                {name: "conName", label: "联系人姓名", type: "text", required: false},
                {name: "conPhone", label: "联系人电话", type: "text"},
                {name: "principalName", label: "负责人姓名", type: "text", required: false},
                {name: "fax", label: "传真", type: "text"},
                {name: "postCode", label: "邮编", type: "text", required: false},
                {name: "phone", label: "电话", type: "text"},
                {name: "address", label: "地址", type: "text", required: false},
                {name: "comment", label: "备注", type: "textarea", labelCols: 2, cols: 8}]
        }]
    };
    //!!FORM-END!!
    //表单处理事件
    $scope.dbForm.events = {
        "afterSubmit": function (retval) {
            //refresh tree
            $scope.dbOrgTreeSearch.refreshTree();
            dbUtils.success("修改成功", "提示");
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
    //临时解决编辑按钮不出现的问题
    $timeout(function () {
        $scope.dbForm.setOriginData(formData);
    }, 500);
}]);