/**
 * Created by ziv.hung on 16/1/17.
 * dbDataTable 指令
 * @version 1.1
 *
 *
 *
 *
 *
 */

'use strict';
var dbdbDataTableDirectives = angular.module('db.components.data.table', ['dbUtils']);
dbdbDataTableDirectives.directive('dbDataTable', ['$window', '$timeout', 'dbUtils', DbDataTable]);

function DbDataTable($window, $timeout, dbUtils) {
    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbDataTable.html",
        replace: true,
        controller: ['$scope', 'dbImService', function ($scope, dbImService) {
            DbDataTableController($scope, dbUtils, dbImService);
        }],
        link: function (scope, element, attrs) {
            console.log("db grid condition link");
            $timeout(
                function () {
                    var $ = $window.jQuery;
                    if ($().datepicker) {
                        $('.date-picker').datepicker({
                            rtl: Metronic.isRTL(),
                            orientation: "left",
                            autoclose: true,
                            language: 'zh-CN'
                        });
                    }
                },
                100
            );
        }
    }
}
function DbDataTableController($scope, dbUtils, dbImService) {

    if (angular.isUndefined($scope.dbDataTable)) {
        return;
    }

    $scope.dbDataTable.tableData = {};

    var dropDownFields = [];
    var requiredFields = [];

    angular.forEach($scope.dbDataTable.tableHeaders, function (item) {

        if (item.dropDownDataSource && item.dropDownItem && item.dataType === "select") {
            item.dropDownItemValue = [];//单独定义一个字段,默认为空数组,防止select.js异常
            dropDownFields.push(item.dropDownItem);
            if (item.dropDownDataSource.toLocaleLowerCase() == "json") {
                dbImService.queryByJSON(item.dropDownItem, function (dict) {
                    item.dropDownItemValue = dict;
                });
            } else if (item.dropDownDataSource.toLocaleLowerCase() == "im") {
                dbImService.queryImCode(item.dropDownItem, function (dict) {
                    item.dropDownItemValue = dict;
                });
            }

        } else {
            item.dropDownItemValue = item.dropDownItem;
        }
        if (item.required) {
            requiredFields.push(item.field);
        }
    });

    $scope.addData = function () {
        var persistentRecord = angular.copy($scope.dbDataTable.tableData);
        angular.forEach(dropDownFields, function (dropdown) {
            if (dropdown) {
                persistentRecord[dropdown] = persistentRecord[dropdown] ? persistentRecord[dropdown].value : "";
            }
        });

        var warningMsg = "";
        angular.forEach(requiredFields, function (requiredField) {
            if (!persistentRecord[requiredField]) {
                warningMsg = $scope.dbDataTable.requiredMsg;
                return false;
            }
        });

        if (warningMsg) {
            dbUtils.warning(warningMsg);
            return;
        }

        if ($scope.dbDataTable.distinct) {
            angular.forEach($scope.dbDataTable.rows, function (row) {
                angular.forEach($scope.dbDataTable.distinct.fields, function (item) {
                    if (persistentRecord[item] === row[item]) {
                        warningMsg = $scope.dbDataTable.distinct.msg;
                        return false;
                    }
                });
            });
        }
        if (warningMsg) {
            dbUtils.warning(warningMsg);
            return;
        }

        $scope.dbDataTable.rows.push(persistentRecord);
        if ($scope.dbDataTable.afterAdd) {
            $scope.dbDataTable.afterAdd(angular.copy($scope.dbDataTable.rows));
        }
    };
    $scope.removeCurrent = function (row) {
        var persistentRecords = [];
        var transientRecords = [];
        var relationInfoS = angular.copy($scope.dbDataTable.rows);
        angular.forEach(relationInfoS, function (r, index) {
            if (angular.equals(row, r)) {
                if (row['id']) {
                    persistentRecords.push(row);
                } else {
                    transientRecords.push(row);
                }
                $scope.dbDataTable.rows.splice(index, 1);
            }
        });
    };
}