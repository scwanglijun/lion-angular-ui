/**
 * Created by wanglijun on 16/1/26.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("businessFlowDetailsCtrl", ['$scope','$modalInstance','dbUtils','dbImService', 'businessFlow', BusinessFlowDetailsCtrl]);

//显示数据
function BusinessFlowDetailsCtrl($scope,$modalInstance,dbUtils,dbImService,businessFlow){

    //设置默认值
    if (angular.isUndefined(businessFlow)) {
        $scope.data = {
            auditDesc:null,

        };
    }
    //取消Modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    dbUtils.post('businessFlowDetails',businessFlow,function(data){
        $scope.flowitems=data;
        //显示名称
        showName();
    });

    function showName(){
        //显示字典
        angular.forEach($scope.flowitems,function(item){
            showFlowType(item);
        });
    }

    //显示业务类型
    var showFlowType=function(item){
        //业务审核类型
        dbImService.queryImCode(null, 'flowType', function (dicts) {
            angular.forEach(dicts, function (dict) {
                if (dict.value == item['flowType']) {
                   item['flowType'] = dict.name;
                }
            })
        });
        //审核状态
        dbImService.queryImCode(null,'flowStatus',function(dicts){
            angular.forEach(dicts,function(dict){
                if(dict.value==item['status']){
                    item['status_name']=dict.name;
                }
            });
        });
    };
    //
    $scope.showStatusColor=function(item){
        if(item.historyFlowId&&(item.status==1||item.status==2||item.status==0)){
            return 'success';
        }

        if(item.auditDesc==null&&item.status==1){
            return 'info';
        }
        if(item.status==4){
            return 'warning';
        }
        if(item.status==3){
            return 'danger';
        }
    }
}