/**
 * Created by ziv.hung on 15/10/16.
 * 人员信息添加编辑界面
 */

var DBApp = angular.module('DBApp');

DBApp.controller("userEditorCtrl", ['$scope', '$modalInstance', 'dbUtils', 'user', UserEditorCtrl]);

function UserEditorCtrl($scope, $modalInstance, dbUtils, user) {
//!!FORM--START!!
    $scope.dbForm = {
        settings: {showClose: true, transCode: angular.isUndefined(user) ? "9001" : "userModify", cols: 2},// false 新增页面，true 修改页面
        title: {icon: "luru", label: "登录用户信息"},
        sections: [{
            sectionTitle: {show: true, icon: "touxiang", label: "用户信息"},
            fields: [
                {"name": "loginName", "label": "登陆用户", "type": "text", "labelCols": "3", "editable": true, "required": true, "placeholder": "登陆用户使用名", "cols": "11"},
                {"name": "email", "label": "电子邮件", "type": "text", "labelCols": "3", "editable": true, "required": false, "placeholder": "有效的邮箱", "cols": "11"}]
        }],
        originData: user,
        events: {
            beforeSubmit: function (reqBody) {
                var password = reqBody['password'];
                var checkPassword = reqBody['checkPassword'];
                if (password !== checkPassword) {
                    dbUtils.warning("前后密码不一致,请确认.");
                    return false;
                }
            },
            afterSubmit: function (data) {
                $modalInstance.close();
            },
            modalClose: function () {
                $modalInstance.dismiss("cancel");
            }
        }
    };
    if (angular.isUndefined(user)) {
        $scope.dbForm.sections[0].fields.push({"name": "password", "label": "登陆密码", "type": "password", "labelCols": "3", "editable": true, "required": true, "placeholder": "请输入密码", "cols": "11"});
        $scope.dbForm.sections[0].fields.push({"name": "checkPassword", "label": "确认密码", "type": "password", "labelCols": "3", "editable": true, "required": true, "placeholder": "请再输入一次", "cols": "11"});
    }
    var bottomFields = [
        {"name": "name", "label": "称呼姓名", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "真实姓名"},
        {"name": "mobile", "label": "联系电话", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "有效联系电话"},
        {"name": "orgName", "label": "机构名称", "type": "orgTree", "labelCols": "4", "editable": true, "required": true, "placeholder": "点击选择所属属机构", readonly: true},
        {"name": "orgCode", "label": "机构代码", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "所直属机构代码", disabled: true}];

    angular.forEach(bottomFields, function (item) {
        $scope.dbForm.sections[0].fields.push(item);
    })

    $scope.dbOrgTree = {
        onOrgSelected: function (org) {
            console.log(org);
            $scope.dbForm.setFormDataField("orgId", org['orgId']);
            $scope.dbForm.setFormDataField("orgCode", org['orgCode']);
            $scope.dbForm.setFormDataField("orgName", org['orgName']);
        }
    };
}