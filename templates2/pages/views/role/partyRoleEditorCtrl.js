/**
 * Created by ziv.hung on 16/1/14.
 */

var DBApp = angular.module("DBApp")

DBApp.controller('partyRoleEditorCtrl', ['$scope', '$modalInstance', '$modal', 'dbUtils', 'source', PartyRoleEditorCtrl]);

function PartyRoleEditorCtrl($scope, $modalInstance, $modal, dbUtils, source) {
    $scope.toSubCtrlSource = angular.copy(source);
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {cols: 3},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "机构/部门信息"},
            fields: [
                {name: "departmentName", label: "所属部门", type: "orgTree", labelCols: "4", editable: false, required: true, placeholder: "点击选择所属部门", readonly: true},
                {name: "organizationName", label: "所属机构", type: "text", labelCols: "4", editable: false, required: true, placeholder: "请先选择所属部门", disabled: true},
                {name: "businessType", label: "业务属性", type: "select", dropDownItemType: "json", dropDownItem: "businessType", labelCols: "4", editable: false, required: true},
                {name: "agency", label: "所辖代理机构", type: "text", labelCols: "2", editable: false, required: false, cols: "8", placeholder: "点击选择所属代理机构,可多选", readonly: true, disabled: true},
                {name: "partyNo", label: "员工工号", type: "text", labelCols: "4", editable: false, placeholder: "有总管系统自动生成", disabled: true}
            ]
        }, {
            sectionTitle: {show: true, icon: "renyuandiaodong", label: "员工基本信息"},
            fields: [
                {name: "partyName", label: "员工姓名", type: "text", labelCols: "4", editable: true, required: true, placeholder: "真实姓名:张三"},
                {name: "certificateType", label: "证件类型", type: "select", dropDownItemType: "json", dropDownItem: "certificateType", labelCols: "4", editable: false, required: true},
                {name: "certificateNo", label: "证件号码", type: "text", labelCols: "4", editable: true, required: true, placeholder: "真实有效:(110000..........)"},
                {name: "gender", label: "性别", type: "select", dropDownItemType: "json", dropDownItem: "gender", labelCols: "4", editable: false, required: true, disabled: false},
                {name: "staffingLevel", label: "职级", type: "select", dropDownItemType: "json", dropDownItem: "staffingLevel", labelCols: "4", editable: false, required: true},
                {name: "entryDate", label: "到岗日期", type: "date", labelCols: "4", editable: false, required: true, placeholder: "入职时间:2016-01-01"},
                {name: "nation", label: "民族", type: "select", dropDownItemType: "json", dropDownItem: "nation", labelCols: "4", editable: false, required: true},
                {name: "educationalHistory", label: "学历", type: "select", dropDownItemType: "json", dropDownItem: "educationalHistory", labelCols: "4", editable: true, required: true,},
                {name: "accountType", label: "户口属性", type: "select", dropDownItemType: "json", dropDownItem: "accountType", labelCols: "4", editable: true, required: true}
            ]
        },
            {
                sectionTitle: {show: true, icon: "gengduo", label: "人员其他信息"},
                fields: [
                    {name: "maritalStatus", label: "婚姻状况", type: "select", showDelete: true, dropDownItemType: "json", dropDownItem: "maritalStatus", labelCols: "4", editable: true},
                    {name: "politicalStatus", label: "政治面貌", type: "select", showDelete: true, dropDownItemType: "json", dropDownItem: "politicalStatus", labelCols: "4", editable: true},
                    {name: "birthDate", label: "出生日期", type: "date", labelCols: "4", editable: true, placeholder: "出生时间:2016-01-01", disabled: false},
                    {name: "height", label: "身高", type: "text", labelCols: "4", editable: true, placeholder: "身高(单位:cm)"},
                    {name: "weight", label: "体重", type: "text", labelCols: "4", editable: true, placeholder: "体重(单位:kg)"},
                    {name: "referralName", label: "推荐人", type: "text", labelCols: "4", editable: true, placeholder: "点击选择推荐人", readonly: true},
                    {name: "remarks", label: "备注", type: "textarea", labelCols: "2", editable: true, "cols": "8"}
                ]
            }],
        originData: source,
        events: {
            "referralNameClick": function () {
                var instance = $modal.open({
                    animation: true,
                    templateUrl: 'views/roles.json/selectPartyRoleView.html',
                    controller: 'selectPartyRoleCtrl',
                    size: "md",
                    backdrop: "static"
                });
                instance.result.then(function (partyRole) {
                    $scope.dbForm.setFormDataField("referralId", partyRole['id']);
                    $scope.dbForm.setFormDataField("referralNo", partyRole['partyNo']);
                    $scope.dbForm.setFormDataField("referralName", partyRole['partyName']);
                });
            }
        }
    };
    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: false, showDepartment: true}};
    $scope.dbOrgTree = {
        onOrgSelected: function (org) {
            $scope.dbForm.setFormDataField("organizationId", org['orgId']);
            $scope.dbForm.setFormDataField("organizationName", org['orgNamePath']);
            $scope.dbForm.setFormDataField("departmentId", org['departId']);
            $scope.dbForm.setFormDataField("departmentName", org['departNamePath']);
        }
    };
    //!!FORM-END!!

    if (source) {
        $scope.dbForm.isEditView = true;
        $scope.dbForm.showEditBtn = true;
        $scope.dbForm.globalFieldEditor = true;
    }

