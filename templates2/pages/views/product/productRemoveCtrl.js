/**
 * Created by ziv.hung on 16/3/15.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("productRemoveCtrl", ['$scope', '$modal', 'dbUtils', ProductRemoveCtrl]);

function ProductRemoveCtrl($scope, $modal, dbUtils) {
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
                transCode: "productRemovePage",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: true
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
                "auditStatusColor": function (value) {
                    var color = "red";
                    value == "不通过" ? color : color = "green";
                    return color;
                },
                "productNameClick": function (currentRecord) {
                    viewDetail(currentRecord);
                }
            },
            operationEvents: [{
                name: "删除", class: "btn-danger", icon: "shanchu", click: function () {
                    remove();
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

    function viewDetail(source) {
        dbUtils.post("productRemoveGet", {id: source['id']}, function (data) {
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

    /**
     * 批量删除操作
     */
    function remove() {
        var selectRows = $scope.dbFormGrid.getAllSelectRows();
        if (selectRows.length === 0) {
            return;
        }
        var ids = dbUtils.getFieldArray(selectRows, "id");
        dbUtils.confirm("对所选产品进行<span style='color: red'>删除</span>操作,一并会删除对应<span style='color: red'>募集期数据</span>;确定要执行此操作?", function () {
            dbUtils.post('productDelete', {'ids': ids}, function () {
                dbUtils.success("产品删除操作成功！!");
                $scope.dbFormGrid.reLoadData();
            }, function (error) {
                dbUtils.error("产品删除操作异常!" + error);
            });
        });
    }

}