/**
 * Created by ziv.hung.
 * 授权用户资源
 * v1.0.0 15/11/2
 */

var DBApp = angular.module('DBApp');

DBApp.controller("selectUserCtrl", ['$scope', 'dbUtils', 'role', '$modalInstance', SelectUserCtrl]);

function SelectUserCtrl($scope, dbUtils, role, $modalInstance) {


    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "登陆用名/真实姓名/联系电话", "labelCols": "2", cols: 8}
            ]
        },
        grid: {
            settings: {
                transCode: "preAuthorizedUsers",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {"name": "登陆用名", "width": "10%", "field": "loginName"},
                {"name": "真实姓名", "width": "10%", "field": "name"},
                {"name": "联系电话", "width": "10%", "field": "mobile"},
                {"name": "电子邮件", "width": "20%", "field": "email"},
                {"name": "直属机构", "width": "20%", "field": "orgName"},
                {"name": "创建时间", "width": "12%", "field": "firstInsert"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    }
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            operationEvents: [{
                name: "确定授权", class: "btn-primary", icon: "daochuuexport", click: function () {
                    authorize();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    function authorize() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.confirm("确定授权选中职员吗？", function () {
                dbUtils.post("9111", {"roleCode": role['code'], "reqVoList": selectRows}, function (respS) {
                    var msgS = "";
                    angular.forEach(respS, function (resp) {
                        msgS += "</br><span style='color: red'>人员姓名【" + resp['userName'] + "】</span>";
                    });
                    if (msgS) {
                        dbUtils.info("本次授权人员【" + selectRows.length + "】个。<br>失败：" + (respS.length) + "个" + msgS + "<br>原因：已存在。<br> 成功：" + (selectRows.length - respS.length) + "个。");
                    } else {
                        dbUtils.success("本次授权人员【" + selectRows.length + "】个。<br> 成功：" + (selectRows.length) + "个。");
                    }
                    $modalInstance.close();
                }, function () {
                    dbUtils.error(error);
                });
            });
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    }
}