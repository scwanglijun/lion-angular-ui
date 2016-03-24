/**
 * Created by ziv.hung on 16/1/6.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("departmentMigrationCtrl", ['$scope', '$window','dbImService' ,'$modal', DepartmentMigrationCtrl]);

function DepartmentMigrationCtrl($scope,$window,dbImService,$modal) {
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {cols: 2,transCode:"divisionMigration"},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "部门"},
            fields: [
                {name: "orgNamePath",label: "要迁移的部门", type: "orgTree", required: true, placeholder: "请选择要迁移的部门"},
                {name: "orgNamePath2",label: "迁入到的部门", type: "orgTree", required: true, placeholder: "请选择要迁入到的部门"}
            ]
        }]
    };
    //!!FORM-END!!

    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings:{showDepartment:true}};
    $scope.dbOrgTree.onOrgSelected = function(item,filedName){
        if("orgNamePath"==filedName){
            $scope.dbForm.setFormDataField("orgNamePath",item.orgNamePath);
            $scope.dbForm.setFormDataField("orgId",item.orgId);
            $scope.dbForm.setFormDataField("currentParentOrgId",item.parentOrgId);

        }else if("orgNamePath2"==filedName){
            $scope.dbForm.setFormDataField("orgNamePath2",item.orgNamePath);
            $scope.dbForm.setFormDataField("mirgrationOrgId",item.orgId);
        }
    };

    $scope.dbForm.submit = function (isValid) {
        $scope.dbForm.submited = true;
        if (isValid) {
            var reqBody = angular.copy($scope.dbForm.getFormData());
            var selectFields = $scope.dbForm.getSelectFields();
            angular.forEach(selectFields, function (field) {
                if (reqBody[field.name]) {
                    reqBody[field.name] = reqBody[field.name].value;
                }
            });
            if(reqBody["orgId"]==reqBody["mirgrationOrgId"]){
                dbUtils.error("要迁移的部门与被迁移到的部门不能为同一个机构","提交失败！");
                return false;
            }
            if(reqBody["currentParentOrgId"]==reqBody["mirgrationOrgId"]){
                dbUtils.error("当前部门已经在迁移到的部门下面！","提交失败！");
                return false;
            }
            dbUtils.post($scope.dbForm.settings.transCode, reqBody, function (data) {
                if (!angular.isUndefined(data) && !angular.isUndefined(data["errorMsg"])) {
                    dbUtils.tip(data["errorMsg"]);
                }
            });
        }
    };
}