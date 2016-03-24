/**
 * Created by ziv.hung on 16/2/19.
 */
'use strict';

var dbResourceTreeDirectives = angular.module('db.components.resourceTree', ['dbUtils']);

dbResourceTreeDirectives.dbResourceTreeCaches = {};//机构树数据缓存对象

dbResourceTreeDirectives.directive('dbResourceTree', ['dbUtils', function (dbUtils) {
    //dbResourceTree默认参数,针对settings值
    var options = {
        noCache: false,
        useCheckBox: false
    };

    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbResourceTree.html",
        replace: true,
        transclude: true,
        controller: ['$scope', '$modal', function ($scope, $modal) {

            if (angular.isUndefined($scope.dbResourceTree)) {
                $scope.dbResourceTree = {settings: {}};
            }

            //替换默认值
            $scope.dbResourceTree.settings = angular.extend({}, options, $scope.dbResourceTree.settings);

            var dbResourceTreeSettings = $scope.dbResourceTree.settings;
            //弹出资源树界面
            $scope.dbResourceTree.selectResource = function (fieldName) {
                var instance = $modal.open({
                    controller: ['$scope', '$modalInstance', 'field', resourceTreeCtrl],
                    templateUrl: 'dbResourceTreeModal_template.html',
                    size: "md",
                    backdrop: "static",
                    resolve: {
                        field: function () {
                            return {"name": fieldName};
                        }
                    }
                });

                instance.result.then(function (item) {
                    var fieldName = item.field.name;
                    //机构选择后回调调用方
                    if (!angular.isUndefined($scope.dbResourceTree.onResourceSelected)) {
                        if (item['isMenu'] === "否") {
                            return;
                        }
                        $scope.dbResourceTree.onResourceSelected(item, fieldName);

                    }
                });
            };
            //资源树弹出框的Controller
            function resourceTreeCtrl($scope, $modalInstance, field) {
                //默认设置显示搜索功能
                $scope.dbResourceTree = {settings: dbResourceTreeSettings};
                //获取树结构数据
                function doGetResourceTreeData() {
                    if ($scope.dbResourceTree.settings.noCache) {
                        dbUtils.post("resourceSelectList", {}, function (retval) {
                            $scope.dbResourceTree.resourceNamePaths = retval;
                            dbResourceTreeDirectives.dbResourceTreeCaches = retval;
                            initDbResourceTree();
                        });
                    } else {
                        $scope.dbResourceTree.resourceNamePaths = dbResourceTreeDirectives.dbResourceTreeCaches;
                        initDbResourceTree();
                    }
                }

                //初始化树形结构的数据
                function initDbResourceTree() {
                    //构造树结构
                    //1.查找root
                    var root = null;
                    angular.forEach($scope.dbResourceTree.resourceNamePaths, function (item) {
                        if (angular.isUndefined(item['parentCode']) || !item['parentCode']) {
                            root = {text: item['name'], code: item['code'], attr: item, opened: true, iconClass: "icon-state-warning", treeId: item['code'], isMenu: item['isMenu'], canSelect: true};
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

                        angular.forEach($scope.dbResourceTree.resourceNamePaths, function (item) {
                            if (item['parentCode'] == parentCode) {
                                var iconClass = item['isMenu'] == "是" ? 'icon-state-warning' : 'icon-state-success';
                                var o = {text: item['name'], code: item['code'], attr: item, children: [], iconClass: iconClass, treeId: item['code'], isMenu: item['isMenu']};
                                //当树是部门时,只有菜单数据数据可以选择
                                o.canSelect = item['isMenu'] === "是";
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

                //查询资源数据初始化Tree
                doGetResourceTreeData();
                //确定按钮事件
                $scope.closeModal = function () {
                    var selectedItem = $scope.dbTree.getSelectedItem();
                    if (!selectedItem) {
                        return;
                    }
                    selectedItem.field = field;
                    $modalInstance.close(selectedItem);
                };
                $scope.modalClose = function () {
                    $modalInstance.dismiss("cancel");
                };

            }
        }],
        link: function (scope, element, attrs) {
            console.log("link dbResourceTree")
        }
    }
}]);