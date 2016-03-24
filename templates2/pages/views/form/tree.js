/**
 * Created by 阳葵 on 15/11/21.
 */
var DBApp = angular.module('DBApp');
DBApp.controller("treeCtrl", ['$scope', '$modal', 'dbUtils', TreeCtrl]);

function TreeCtrl($scope, $modal, dbUtils) {
    $scope.dbTree = {
        setting: {},
        data: [{
            text: "总公司",
            opened: true,
            disabled: false,
            selected: false,
            children: [{
                text: "上海分公司",
                disabled: false,
                selected: false,
                children: [{
                    text: "浦东中支公司",
                    disabled: false,
                    selected: false,
                    children: [{
                        text: "浦东中支公司",
                        disabled: false,
                        selected: false,
                        children: []
                    }]
                }, {
                    text: "杨浦中支公司",
                    disabled: true,
                    selected: false,
                    children: []
                }, {
                    text: "青浦中支公司",
                    disabled: false,
                    selected: false,
                    children: []
                }, {
                    text: "黄埔中支公司",
                    disabled: false,
                    selected: false,
                    children: []
                }]
            }, {
                text: "部门管理",
                opened: false,
                disabled: false,
                selected: false,
                children: [{
                    text: "部门录入",
                    disabled: false,
                    selected: false,
                    children: []
                }, {
                    text: "部门修改",
                    disabled: false,
                    selected: false,
                    children: []
                }, {
                    text: "部门查询",
                    disabled: false,
                    selected: false,
                    children: []
                }, {
                    text: "部门停用",
                    disabled: false,
                    selected: false,
                    children: []
                }, {
                    text: "部门迁移",
                    disabled: false,
                    selected: false,
                    children: []
                }]
            }, {
                text: "独立菜单",
                disabled: false,
                selected: false,
                children: []
            }]}
        ]
    }

}
