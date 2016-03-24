/**
 * Created by ziv.hung on 15/10/16.
 * 资源添加编辑界面
 */

var DBApp = angular.module('DBApp');

DBApp.controller("resourceEditorCtrl", ['$scope', 'dbUtils', 'dbImService', '$modalInstance', 'resource', ResourceEditorCtrl]);

function ResourceEditorCtrl($scope, dbUtils, dbImService, $modalInstance, resource) {

    if (angular.isUndefined(resource)) {
        $scope.data = {
            id: null,
            resourceCode: null,
            resourceName: null,
            url: null,
            permission: null,
            type: null
        };
    } else {
        $scope.formDisabled = true;
        $scope.editData = true;
        $scope.data = angular.copy(resource);
    }
    dbImService.bindSelectByJSON($scope, "resourceType", $scope.data, "type");
    //点击编辑、取消按钮
    $scope.changeEdit = function () {
        $scope.formDisabled = !$scope.formDisabled;
        if ($scope.formDisabled) {
            $scope.data = angular.copy(resource);
        }
    };

    $scope.submitDialogForm = function (isValid) {
        $scope.submited = true;
        if (isValid) {
            var url = $scope.data.url;
            var permission = $scope.data.permission;
            if (!url && !permission) {
                dbUtils.warning("资源URL,权限识别码不能同时为空！");
                return;
            }
            if (url && permission) {
                dbUtils.warning("资源URL,权限识别码二者择一！");
                return;
            }

            var reqBody = angular.copy($scope.data);
            reqBody["type"] = reqBody["type"].value;
            dbUtils.post("9201", reqBody, function (data) {
                if (data) {
                    dbUtils.warning("资源代码重复已存在!");
                    return;
                }
                dbUtils.success("资源数据更新成功!");
                $modalInstance.close();
            }, function (error) {
                dbUtils.error(error);
            });
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}