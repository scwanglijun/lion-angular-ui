/**
 * Created by ziv.hung on 16/2/2.
 */
var DBApp = angular.module("DBApp")

DBApp.controller('talentDeletedCtrl', ['$scope', '$modal', TalentDeletedCtrl]);

function TalentDeletedCtrl($scope, $modal) {


    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 3
            },
            fields: [
                {name: "recommendOrgName", label: "推荐机构", type: "orgTree", required: true, placeholder: "推荐机构名称", readonly: true, labelCols: "3"},
                {name: "status", label: "状态", type: "select", dropDownItemType: "json", dropDownItem: "talentStatus", labelCols: "3"},
                {name: "recruitmentNo", label: "招聘编号", type: "text", labelCols: "3"}
            ]
        },
        grid: {
            settings: {
                transCode: "talentPage",
                autoLoad: true,
                page: {pageSize: 10},
                showCheckBox: true
            },
            header: [
                {name: "招聘编号", width: "10%", field: "recruitmentNo"},
                {name: "姓名", width: "10%", field: "name"},
                {name: "推荐机构", width: "10%", field: "recommendOrgName"},
                {name: "状态", width: "10%", field: "status"},
                {name: "性别", width: "10%", field: "gender"},
                {name: "出生日期", width: "10%", field: "birthDate"},
                {name: "证件号码", width: "10%", field: "credentialNo"},
                {name: "学历", width: "10%", field: "educationalHistory"},
                {name: "户口属性", width: "10%", field: "accountType"},
                {name: "求职意向", width: "10%", field: "jobIntention"}
            ],
            rowOperation: {show: false}
        }
    };
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "statusColor": function (value) {
                    var color = "green";
                    if (value == "待面试") {
                        color = "#B0B6C3"
                    } else if (value == "待审核") {
                        color = "red"
                    } else if (value == "待入职") {
                        color = "red"
                    } else if (value == "已入职") {
                        color = "red"
                    }
                    return color;
                },
                "recruitmentNoClick": function (currentRecord) {
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
    $scope.dbOrgTree = {settings: {noCache: true, showDepartment: false}};
    $scope.dbOrgTree.onOrgSelected = function (item) {
        console.log(item);
        $scope.dbFormGrid.setFormDataField("recommendOrgName", item['orgNamePath']);
        $scope.dbFormGrid.setFormDataField("recommendOrgId", item['orgId']);
    };

    /**
     * 查看人员详细信息
     * @param currentRecord
     */
    function viewDetail(source) {
        $modal.open({
            animation: true,
            templateUrl: 'views/roles.json/talentDetailView.html',
            controller: 'talentDetailCtrl',
            size: "lg",
            backdrop: "static",
            resolve: {
                source: function () {
                    return source;
                }
            }
        });
    }

    /**
     * 招聘人才删除操作
     */
    function remove() {
        var selectRows = $scope.dbFormGrid.getAllSelectRows();
        if (selectRows.length === 0) {
            return;
        }
        var ids = dbUtils.getFieldArray(selectRows, "id");
        dbUtils.confirm("确定要对所选招聘人才进行<span style='color: red'>删除</span>操作?", function () {
            dbUtils.post('talentDelete', {'ids': ids}, function () {
                dbUtils.success("招聘人才批量删除成功!");
                $scope.dbFormGrid.reLoadData();
            }, function (error) {
                dbUtils.error("招聘人才批量删除异常!" + error);
            });
        });
    }
}