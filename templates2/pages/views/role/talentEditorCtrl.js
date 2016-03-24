/**
 * Created by ziv.hung on 16/2/2.
 */

DBApp.controller('talentEditorCtrl', ['$scope', '$modalInstance', 'dbUtils', 'source', TalentEditorCtrl]);

function TalentEditorCtrl($scope, $modalInstance, dbUtils, source) {
    $scope.toSubCtrlSource = angular.copy(source);
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {cols: 3},
        sections: [{
            sectionTitle: {show: true, icon: "zhaopin", label: "招聘信息"},
            fields: [
                {"name": "recruitmentNo", "label": "招聘编号", "type": "text", "labelCols": "4", "editable": false, "required": true, "placeholder": "招聘编码"},
                {"name": "name", "label": "姓名", "type": "text", "labelCols": "4", "editable": false, "placeholder": "真实姓名", "required": true},
                {"name": "recommendOrgName", "label": "推荐机构", "type": "orgTree", "editable": true, "labelCols": "4", "required": true, "placeholder": "点击选择推荐机构", readonly: true},
                {"name": "jobIntention", "label": "求职意向", "type": "text", "labelCols": "2", "editable": false, "required": true, cols: "8"}
            ]
        }, {
            sectionTitle: {show: true, icon: "renyuandiaodong", label: "基本信息"},
            fields: [
                {"name": "credentialType", "label": "证件类型", "type": "select", "dropDownItemType": "json", "dropDownItem": "certificateType", "labelCols": "4", "editable": true, "required": true},
                {"name": "credentialNo", "label": "证件号码", "type": "text", "labelCols": "4", "editable": true, "required": true, "placeholder": "真实有效:(110000..........)"},
                {"name": "gender", "label": "性别", "type": "select", "dropDownItemType": "json", "dropDownItem": "gender", "labelCols": "4", "editable": true, "required": true},
                {"name": "birthDate", "label": "出生日期", "type": "date", "labelCols": "4", "editable": true, "placeholder": "出生时间:2016-01-01"},
                {"name": "educationalHistory", "label": "学历", "type": "select", "dropDownItemType": "json", "dropDownItem": "educationalHistory", "labelCols": "4", "editable": true, "required": true,},
                {"name": "accountType", "label": "户口属性", "type": "select", "dropDownItemType": "json", "dropDownItem": "accountType", "labelCols": "4", "editable": true, "required": true},
                {"name": "nation", "label": "民族", "type": "select", "dropDownItemType": "json", "dropDownItem": "nation", "labelCols": "4", "editable": true, "required": true},
                {"name": "maritalStatus", "label": "婚姻状况", "type": "select", showDelete: true, "dropDownItemType": "json", "dropDownItem": "maritalStatus", "labelCols": "4", "editable": true},
                {"name": "politicalStatus", "label": "政治面貌", "type": "select", showDelete: true, "dropDownItemType": "json", "dropDownItem": "politicalStatus", "labelCols": "4", "editable": true}
            ]
        }],
        originData: angular.copy(source)
    };
    $scope.dbOrgTree = {
        onOrgSelected: function (org) {
            $scope.dbForm.setFormDataField("recommendOrgId", org['id']);
            $scope.dbForm.setFormDataField("recommendOrgName", org['orgName']);
        }
    };
    //!!FORM-END!!

    if (source) {
        $scope.dbForm.isEditView = true;
        $scope.dbForm.showEditBtn = true;
        $scope.dbForm.globalFieldEditor = true;
    }

    /**
     * 提交数据信息
     *
     * @param isValid 页面校验是否通过
     */
    $scope.submitForm = function (isValid) {
        $scope.dbForm.submited = true;
        if (isValid) {
            var reqBody = angular.copy($scope.dbForm.getFormData());
            var selectFields = $scope.dbForm.getSelectFields();
            angular.forEach(selectFields, function (field) {
                if (reqBody[field.name]) {
                    reqBody[field.name] = reqBody[field.name].value;
                }
            });
            dbUtils.post("talentHandle", reqBody, function (data) {
                if (!angular.isUndefined(data)) {
                    dbUtils.error(data);
                } else {
                    dbUtils.success("人才数据信息更新成功");
                    $modalInstance.close();
                }
            }, function (error) {
                dbUtils.error("人才数据信息更新失败" + error);
            });

        } else {
            console.log("校验不通过");
        }

    };
    /* 汇总其他信息数据 */
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

//人才联系信息
DBApp.controller("relationInfoEditorCtrl", ['$scope', 'dbUtils', RelationInfoEditorCtrl]);

function RelationInfoEditorCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo2" || isLoaded) {
            return;
        }
        if ($scope.toSubCtrlSource) {
            dbUtils.post("talentInfo", {id: $scope.toSubCtrlSource['id'], infoType: "relations"}, function (data) {
                if (data) {
                    $scope.dbDataTable.rows = JSON.parse(data);
                    $scope.setOtherTabInfo('relations', data);
                }
            }, function (error) {
                dbUtils.error("人才联系信息失败!" + error);
            });
        }
        isLoaded = true;
    });

    var dbDataTable = {
        title: {icon: "fangbiancontact", label: "联系信息"},
        tableHeaders: [
            {label: "联系人名称", width: "30%", field: "relationName", dataType: "text", placeholder: "联系人名称", required: true},
            {label: "电话类型", width: "30%", field: "phoneType", dataType: "select", dropDownDataSource: "json", dropDownItem: "phoneType", required: true},
            {label: "电话号码", width: "30%", field: "phoneNumber", dataType: "number", placeholder: "联系电话", required: true}
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

    $scope.dbDataTable = dbDataTable;
}


//地址信息
DBApp.controller("addressInfoEditorCtrl", ['$scope', 'dbUtils', AddressInfoEditorCtrl]);

function AddressInfoEditorCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo3" || isLoaded) {
            return;
        }
        if ($scope.toSubCtrlSource) {
            dbUtils.post("talentInfo", {id: $scope.toSubCtrlSource['id'], infoType: "address"}, function (data) {
                if (data) {
                    $scope.dbDataTable.rows = JSON.parse(data);
                    $scope.setOtherTabInfo('address', data);
                }
            }, function (error) {
                dbUtils.error("获取地址信息失败!" + error);
            });
        }
        isLoaded = true;
    });

    var dbDataTable = {
        title: {icon: "dizhi", label: "地址信息"},
        tableHeaders: [
            {label: "地址类型", width: "30%", field: "addressType", dataType: "select", dropDownDataSource: "json", dropDownItem: "addressType", required: true},
            {label: "地址", width: "40%", field: "address", dataType: "text", placeholder: "详细地址", required: true},
            {label: "邮政编码", width: "30%", field: "post", dataType: "number", placeholder: "邮编"}
        ],
        distinct: {
            msg: "地址重复!",
            fields: ["address"]
        },
        requiredMsg: "地址类型,地址等信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('address', rows);
        }
    };
    $scope.dbDataTable = dbDataTable;
}


//个人履历
DBApp.controller("experiencesEditorCtrl", ['$scope', 'dbUtils', ExperiencesEditorCtrl]);

function ExperiencesEditorCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo4" || isLoaded) {
            return;
        }
        if ($scope.toSubCtrlSource) {
            dbUtils.post("talentInfo", {id: $scope.toSubCtrlSource['id'], infoType: "experiences"}, function (data) {
                if (data) {
                    $scope.dbDataTable.rows = JSON.parse(data);
                    $scope.setOtherTabInfo('experiences', data);
                }
            }, function (error) {
                dbUtils.error("获取个人履历信息失败!" + error);
            });
        }
        isLoaded = true;
    });

    var dbDataTable = {
        title: {icon: "zhengjianziliao", label: "证件信息"},
        tableHeaders: [
            {label: "履历类型", width: "20%", field: "certificateType", dataType: "select", dropDownDataSource: "json", dropDownItem: "certificateType", required: true},
            {label: "名称", width: "20%", field: "name", dataType: "text", placeholder: "履历名称", required: true},
            {label: "起期", width: "20%", field: "effectDate", dataType: "date", placeholder: "起始日期", required: true},
            {label: "至期", width: "20%", field: "endDate", dataType: "date", placeholder: "截止日期"},
            {label: "扮演角色", width: "20%", field: "playRole", dataType: "text", placeholder: "根据不同履历类型填写对应内容"}
        ],
        distinct: {
            msg: "名称信息重复!",
            fields: ["name"]
        },
        requiredMsg: "履历类型,名称,起期等信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('experiences', rows);
        }
    };

    $scope.dbDataTable = dbDataTable;
}


//家庭关系人
DBApp.controller("familyRelationsEditorCtrl", ['$scope', 'dbUtils', FamilyRelationsEditorCtrl]);

function FamilyRelationsEditorCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo5" || isLoaded) {
            return;
        }
        if ($scope.toSubCtrlSource) {
            dbUtils.post("talentInfo", {id: $scope.toSubCtrlSource['id'], infoType: "familyRelations"}, function (data) {
                if (data) {
                    $scope.dbDataTable.rows = JSON.parse(data);
                    $scope.setOtherTabInfo('familyRelations', data);
                }
            }, function (error) {
                dbUtils.error("获取家庭关系人信息失败!" + error);
            });
        }
        isLoaded = true;
    });
    var dbDataTable = {
        title: {icon: "baoxianzhushouicon07", label: "家庭关系人"},
        tableHeaders: [
            {label: "姓名", width: "20%", field: "name", dataType: "text", required: true, placeholder: "关系人名称"},
            {label: "与本人关系", width: "20%", field: "relationType", dataType: "select", dropDownDataSource: "json", dropDownItem: "relationType", required: true},
            {label: "电话号码", width: "20%", field: "telephone", dataType: "text", placeholder: "有效联系电话", required: true},
            {label: "工作单位", width: "20%", field: "workUnit", dataType: "text", placeholder: "当前工作单位"},
            {label: "职务", width: "20%", field: "position", dataType: "text", placeholder: "职务"}
        ],
        distinct: {
            msg: "姓名重复!",
            fields: ["name"]
        },
        requiredMsg: "姓名,与本人关系,电话号码等信息必填!",
        rows: [],
        afterAdd: function (rows) {
            $scope.setOtherTabInfo('familyRelations', rows);
        }
    };

    $scope.dbDataTable = dbDataTable;
}