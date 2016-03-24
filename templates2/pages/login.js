/**
 * Created by ziv.hung on 16/1/11.
 */
var loginApp = angular.module('loginApp', []);
loginApp.controller("loginController", ['$scope', '$http', '$window', LoginController]);

function LoginController($scope, $http, $window) {
    $scope.data = {
        userName:'wanglijun',
        password: '123456',
        validCode: "1111"
    };
    //登录请求
    $scope.submitDbForm = function (isValid) {
        $scope.submited = true;

        var userName = $scope.data.userName;
        var password = $scope.data.password;
        var validCode = $scope.data.validCode;
        if (!userName || !password || !validCode) {
            alert("登录信息不全,检查后重试!");
            return;
        }
        if (isValid) {
            var reqBody = angular.copy($scope.data);
            $http.post("../login.do", reqBody).success(function (data) {
                var errorMsg = data["errorMsg"];
                if (errorMsg != "") {
                    $scope.resetVerifyCode();
                    alert(errorMsg);
                } else {
                    $window.sessionStorage.setItem("loginName", userName);
                    $window.location.href = "index.html";
                }
            }).error(function () {
                alert("系统异常！");
            });
        }
    };

    $scope.verifyCodeUrl = "../verfyCode.do";
    $scope.resetVerifyCode = function () {
        $scope.verifyCodeUrl = $scope.verifyCodeUrl + "?d" + new Date();
    }
}