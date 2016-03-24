/**
 * Created by zivhung on 15/10/31.
 */

var DBApp = angular.module('DBApp');

DBApp.controller("changePwdCtrl", ['$scope', 'dbUtils', '$modalInstance', 'user', ChangePwdCtrl]);

function ChangePwdCtrl($scope, dbUtils, $modalInstance, user) {
    $scope.data = {
        id: null,
        employeeNo: null,
        password: null,
        checkPassword: null
    }

    $scope.data = angular.copy(user);
    console.log($scope.data);
    //监听 密码 和确认密码是否一致。
    angular.forEach(['data.password', 'data.checkPassword'], function (item) {
        $scope.$watch(item, function (newVal, oldVal) {
            if (newVal !== oldVal) {
                var password = $scope.data.password;
                var checkPassword = $scope.data.checkPassword;
                $scope.passwordMsg = "";
                if (password != checkPassword) {
                    $scope.passwordMsg = "两次密码不一致,请检查。";
                }
            }
        });
    });

    $scope.submitDialogForm = function (isValid) {
        $scope.submited = true;
        if (isValid) {
            var password = $scope.data.password;
            var checkPassword = $scope.data.checkPassword;
            if (password != checkPassword) {
                return;
            }
            var reqBody = angular.copy($scope.data);
            dbUtils.post("modifyPassword", reqBody, function (data) {
                console.log(data);
                if (data) {
                    dbUtils.warning(data);
                } else {
                    dbUtils.success("密码修改更新成功!");
                    $modalInstance.close();
                }
            }, function (error) {
                dbUtils.error(error);
            });
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}