//监听 业务属性 根据业务类型 影像所辖代理机构是否必填
    $scope.$watch("dbForm.formData.businessType", function (newVal, oldVal) {
        if (oldVal !== newVal) {
            var formField = null;
            var agency = null;
            if (newVal['value'] == "客户经理") {
                agency = "客户经理代理机构";
                formField = [{name: "agency", required: true}];
            } else {
                formField = [{name: "agency", required: false}];
            }
            $scope.dbForm.setFormDataField("agency", agency);
            $scope.dbForm.reSetFormField(formField);
        }
    });

//监听 证件号码 若 证件类型为 身份证,根据证件号 计算出 性别,出生日期.
    $scope.$watch("dbForm.formData.certificateNo", function (newVal, oldVal) {
        if (angular.isUndefined($scope.dbForm.getFieldData)) {
            return;
        }
        var certificateType = $scope.dbForm.getFieldData("certificateType");
        var gender = null;
        var birthDate = null;
        if (angular.isUndefined(certificateType)) {
            $scope.dbForm.setFormDataField("certificateType", {name: "身份证", value: "身份证"});
            certificateType = "身份证";
        }else{
            certificateType = certificateType['value'];
        }
        if(certificateType === '身份证') {
            if (!angular.isUndefined(newVal) && oldVal !== newVal && newVal.length === 18) {
                var msg = "身份证号格式不正确";
                var valid = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(newVal);
                if (!valid) {
                    dbUtils.warning(msg);
                    return;
                }
                var idCardGender = parseInt(newVal.substr(16, 1)) % 2 == 1 ? "男" : "女";
                gender = {name: idCardGender, value: idCardGender};
                birthDate = newVal.substring(6, 10) + "-" + newVal.substring(10, 12) + "-" + newVal.substring(12, 14);
            }
        }
        $scope.dbForm.setFormDataField("gender", gender);
        $scope.dbForm.setFormDataField("birthDate", birthDate);
    });

    /**
     * 提交数据信息
     *
     * @param isValid 页面校验是否通过
     */
    $scope.submitForm = function (isValid) {
        $scope.dbForm.submited = true;
        if (isValid) {
            var reqBody = angular.copy($scope.dbForm.getFormData());
            var selectFields = ['businessType', 'certificateType', 'gender', 'staffingLevel', 'nation', 'educationalHistory', 'accountType', 'maritalStatus', 'politicalStatus'];
            angular.forEach(selectFields, function (field) {
                if (reqBody[field]) {
                    reqBody[field] = reqBody[field].value;
                }
            });
            console.log(reqBody);
            dbUtils.post("partyRoleHandle", reqBody, function (data) {
                if (!angular.isUndefined(data) && !angular.isUndefined(data["errorMsg"])) {
                    dbUtils.error(data["errorMsg"]);
                } else {
                    dbUtils.success("人员数据信息更新成功");
                    $modalInstance.close();
                }
            }, function (error) {
                dbUtils.error("人员数据信息更新失败" + error);
            });

        } else {
            console.log("校验不通过");
        }

    };
    /* 汇总其他人员信息数据 */
    $scope.setOtherTabInfo = function (field, rows) {
        var formData = $scope.dbForm.getFormData();
        formData[field] = rows;
    };

    /* 页面Tab切换事件 */
    $scope.contentId = "tabInfo1";
    $scope.changeTab = function (contentId) {
        if ($scope.contentId == contentId) {
            return;
        }
        $scope.contentId = contentId;
        $scope.$broadcast('changeTabLoad', {'contentId': contentId});
    };

    /* 页面关闭按钮事件 */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

//员工联系信息
DBApp.controller("relationInfoCtrl", ['$scope', 'dbUtils', RelationInfoCtrl]);

function RelationInfoCtrl($scope, dbUtils) {
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo2") {
            return;
        }
    });

    var dbDataTable = {
        title: {icon: "fangbiancontact", label: "员工联系信息"},
        tableHeaders: [
            {label: "姓名", width: "15%", field: "relationName", dataType: "text", placeholder: "", required: true},
            {label: "电话类型", width: "15%", field: "phoneType", dataType: "select", dropDownDataSource: "json", dropDownItem: "phoneType", placeholder: "", required: true},
            {label: "电话号码", width: "15%", field: "phoneNumber", dataType: "number", placeholder: "", required: true},
            {label: "分机", width: "10%", field: "relationExtension", dataType: "number", placeholder: "", ruleMsg: ""},
            {label: "优先号码", width: "15%", field: "relationPriorityPhone", dataType: "number", placeholder: "", ruleMsg: ""},
            {label: "国别", width: "10%", field: "relationNation", dataType: "number", placeholder: "", ruleMsg: ""},
            {label: "地区", width: "10%", field: "relationArea", dataType: "text", placeholder: "", ruleMsg: ""}
        ],
        distinct: {
            msg: "电话号码重复!",
            fields: ["phoneNumber"]
        },
        requiredMsg: "姓名,电话类型,电话号码等联系信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('relations', rows);
        }
    };

    if ($scope.toSubCtrlSource) {
        dbUtils.post("partyRoleInfo", {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "relations"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
                $scope.setOtherTabInfo('relations', data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        })
    }

    $scope.dbDataTable = dbDataTable;
}


