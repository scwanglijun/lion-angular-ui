/**
 * Created by ziv.hung on 16/1/6.
 */
var DBApp = angular.module('DBApp');

DBApp.controller("businessFlowEntryCtrl", ['$scope', '$window','dbImService','$modal','dbUtils', BusinessFlowEntryCtrl]);

function BusinessFlowEntryCtrl($scope,$window,dbImService,$modal,dbUtils) {
    //设置项，由插件生成。
    //!!formGridOptions-START!!
    var formGridOptions = {
        form:{
            settings: {
                cols: 2
            },
            fields:[
                    {name: "flowType", label:"业务类型", type: "select", dropDownItemType: "im", dropDownItem: "flowType", placeholder: "请选择业务审核流程类型", labelCols: "3"},
                    {name: "status", label: "审核状态", type: "select", dropDownItemType: "im", dropDownItem: "flowStatus", placeholder: "请选择审核状态", labelCols: "3"},
                    {name: "apply","label": "申请日期", "type": "dateRange", "labelCols": "3"},
                    {name: "audit","label": "审核日期", "type": "dateRange", "labelCols": "3"},
            ]
        },
        grid: {
            settings: {
                transCode: "businessFlowPage",
                autoLoad: true,
                showCheckBox: true
            },
            header: [
                {name: "业务类型", width: "10%", field: "flowType_name"},
                {name: "业务ID", width: "5%", field: "businessId"},
                {name: "业务描述", width: "10%", field: "desc"},
                {name: "所属部门", width: "5%", field: "deptName"},
                {name: "申请日期", width: "10%", field: "applyDate"},
                {name: "审批日期", width: "10%", field: "auditDate"},
                {name: "状态", width: "10%", field: "audit_status"},
                {name: "审批流程", width: "5%", field: "stepName"},
                {name: "审批人", width: "5%", field: "partyId"},
            ],
            rowOperation: {show: true, width: "17%"}
        }
    };
    //!!formGridOptions-END!!
    var formGridEvents = {
        grid: {
            fieldEvents: {
                "applyDateFormat":function(value,row){
                    if(value!=null){
                       return  value.substring(0,10);
                    }
                },
                "auditDateFormat":function(value,row){
                    if(value!=null){
                        return  value.substring(0,10);
                    }
                },
                "businessIdClick": function (row) {
                   //显示审核详细信息
                    detailsModal(row);
                },
                "descClick":function(row){
                    detailsModal(row);
                }
            },
            rowEvents: [
                {name:"同意",class:"btn-primary",
                    click:function(row){
                        auditFlow([row]);
                    }
                },
                {name:"拒绝",class:"btn-danger",
                    click:function(row){
                        refuseFlow([row]);
                    }
                }
            ],
            operationEvents: [
                {name: "Demo", class: "btn-primary", icon: "luru",
                    click: function (rows) {
                        console.log(rows);
                        auditDemo(rows);
                    }
                },
                {name: "提交审核", class: "btn-primary", icon: "luru",
                    click: function (rows) {
                        auditCommit(rows);
                    }
                },
                {name: "同意", class: "btn-primary", icon: "luru",
                    click: function (rows) {
                        auditFlow(rows);
                    }
                },
                {name:'拒绝',class:'btn-danger',icon:'luru',
                    click:function(rows) {
                        refuseFlow(rows);
                    }
                }
            ]
        }
    };
    //加载字典数据
    var gridLoadedFn=function(rows){
        angular.forEach(rows, function (row) {
            //业务审核类型
            dbImService.queryImCode(null, 'flowType', function (dicts) {
                angular.forEach(dicts, function (dict) {
                    if (dict.value == row['flowType']) {
                        row['flowType_name'] = dict.name;
                    }
                })
            });
            //审核状态
            dbImService.queryImCode(null,'flowStatus',function(dicts){
                    angular.forEach(dicts,function(dict){
                        if(dict.value==row['status']){
                            row['audit_status']=dict.name;
                        }
                    });
            });
        });
    };
    //构建dbFromGrid
    $scope.dbFormGrid = {options: formGridOptions, events: formGridEvents,gridLoaded:gridLoadedFn};


    //显示详细审核流程
    //审核流程拒绝
    function detailsModal(businessFlow){

        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/workflow/businessFlowDetailsView.html',
            controller: 'businessFlowDetailsCtrl',
            size: "lg",
            backdrop: "static",
            resolve: {
                businessFlow: function () {
                    return businessFlow;
                }
            }
        });
        //加载
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }
    //产生Demo审核数据
    function auditDemo(rows){
        dbUtils.post('businessFlowDemo',{},function(data){
            dbUtils.success("审核数据生成成功!");
        });
    }

    //提交Demo到审核流程
    function auditCommit(rows){
        dbUtils.post('businessFlowAuditCommit',{},function(data){
            dbUtils.success("提交审核成功!");
        });
    }

    //审核流程进入通过的页面
    function auditFlow(rows){
        if(rows.length==0){
            dbUtils.warning("请选择要审核的记录");
            return;
        }
        dbUtils.post("businessFlowAuditFlow",{'dataVo':rows}, function () {
            dbUtils.success('业务审核成功!');
            $scope.dbFormGrid.reLoadData();
        });
    }
    //审核流程拒绝
    function refuseFlow(rows){
        refuseFlowModal(rows);
    }
    //审核流程拒绝
    function refuseFlowModal(flows){
        if(flows.length==0){
            dbUtils.warning("请选择要拒绝审核的记录");
            return;
        }
        var instance = $modal.open({
            animation: true,
            templateUrl: 'views/workflow/businessFlowRefuseView.html',
            controller: 'businessFlowRefuseCtrl',
            size: "md",
            backdrop: "static",
            resolve: {
                flows: function () {
                    return flows;
                }
            }
        });
        //加载
        instance.result.then(function () {
            $scope.dbFormGrid.reLoadData();
        });
    }
}