/**
 * Created by ziv.hung on 16/1/29.
 */

var DBApp = angular.module("DBApp")

DBApp.controller('partyRoleDetailCtrl', ['$scope', '$modalInstance', 'source', PartyRoleDetailCtrl]);

function PartyRoleDetailCtrl($scope, $modalInstance, source) {
    $scope.toSubCtrlSource = angular.copy(source);
    //!!FORM--START!!
    $scope.dbForm = {
        settings: {cols: 3},
        sections: [{
            sectionTitle: {show: true, icon: "jigou", label: "机构/部门信息"},
            fields: [
                {"name": "organizationName", "label": "所属机构", "type": "text", "labelCols": "4", disabled: true},
                {"name": "departmentName", "label": "所属部门", "type": "text", "labelCols": "4", disabled: true},
                {"name": "businessType", "label": "业务属性", "type": "text", "labelCols": "4", disabled: true},
                {"name": "agency", "label": "所辖代理机构", "type": "text", "labelCols": "2", cols: "8", disabled: true},
                {"name": "partyNo", "label": "员工工号", "type": "text", "labelCols": "4", disabled: true}
            ]
        }, {
            sectionTitle: {show: true, icon: "renyuandiaodong", label: "员工基本信息"},
            fields: [
                {"name": "partyName", "label": "员工姓名", "type": "text", "labelCols": "4", disabled: true},
                {"name": "certificateType", "label": "证件类型", "type": "text", "labelCols": "4", disabled: true},
                {"name": "certificateNo", "label": "证件号码", "type": "text", "labelCols": "4", "editable": true, disabled: true},
                {"name": "gender", "label": "性别", "type": "text", "labelCols": "4"},
                {"name": "staffingLevel", "label": "职级", "type": "text", "labelCols": "4", disabled: true},
                {"name": "entryDate", "label": "到岗日期", "type": "text", "labelCols": "4", disabled: true},
                {"name": "nation", "label": "民族", "type": "text", "labelCols": "4", disabled: true},
                {"name": "educationalHistory", "label": "学历", "type": "text", "labelCols": "4", "editable": true},
                {"name": "accountType", "label": "户口属性", "type": "text", "labelCols": "4", disabled: true}
            ]
        },
            {
                sectionTitle: {show: true, icon: "gengduo", label: "人员其他信息"},
                fields: [
                    {"name": "maritalStatus", "label": "婚姻状况", "type": "text", "labelCols": "4", "editable": true},
                    {"name": "politicalStatus", "label": "政治面貌", "type": "text", "labelCols": "4", "editable": true},
                    {"name": "birthDate", "label": "出生日期", "type": "text", "labelCols": "4", "editable": true},
                    {"name": "height", "label": "身高", "type": "text", "labelCols": "4", "editable": true},
                    {"name": "weight", "label": "体重", "type": "text", "labelCols": "4", "editable": true},
                    {"name": "referralName", "label": "推荐人", "type": "text", "labelCols": "4", "editable": true},
                    {"name": "remarks", "label": "备注", "type": "textarea", "labelCols": "2", "cols": "8", "editable": true}
                ]
            }],
        originData: source
    };
    //!!FORM-END!!

    if (source) {
        $scope.dbForm.isEditView = true;
        $scope.dbForm.showEditBtn = true;
        $scope.dbForm.globalFieldEditor = true;
    }

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
DBApp.controller("relationInfoDetailCtrl", ['$scope', 'dbUtils', RelationInfoDetailCtrl]);

function RelationInfoDetailCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo2" || isLoaded) {
            return;
        }
        dbUtils.post($scope.toSubCtrlSource['infoUrl'], {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "relations"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        });

        isLoaded = true;
    });
    var dbDataTable = {
        title: {icon: "fangbiancontact", label: "员工联系信息"},
        tableHeaders: [
            {label: "姓名", width: "15%", field: "relationName", dataType: "text"},
            {label: "电话类型", width: "15%", field: "phoneType", dataType: "text"},
            {label: "电话号码", width: "15%", field: "phoneNumber", dataType: "text"},
            {label: "分机", width: "10%", field: "relationExtension", dataType: "text"},
            {label: "优先号码", width: "15%", field: "relationPriorityPhone", dataType: "text"},
            {label: "国别", width: "10%", field: "relationNation", dataType: "text"},
            {label: "地区", width: "10%", field: "relationArea", dataType: "text"}
        ],
        distinct: {
            msg: "电话号码重复!",
            fields: ["phoneNumber"]
        },
        requiredMsg: "姓名,电话类型,电话号码等联系信息必填!",
        rows: []
    };
    $scope.dbDataTable = dbDataTable;
}


