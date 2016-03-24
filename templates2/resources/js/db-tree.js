/**
 * Created by kui.yang on 16/01/19.
 * dbTree 指令
 * 1.功能说明:
 *      用于显示一棵树.可以对这棵树进行选择和点击树上的节点
 * 2.使用方式:
 *      1. html使用 <db-tree></db-tree>占位
 * 3. js 定义示例
 *
 * $scope.dbTree = {
        settings: {}, //可以设置的值参考 DbTree 里面的options值
        data: [{
            text: "总公司",
            opened: true, //是否默认打开
            disabled: false, //是否允许点击,默认值为false,可以不设置
            selected: false,//是否默认勾选中,只有设置为useCheckBox为true的值才起作用
            treeId:1,        //树节点的唯一值
            attr:{},         //额外的属性
            children: [{ //子级菜单,子级菜单项字段与父级保持一致,可以嵌套子级菜单
                text: "上海分公司",
                children: [{
                    text: "浦东中支公司",
                    children: [{
                        text: "浦东中支公司",
                        children: []
                    }]
                }, {
                    text: "杨浦中支公司",
                    children: []
                }, {
                    text: "青浦中支公司",
                    children: []
                }, {
                    text: "黄埔中支公司",
                    children: []
                }]
            }]}
        ]
    }
 4. 字段说明:
 字段              | 默认值  |  说明
 4.1 settings                 可选值
 useCheckBox : false  : 是否在每个菜单项前显示复选框
 treeScrollHeight: "250px" 树结构高度,默认为250px
 data                        树的数据,数组类型
 [{
                text                菜单项名称
                opened              是否默认为展开的状态
                disabled   false    是否允许点击,默认值为false,可以不设置
                selected            是否默认勾选中,只有设置为useCheckBox为true的值才起作用
                children[{}]        子级菜单,子级菜单项字段与父级保持一致,可以再次嵌套子级菜单
                treeId               树中每个节点的唯一值
                attr                节点的其他属性
                canSelect           是否允许选择,为false时,点击后不会被选中
            }]

 5. 接口API
 //点击某一个菜单项是触发的事件,如果定义了这个事件则会在菜单点击时触发该事件,并传入相应的参数值
 //item:当前点击的菜单项对象
 //parent:当前点击的菜单父级菜单项,可能为null
 5.1 $scope.dbTree.itemClickEvent(item, parent);

 //重置data数据,便于ajax返回数据时刷新节点
 5.2 $scope.dbTree.setData

 //获取所有选中节点数据(数据打平,并无树结构)
 5.3 $scope.dbTree.getAllSelectedData

 *
 *
 */
