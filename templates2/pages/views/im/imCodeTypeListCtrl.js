/**
 * Created by ziv.hung.
 * 字典大类列表后台维护功能 CRUD
 * v1.0.0 15/10/15
 */
var DBApp = angular.module('DBApp');


DBApp.controller("imCodeCtrl", ['$scope', ImCodeCtrl]);
function ImCodeCtrl($scope) {
    $scope.contentId = "tabInfo1";

    $scope.changeTab = function (contentId) {
        if ($scope.contentId == contentId) {
            return;
        }
        $scope.contentId = contentId;
        $scope.$broadcast("changeTabLoad", {"contentId": contentId});
    };

}

//字典大类配置 controller 控制代码
DBApp.controller("imCodeTypeListCtrl", ['$scope', '$modal', 'dbUtils', ImCodeTypeListCtrl]);
function ImCodeTypeListCtrl($scope, $modal, dbUtils) {

    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "名称/代码", "labelCols": "2", cols: 8}
            ]
        },
        grid: {
            settings: {
                transCode: "1010",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {"name": "大类代码", "width": "10%", "field": "code"},
                {"name": "类型代码", "width": "10%", "field": "typeCode"},
                {"name": "中文名称", "width": "18%", "field": "nameCn"},
                {"name": "英文名称", "width": "10%", "field": "nameEn"},
                {"name": "描述", "width": "30%", "field": "comment"},
                {"name": "创建时间", "width": "12%", "field": "firstInsert"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    };
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "nameCnClick": function (currentRecord) {
                    openModal(currentRecord);
                }
            },
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    remove();
                }
            }, {
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    function remove() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.post("1013", {"reqs": selectRows}, function () {
                dbUtils.success("字典数据批量删除成功!");
                $scope.dbFormGrid.reLoadData();
            });
        });
    }

    //弹出对话框
    function openModal(currentRecord) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/im/imCodeTypeEditor.html',
            controller: 'imCodeTypeEditorCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                imCodeType: function () {
                    return currentRecord;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }
}


DBApp.controller("imCodeListCtrl", ['$scope', '$modal', 'dbUtils', ImCodeListCtrl]);
function ImCodeListCtrl($scope, $modal, dbUtils) {
    var isLoaded = false;
    $scope.$on("changeTabLoad", function (event, object) {
        var contentId = object['contentId'];
        if (contentId != "tabInfo2" || isLoaded) {
            return;
        }
        $scope.dbFormGrid.reLoadData();
        isLoaded = true;
    });
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "名称/代码", "labelCols": "2", cols: 8}
            ]
        },
        grid: {
            settings: {
                transCode: "1020",
                autoLoad: false,
                showCheckBox: true
            },
            header: [
                {"name": "字典大类", "width": "15%", "field": "typeCode"},
                {"name": "字典代码", "width": "15%", "field": "code"},
                {"name": "中文名称", "width": "20%", "field": "nameCn"},
                {"name": "英文名称", "width": "15%", "field": "nameEn"},
                {"name": "字典排序", "width": "15%", "field": "sortNo"},
                {"name": "创建时间", "width": "20%", "field": "firstInsert"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    };
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "nameCnClick": function (currentRecord) {
                    openModal(currentRecord);
                }
            },
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    remove();
                }
            }, {
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    function remove() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.post("1023", {"reqs": selectRows}, function () {
                $scope.dbFormGrid.reLoadData();
            });
        });
    }

    //弹出对话框
    function openModal(imCodeList) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/im/imCodeListEditor.html',
            controller: 'imCodeListEditorCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                imCodeList: function () {
                    return imCodeList;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }
}