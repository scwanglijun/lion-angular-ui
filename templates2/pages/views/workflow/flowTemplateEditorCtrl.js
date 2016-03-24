/**
 * Created by wanglijun on 16/1/18.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("flowTemplateEditorCtrl", ['$scope', '$modalInstance', 'dbImService', 'dbUtils', 'flowTemplate', FlowTemplateEditorCtrl]);

function FlowTemplateEditorCtrl($scope, $modalInstance, dbImService, dbUtils, flowTemplate) {

    dbImService.queryImCode(null, 'flowType', function (im) {
        $scope.flowType = im;
    });

    if (angular.isUndefined(flowTemplate)) {
        $scope.data = {
            stepName: null,
            flowType: [],
            roleCode: null,
            stepOrder: null,
            serviceName: null,
            methodName: null,
            desc: null,
            stepEnd: false,
            stepNo: null,
        };
        buildStepNo();
    } else {
        $scope.formDisabled = true;
        $scope.editData = true;
        $scope.data = angular.copy(flowTemplate);
        dbImService.bindSelect($scope, null, "flowType", $scope.data, "flowType");
    }
    //创建流程号
    function buildStepNo() {
        dbUtils.post('flowTemplateStepNo', {}, function (data) {
            $scope.data.stepNo = data.stepNo;
        });
    }

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
            var reqBody = angular.copy($scope.data);
            reqBody.flowType = $scope.data.flowType.value;
            dbUtils.post(angular.isUndefined(flowTemplate) ? 'flowTemplateHandle' : 'flowTemplateModify', reqBody, function (data) {
                dbUtils.success('审批流程数据更新成功!');
                $modalInstance.close();
            }, function (error) {
                dbUtils.error(error);
            });
        }
    };

    //取消数据
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}