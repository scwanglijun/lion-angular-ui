/**
 * Created by ziv.hung.
 * 管理人员 CRUD
 * v1.0.0 15/10/15
 */
var DBApp = angular.module('DBApp');

DBApp.controller("selectResourceCtrl", ['$scope', 'dbUtils', 'role', '$modalInstance', SelectResourceCtrl]);

function SelectResourceCtrl($scope, dbUtils, role, $modalInstance) {

    //!!formGridOptions-START!!
    var formGridOptions = {
        form: {
            settings: {
                cols: 1,
                showClose: true
            },
            fields: [
                {"name": "keyWord", "label": "关键字", "type": "text", "placeholder": "资源名称", "labelCols": "2", cols: 8}
            ],
            modalClose: function () {
                $modalInstance.dismiss("cancer");
            }
        },
        grid: {
            settings: {
                transCode: "9204",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {"name": "资源类型", "width": "20%", "field": "type"},
                {"name": "资源名称", "width": "25%", "field": "resourceName"},
                {"name": "资源URL", "width": "20%", "field": "url"},
                {"name": "权限识别码", "width": "15%", "field": "permission"},
                {"name": "创建时间", "width": "20%", "field": "firstInsert"}
            ],
            rowOperation: {show: false, width: "10%"}
        }
    }
    //!!formGridOptions-END!!

    var formGridEvents = {
        grid: {
            operationEvents: [{
                "name": "确定授权", "class": "btn-primary", icon: "daochuuexport", "click": function () {
                    authorizeResources();
                }
            }]
        }
    };

    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents};

    function authorizeResources() {
        $scope.dbFormGrid.operationButtonClick(function (selectRows) {
            if (selectRows.length === 0) {
                return;
            }
            dbUtils.post("9121", {"roleId": role['id'], "reqVoList": selectRows}, function (respS) {
                var msgS = "";
                angular.forEach(respS, function (resp) {
                    msgS += "</br>资源名称【" + resp['resourceName'] + "】</span>";
                });
                if (msgS) {
                    dbUtils.warning("本次授权资源【" + selectRows.length + "】个。<br>失败：" + (respS.length) + "个" + msgS + "<br>原因：已存在。<br> 成功：" + (selectRows.length - respS.length) + "个。");
                } else {
                    dbUtils.success("本次授权资源【" + selectRows.length + "】个。<br> 成功：" + (selectRows.length) + "个。");
                }
                $modalInstance.close();
            }, function (error) {
                dbUtils.error(error);
            });
        });
    };
}