//员工地址信息
DBApp.controller("addressInfoDetailCtrl", ['$scope', 'dbUtils', AddressInfoDetailCtrl]);

function AddressInfoDetailCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo3" || isLoaded) {
            return;
        }
        dbUtils.post($scope.toSubCtrlSource['infoUrl'], {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "address"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        });
        isLoaded = true;
    });

    var dbDataTable = {
        title: {icon: "dizhi", label: "员工地址信息"},
        tableHeaders: [
            {label: "地址类型", width: "15%", field: "addressType", dataType: "text"},
            {label: "地址", width: "20%", field: "address", dataType: "text"},
            {label: "邮政编码", width: "10%", field: "post", dataType: "text"},
            {label: "国家", width: "15%", field: "nation", dataType: "text"},
            {label: "省", width: "10%", field: "province", dataType: "text"},
            {label: "市", width: "10%", field: "city", dataType: "text"},
            {label: "优先地址", width: "10%", field: "firstAddress", dataType: "text"}
        ],
        distinct: {
            msg: "地址重复!",
            fields: ["address"]
        },
        requiredMsg: "地址类型,地址,邮政编码等地址信息必填!",
        rows: []
    }
    $scope.dbDataTable = dbDataTable;

}


//员工证件信息
DBApp.controller("credentialsDetailCtrl", ['$scope', 'dbUtils', CredentialsDetailCtrl]);

function CredentialsDetailCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo4" || isLoaded) {
            return;
        }
        dbUtils.post($scope.toSubCtrlSource['infoUrl'], {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "credentials"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        });
        isLoaded = true;
    });

    var dbDataTable = {
        title: {icon: "zhengjianziliao", label: "员工证件信息"},
        tableHeaders: [
            {label: "证件类型", width: "25%", field: "certificateType", dataType: "text"},
            {label: "证件号码", width: "25%", field: "certificateNo", dataType: "text"},
            {label: "生效日期", width: "20%", field: "effectDate", dataType: "text"},
            {label: "到期日期", width: "20%", field: "endDate", dataType: "text"}
        ],
        distinct: {
            msg: "证件号码重复!",
            fields: ["certificateNo"]
        },
        requiredMsg: "证件类型,证件号码,生效日期等证件信息必填!",
        rows: []
    }

    $scope.dbDataTable = dbDataTable;
}


//资格证信息
DBApp.controller("qualificationsDetailCtrl", ['$scope', 'dbUtils', QualificationsDetailCtrl]);

function QualificationsDetailCtrl($scope, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo5" || isLoaded) {
            return;
        }
        dbUtils.post($scope.toSubCtrlSource['infoUrl'], {partyId: $scope.toSubCtrlSource['partyId'], businessType: $scope.toSubCtrlSource['businessType'], infoType: "qualifications"}, function (data) {
            if (data) {
                $scope.dbDataTable.rows = JSON.parse(data);
            }
        }, function (error) {
            dbUtils.error("获取资格证信息失败!" + error);
        });
        isLoaded = true;
    });
    var dbDataTable = {
        title: {icon: "baoxianzhushouicon07", label: "资格证信息"},
        tableHeaders: [
            {label: "证件类型", width: "25%", field: "certificateType", dataType: "text"},
            {label: "证件号码", width: "25%", field: "certificateNo", dataType: "text"},
            {label: "生效日期", width: "20%", field: "effectDate", dataType: "text"},
            {label: "到期日期", width: "20%", field: "endDate", dataType: "text"}
        ],
        distinct: {
            msg: "证件号码重复!",
            fields: ["certificateNo"]
        },
        requiredMsg: "证件类型,证件号码,生效日期等资格证信息必填!",
        rows: []
    }

    $scope.dbDataTable = dbDataTable;
}
