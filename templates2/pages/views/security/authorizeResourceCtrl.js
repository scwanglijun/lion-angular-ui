/**
 * Created by ziv.hung.
 * 授权资源 CRUD
 * v1.0.0 15/11/2
 */
var DBApp = angular.module('DBApp');

DBApp.controller("authorizeResourceCtrl1", ['$scope', 'dbUtils', 'role', '$modalInstance', AuthorizeResourceCtrl1]);

function AuthorizeResourceCtrl1($scope, dbUtils, role, $modalInstance) {
//dbTree 初始化数据
    $scope.dbTree = {settings: {useCheckBox: true, treeScrollHeight: "350px", noCache: true}};

    doGetResourceTreeData();

    function doGetResourceTreeData() {
        dbUtils.post("viewResource", {roleCode: role['code']}, function (resourceData) {
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
                root = {
                    text: item['resourceName'],
                    parentCode: item['parentCode'],
                    code: item['resourceCode'],
                    attr: item,
                    resourceId: item['resourceId'],
                    opened: true,
                    iconClass: "icon-state-warning",
                    treeId: item['resourceCode'],
                    canSelect: true,
                    selected: item['permissionBoolean']
                };
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
                    var o = {
                        text: item['resourceName'],
                        parentCode: item['parentCode'],
                        code: item['resourceCode'],
                        attr: item,
                        resourceId: item['resourceId'],
                        children: [],
                        iconClass: iconClass,
                        treeId: item['resourceCode'],
                        canSelect: true,
                        selected: item['permissionBoolean']
                    };
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

    $scope.closeModal = function () {
        var selectedItems = $scope.dbTree.getAllSelectedData();
        dbUtils.confirm("<span style='color: red' >确定要按照所勾选的资源进行授权?</span>", function () {
            dbUtils.post("authorizeResource", {"roleCode": role['code'], permissionVoList: selectedItems}, function () {
                dbUtils.success("授权资源成功");
                doGetResourceTreeData();
            }, function (error) {
                dbUtils.error(error);
            });
        })
        console.log(selectedItems);
    }

    $scope.modalClose = function () {
        $modalInstance.dismiss("cancer");
    }
}