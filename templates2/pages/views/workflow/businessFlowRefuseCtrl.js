/**
 * Created by wanglijun on 16/1/28.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("businessFlowRefuseCtrl", ['$scope','$modalInstance','dbUtils', 'flows', BusinessFlowRefuseCtrl]);

//显示数据
function BusinessFlowRefuseCtrl($scope,$modalInstance,dbUtils,flows){

    //设置默认值
    if (angular.isUndefined(flows)) {
        $scope.data = {
            auditDesc:null,

        };
        $scope.dataVo=flows;
    }
    //取消Modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //提交成功
    $scope.submitDialogForm = function (isValid) {
        $scope.submited = true;
        if (isValid) {
            var reqBody ={auditDesc:$scope.data.auditDesc,dataVo:flows};

            dbUtils.post('businessFlowRefuseFlow',reqBody, function (data) {
                dbUtils.success('审核拒绝成功!');
                $modalInstance.close();
            }, function (error) {
                dbUtils.error(error);
            });
        }
    };
}