/**
 * Created by ziv.hung on 16/3/15.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("productEntryCtrl", ['$scope', '$modal', 'dbUtils', ProductEntryCtrl]);

function ProductEntryCtrl($scope, $modal, dbUtils) {
    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 3
            },
            fields: [
                {name: "publishOrgName", label: "发布机构", type: "orgTree", required: true, placeholder: "点击选择发布机构", readonly: true, labelCols: "3"},
                {name: "keyWord", label: "关键字", type: "text", placeholder: "产品代码/名称", labelCols: "3"}
            ]
        },
        grid: {
            settings: {
                transCode: "productPage",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: false
            },
            header: [
                {name: "发行机构", width: "18%", field: "publishOrgName"},
                {name: "产品代码", width: "15%", field: "productCode"},
                {name: "产品名称", width: "18%", field: "productName"},
                {name: "产品分类", width: "15%", field: "productType_"},
                {name: "风险评级", width: "15%", field: "riskAssessment"},
                {name: "投放额度（元）", width: "15%", field: "amountLimits"}
            ],
            rowOperation: {show: false}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "productType_Format": function (value, row) {
                    return row['productType'] + "/" + row['productSubType'];
                },
                "auditStatusColor": function (value, currentRecord) {
                    var color = "red";
                    value == "不通过" ? color : color = "green";
                    return color;
                },
                "productNameClick": function (currentRecord) {
                    viewDetail(currentRecord);
                }
            },
            operationEvents: [{
                name: "新增", class: "btn-primary", icon: "luru", click: function () {
                    openModal();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};


    //机构树选择后的回调事件
    $scope.dbOrgTree = {settings: {noCache: true, showDivision: true, showDepartment: false}};
    $scope.dbOrgTree.onOrgSelected = function (item) {
        $scope.dbFormGrid.setFormDataField("publishOrgName", item['orgName']);
        $scope.dbFormGrid.setFormDataField("publishOrgCode", item['orgCode']);
    };

    function openModal(source) {
        var instance = $modal.open({
            animation: true,
            templateUrl: 'db/db-form.html',
            controller: 'productEditCtrl',
            size: "lg",
            backdrop: "static",
            resolve: {
                source: function () {
                    return source;
                }
            }
        });
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }

    function viewDetail(source) {
        dbUtils.post("productGet", {id: source['id']}, function (data) {
            $modal.open({
                animation: true,
                templateUrl: 'views/product/productDetailView.html',
                controller: 'productDetailCtrl',
                size: "lg",
                backdrop: "static",
                resolve: {
                    source: function () {
                        return data;
                    }
                }
            });
        });
    }
}