'use strict';
var dbTreeDirectives = angular.module('db.components.tree', ['dbUtils']);
dbTreeDirectives.directive('dbTree', ['dbUtils', '$timeout', function (dbUtils, $timeout) {
    //dbTree默认参数,针对settings值
    var options = {
        useCheckBox: false,//是否显示复选框
        treeScrollHeight: "250px"//树结构窗口高度
    };

    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbTree.html",
        replace: true,
        controller: ['$scope', function ($scope) {
            if (angular.isUndefined($scope.dbTree)) {
                $scope.dbTree = {data: [], settings: {}};
            }
            //替换默认值
            $scope.dbTree.settings = angular.extend({}, options, $scope.dbTree.settings);

            angular.forEach($scope.dbTree, function (item) {
                item.children = item.children || [];
                item.opened = false;
            });

            //触发子级复选框
            function triggerChildSelected(item) {
                if (!item.children || item.children.length == 0) {
                    return;
                }
                angular.forEach(item.children, function (child) {
                    if (child.disabled) {
                        return;
                    }
                    child.selected = item.selected;
                    triggerChildSelected(child);
                });
            }

            //当前选中的Items值
            var selectedSingleItem = null;
            /**
             * 设定指定的item状态为选中状态,同时刷新树结构状态
             * @param item 需要设置的选中状态
             */
            $scope.dbTree.setItemSelected = function (item) {
                selectedSingleItem = item.attr;
                setItemSelected(item, $scope.dbTree.data[0]);
                $scope.dbTree.data[0].opened = true;//保持根节点永远为打开状态

            };

            function setNodeStatus(selectItem) {
                var treeArray = [];
                angular.forEach($scope.dbTree.data[0].children, function (child) {
                    if (angular.equals(selectItem.treeId, child.treeId)) {
                        return false;
                    } else {
                        findNode(child, selectItem);
                    }
                });

                function findNode(item, selectItem) {
                    var flag = false;
                    angular.forEach(item.children, function (child) {
                        if (angular.equals(selectItem.treeId, child.treeId)) {
                            flag = true;
                        } else {
                            var retval = findNode(child, selectItem);
                            if (!flag && retval) {
                                flag = true;
                            }
                        }
                    });
                    if (flag) {
                        treeArray.push(item);
                    }
                    return flag;
                }

                treeArray.push($scope.dbTree.data[0]);
                angular.forEach(treeArray, function (item) {
                    //点击的是子节点时,父节点的选择框要进行样式变化
                    var selectedCount = 0;
                    if (!item || !item.children) {
                        return;
                    }
                    angular.forEach(item.children, function (i) {
                        if (i.selected || i.undetermined) {
                            selectedCount++;
                        }
                    });
                    if (selectedCount > 0 && selectedCount == item.children.length) {
                        item.selected = true;
                        item.undetermined = false;
                    } else if (selectedCount > 0) {
                        item.undetermined = true;
                        item.selected = false;
                    } else {
                        item.selected = false;
                        item.undetermined = false;
                    }
                });

            }

            function setItemSelected(selectedItem, parent) {

                var flag = false;
                if ($scope.dbTree.settings.useCheckBox) {
                    selectedItem.undetermined = false;
                    if (selectedItem.canSelect) {
                        selectedItem.selected = !selectedItem.selected;
                    }
                    triggerChildSelected(selectedItem);
                    //设置节点的选中样式
                    setNodeStatus(selectedItem);

                } else {
                    if (!parent || !parent.children) {
                        return flag;
                    }
                    angular.forEach(parent.children, function (item) {
                        //对当前点击的节点进行展开和选中,其他为关闭和非选中
                        if (angular.equals(selectedItem.treeId, item.treeId)) {
                            item.selected = item.canSelect;
                            flag = true;
                            //节点展开
                            $scope.dbTree.expanded(item, parent);
                        } else {
                            item.selected = false;
                        }
                        //循环子级
                        if (item.children && item.children.length > 0) {
                            var itemSelect = setItemSelected(selectedItem, item);
                            flag = itemSelect;
                            if (itemSelect) {
                                //节点展开
                                $scope.dbTree.expanded(item, parent);
                                item.opened = true;
                            }
                        }
                    });

                }
                return flag;
            }

            //节点展开与关闭事件
            $scope.dbTree.expanded = function (item, parent) {
                item.opened = !item.opened;
                if (item.opened) {//叶子节点点击时不展开
                    item.opened = item.children.length != 0;
                }
                if (parent && parent.opened) {
                    if (item.opened) {
                        parent.opened = true;
                    }
                    //关闭同级其他节点
                    angular.forEach(parent.children, function (i) {
                        if (!angular.equals(item, i)) {
                            i.opened = false;
                        }
                    });
                }
            };

            //item点击事件
            $scope.dbTree.itemClick = function (item, parent) {
                if (item.disabled) {
                    return;
                }
                $scope.dbTree.setItemSelected(item);
                //如果存在item点击事件,则回调该事件
                if (!angular.isUndefined($scope.dbTree.itemClickEvent)) {
                    $scope.dbTree.itemClickEvent(item, parent);
                }
            };
            /**
             * 获取当前选中的值
             * @returns {*}
             */
            $scope.dbTree.getSelectedItem = function () {
                return selectedSingleItem;
            };
            //重置data数据,便于ajax返回数据时刷新节点
            $scope.dbTree.setData = function (data) {
                $scope.dbTreeData = data;
                $scope.dbTree.data = data;
            };
            /**
             * 获取dbTree所有被选中的数据
             * @returns {Array}
             */
            $scope.dbTree.getAllSelectedData = function () {
                var selectedData = [];
                getSelectedData($scope.dbTree.data[0], selectedData);
                return selectedData;
            };
            /**
             * 根据当前item判断是否别选中,若被选中push节点attr至选中数据集中. 在判断子节点是否存在被选中项,选中push.
             * @param parent 上级节点
             */
            function getSelectedData(item, selectedDataOut) {
                var itemSelected = item['selected'];
                if (itemSelected) {
                    selectedDataOut.push(item['attr']);
                }
                angular.forEach(item.children, function (subItem) {
                    getSelectedData(subItem, selectedDataOut);
                });
            }
        }],
        transclude: true,
        link: function (scope, element, attrs) {
            console.log("link dbtree");
            $timeout(
                function () {
                    var $ = window.jQuery;
                    $('.dbTreeScroll').slimScroll({
                        height: scope.dbTree.settings["treeScrollHeight"],
                        alwaysVisible: false
                    });
                },
                100
            );
        }
    }
}]);