//员工地址信息
DBApp.controller("addressInfoCtrl", ['$scope', 'dbUtils', AddressInfoCtrl]);

function AddressInfoCtrl($scope, dbUtils) {
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo3") {
            return;
        }
    });

    var dbDataTable = {
        title: {icon: "dizhi", label: "员工地址信息"},
        tableHeaders: [
            {label: "地址类型", width: "15%", field: "addressType", dataType: "select", dropDownDataSource: "json", dropDownItem: "addressType", placeholder: "", required: true},
            {label: "地址", width: "20%", field: "address", dataType: "text", placeholder: "", required: true},
            {label: "邮政编码", width: "10%", field: "post", dataType: "number", placeholder: "", required: true},
            {label: "国家", width: "15%", field: "nation", dataType: "text", placeholder: "", ruleMsg: ""},
            {label: "省", width: "10%", field: "province", dataType: "text", placeholder: "", ruleMsg: ""},
            {label: "市", width: "10%", field: "city", dataType: "text", placeholder: "", ruleMsg: ""},
            {label: "优先地址", width: "10%", field: "firstAddress", dataType: "text", placeholder: "", ruleMsg: ""}
        ],
        distinct: {
            msg: "地址重复!",
            fields: ["address"]
        },
        requiredMsg: "地址类型,地址,邮政编码等地址信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('address', rows);
        }
    };
    $scope.dbDataTable = dbDataTable;

    if ($scope.toSubCtrlSource) {
        dbUtils.post("partyRoleInfo", {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "address"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
                $scope.setOtherTabInfo('address', data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        })
    }
}


//员工证件信息
DBApp.controller("credentialsCtrl", ['$scope', 'dbUtils', CredentialsCtrl]);

function CredentialsCtrl($scope, dbUtils) {
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo4") {
            return;
        }
    });

    var dbDataTable = {
        title: {icon: "zhengjianziliao", label: "员工证件信息"},
        tableHeaders: [
            {label: "证件类型", width: "25%", field: "certificateType", dataType: "select", dropDownDataSource: "json", dropDownItem: "certificateType", placeholder: "", required: true},
            {label: "证件号码", width: "25%", field: "certificateNo", dataType: "text", placeholder: "", required: true},
            {label: "生效日期", width: "20%", field: "effectDate", dataType: "date", placeholder: "", required: true},
            {label: "到期日期", width: "20%", field: "endDate", dataType: "date", placeholder: "", ruleMsg: ""}
        ],
        distinct: {
            msg: "证件号码重复!",
            fields: ["certificateNo"]
        },
        requiredMsg: "证件类型,证件号码,生效日期等证件信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('credentials', rows);
        }
    };

    $scope.dbDataTable = dbDataTable;

    if ($scope.toSubCtrlSource) {
        dbUtils.post("partyRoleInfo", {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "credentials"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
                $scope.setOtherTabInfo('credentials', data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        });
    }
}


//资格证信息
DBApp.controller("qualificationsCtrl", ['$scope', 'dbUtils', QualificationsCtrl]);

function QualificationsCtrl($scope, dbUtils) {
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo5") {
            return;
        }
    });
    var dbDataTable = {
        title: {icon: "baoxianzhushouicon07", label: "资格证信息"},
        tableHeaders: [
            {label: "证件类型", width: "25%", field: "certificateType", dataType: "select", dropDownDataSource: "json", dropDownItem: "certificateType", placeholder: "", required: true},
            {label: "证件号码", width: "25%", field: "certificateNo", dataType: "text", placeholder: "", required: true},
            {label: "生效日期", width: "20%", field: "effectDate", dataType: "date", placeholder: "", required: true},
            {label: "到期日期", width: "20%", field: "endDate", dataType: "date", placeholder: "", ruleMsg: ""}
        ],
        distinct: {
            msg: "证件号码重复!",
            fields: ["certificateNo"]
        },
        requiredMsg: "证件类型,证件号码,生效日期等资格证信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('qualifications', rows);
        }
    };

    $scope.dbDataTable = dbDataTable;

    if ($scope.toSubCtrlSource) {
        dbUtils.post("partyRoleInfo", {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "qualifications"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
                $scope.setOtherTabInfo('qualifications', data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        })
    }
}
