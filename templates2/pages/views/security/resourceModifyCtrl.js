/**
 * Created by ziv.hung on 16/2/19.
 */

var DBApp = angular.module('DBApp');

DBApp.controller("resourceModifyCtrl", ['$scope', 'dbUtils', '$timeout', function ($scope, dbUtils, $timeout) {
    var formData = {
        code: '',
        parentNamePath: '',
        type: '',
        isMenu: '',
        permission: '',
        sortNo: null
    };
    //dbTree 初始化数据
    $scope.dbTree = {settings: {useCheckBox: false, treeScrollHeight: "350px", noCache: true}};

    doGetResourceTreeData();

    //form 初始化
    $scope.dbTree.itemClickEvent = function (item) {
        if (!item['parentCode']) {//资源管理不允许编辑
            return;
        }
        var originData = angular.copy(formData);
        dbUtils.post("resourceGet", {id: item['resourceId']}, function (data) {
            originData = angular.extend({}, originData, data);
            $scope.dbForm.setOriginData(originData);
        });
    };

    //!!FORM--START!!
    $scope.dbForm = {
        settings: {transCode: "resourceModify", cols: 3, showClose: false},
        title: {label: "权限资源", icon: "fujiaxinxi"},
        sections: [{
            sectionTitle: {show: true, icon: "gengduo", label: "资源"},
            fields: [
                {name: "parentName", label: "上级资源", type: "text", required: true, placeholder: "请选择上级菜单资源", disabled: true},
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
            doGetResourceTreeData();
            dbUtils.success("修改成功", "提示");
        }
    };

    //临时解决编辑按钮不出现的问题
    $timeout(function () {
        $scope.dbForm.setOriginData(formData);
    }, 500);

    function doGetResourceTreeData() {
        dbUtils.post("resourceList", {}, function (resourceData) {
            initDbResourceTree(resourceData);
        });
    }

    //初始化树形结构的数据
    function initDbResourceTree(resourceData) {
        //构造树结构
        //1.查找root
        var root = null;
        angular.forEach(resourceData, function (item) {
            if (angular.isUndefined(item['parentCode']) || !item['parentCode']) {
                root = {text: item['name'], parentCode: item['parentCode'], code: item['code'], attr: item, resourceId: item['id'], opened: true, iconClass: "icon-state-warning", treeId: item['code']};
                return false;
            }
        });
        if (!root) {
            console.log("db-org-tree root is null");
            return;
        }
        //2.递归循环所有节点,将节点加入到父节点当中
        function getChildren(parentCode) {
            var child = [];

            angular.forEach(resourceData, function (item) {
                if (item['parentCode'] == parentCode) {
                    var iconClass = item['isMenu'] == "是" ? 'icon-state-warning' : 'icon-state-success';
                    var o = {text: item['name'], parentCode: item['parentCode'], code: item['code'], attr: item, resourceId: item['id'], children: [], iconClass: iconClass, treeId: item['code'], canSelect: true};
                    child.push(o);
                }
            });
            angular.forEach(child, function (item) {
                item.children = getChildren(item['code']);
            });
            return child;
        }

        //生成树结构数据
        root.children = getChildren(root['code']);
        //渲染树结构
        if ($scope.dbTree) {
            $scope.dbTree.setData([root]);
        } else {
            $scope.dbTree = {
                data: [root]
            }
        }
    }

}]);