/**
 * Created by ziv.hung.
 * 角色人员 CRUD
 * v1.0.0 15/11/2
 */

var DBApp = angular.module('DBApp');

DBApp.controller("roleEditorCtrl", ['$scope', 'role', 'dbUtils', '$modalInstance', RoleEditorCtrl]);

function RoleEditorCtrl($scope, role, dbUtils, $modalInstance) {

    if (angular.isUndefined(role)) {
        $scope.data = {
            code: null,
            name: null,
            remark: null
        };
    } else {
        $scope.formDisabled = true;
        $scope.editData = true;
        $scope.data = angular.copy(role);
    }
    //点击编辑、取消按钮
    $scope.changeEdit = function () {
        $scope.formDisabled = !$scope.formDisabled;
        if ($scope.formDisabled) {
            $scope.data = angular.copy(role);
        }
    };
    $scope.submitDialogForm = function (isValid) {
        $scope.submited = true;
        if (isValid) {
            var reqBody = angular.copy($scope.data);
            dbUtils.post(angular.isUndefined(role) ? "9101" : 'modifyRole', reqBody, function (data) {
                if (data) {
                    dbUtils.warning("数据更新失败!" + data);
                } else {
                    dbUtils.success("数据更新成功");
                    $modalInstance.close();
                }
            }, function (error) {
                dbUtils.error(error);
            });
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}