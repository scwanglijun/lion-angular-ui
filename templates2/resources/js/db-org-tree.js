/**
 * Created by kui.yang on 16/01/19.
 * dbOrgTree 指令
 * 1.功能说明:
 *      dbOrgTree  用于弹出模态窗口显示组织机构棵树.可以对这棵树进行选择和点击树上的节点,并按关键字进行搜索(默认显示搜索功能)
 * 2.使用方式:
 *      1. 在dbForm的field当中定义type值为orgTree即可
 *      2. 在HTML当中直接使用<db-org-tree></db-org-tree>
 * 3. js 定义示例
 *          在dbForm当中使用的话,示例如下.注意其中的type:orgTree值
 *          $scope.dbForm = {
                settings: {transCode: "divisionPage", cols: 3, showClose: false},
                title: {label: "组织机构"},
                sections: [{
                    sectionTitle: {show: true, icon: "jigou", label: "机构"},
                    fields: [{
                        name: "parentDivision",
                        label: "上级机构",
                        type: "orgTree",
                        required: true,
                        placeholder: "请选择上级机构",
                        readonly:true
                    }]
                }]
            };
        //实现定义一个对象
         $scope.dbOrgTree = {settings:{noCache:true,showDepartment:false}};
        //实现机构选中之后的回调事件
         $scope.dbOrgTree.onOrgSelected = function(item){
                var orgNamePath = item.orgNamePath;
                var orgId = item.orgId;
         }
4. 字段说明:
   4.1 返回的item字段说明
   {id:3,orgType:"DIVISION",orgName:"济南分公司",orgCode:"2001",orgId:3,orgNamePath:"总公司/山东公司/济南分公司",parentOrgId:2,parentOrgType:"DIVISION"},

    字段              说明
    id               数据库ID值
    orgType         机构类型:
                        DIVISION:组织机构
                        DEPARTMENT:部门
    orgName         机构名称
    orgCode         机构代码
    orgId           机构唯一键
    orgNamePath         机构路径
    parentOrgId     父级机构ID
    parentOrgType   父级机构类型

 4.2 settings 说明
        noCache             设置不使用缓存,默认树结构数据会本地缓存为false
        showSearch          是否显示搜索框,默认为显示
        showDivision        是否可以选择行政机构树,默认为可以
        showDepartment      是否可以选择部门树,默认为可以


5. 接口API 除了一下的接口之外,可以直接使用db-tree的API
        //选中某个机构值后触发的回调方法,需要调用方自己实现
    5.1 $scope.dbOrgTree.onOrgSelected(item);
    5.5 设置是否不使用缓存
        $scope.dbOrgTree.settings.noCache = true;


 */
'use strict';
var dbOrgTreeDirectives = angular.module('db.components.orgTree', ['dbUtils']);
dbOrgTreeDirectives.dbOrgTreeCaches = {};//机构树数据缓存对象
dbOrgTreeDirectives.directive('dbOrgTree', ['dbUtils',function(dbUtils){
    //dbOrgTree默认参数,针对settings值
    var options = {
        noCache:false,
        useCheckBox: false,//是否显示复选框
        showSearch:true,showDivision:true,showDepartment:true
    };

    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbOrgTree.html",
        replace: true,
        transclude: true,
        controller: ['$scope','$modal','$compile', function ($scope,$modal,$compile) {
            if (angular.isUndefined($scope.dbOrgTree)) {
                $scope.dbOrgTree = {settings:{}};
            }
            //替换默认值
            $scope.dbOrgTree.settings = angular.extend({}, options, $scope.dbOrgTree.settings);
            //弹出机构树查询界面
            $scope.dbOrgTree.selectOrg = function(fieldName){
                openOrgTreeModal(fieldName)
            };
            var orgTreeSearchSettings = $scope.dbOrgTree.settings;
            function openOrgTreeModal(fieldName){
                var instance = $modal.open({
                        controller: ['$scope','$modalInstance','field',function ($scope,$modalInstance,field) {
                            //确定按钮事件
                            $scope.closeModal = function(){
                                var selectedItem=$scope.dbTree.getSelectedItem();
                                //判断如果当前是部门选择时,无法选择机构
                                if(selectedItem&&$scope.dbOrgTreeSearch.queryForm.type.value!=selectedItem.orgType){
                                    return;
                                }
                                selectedItem.field = field;
                                //回调页面并关闭窗口
                                $modalInstance.close($scope.dbTree.getSelectedItem());
                            };
                            $scope.modalClose = function(){
                                $modalInstance.dismiss("cancel");
                            };
                            //默认设置显示搜索功能
                            $scope.dbOrgTreeSearch = {settings:orgTreeSearchSettings};

                        }],
                    templateUrl: 'dbOrgTreeModal_template.html',
                    size: "md",
                    backdrop: "static",
                    resolve:{
                        field:function(){
                          return {"name":fieldName};
                        }
                    }
                });

                instance.result.then(function (item) {
                    var fieldName = item.field.name;
                    //机构选择后回调调用方
                    if(!angular.isUndefined($scope.dbOrgTree.onOrgSelected)){
                        $scope.dbOrgTree.onOrgSelected(item,fieldName);
                    }
                });
                instance.rendered.then(function () {
                });
            }
        }],
        link: function (scope, element, attrs) {
            console.log("link dbOrgtree")
        }
    }
}]);
/**
 * 二  dbOrgTreeSearch 指令
 1.功能说明
    用于直接显示一个可以搜索的树结构,不是以模态窗口方式显示.
 2.使用方式
    在HTML当中直接使用<db-org-tree-search></db-org-tree-search>
 3.JS定义
     $scope.dbOrgTreeSearch = {settings:{showSearch:true}};
     noCache      设置不使用缓存,默认树结构数据会本地缓存 为false
     showSearch   是否显示搜索功能,默认为false
     showDivision 是否显示行政机构选项,默认为true
     showDepartment 是否显示部门选项,默认为false
 4. API
     //重新以当前条件加载树机构数据
     4.1 $scope.dbOrgTreeSearch.refreshTree()
*/
dbOrgTreeDirectives.directive('dbOrgTreeSearch', ['dbUtils',function(dbUtils){
    var settings = {
        noCache:false, showSearch:false,showDivision:true,showDepartment:false
    };
    return {
        restrict: 'E',
        templateUrl: Metronic.getResourcesPath() + "templates/dbOrgTreeSearch.html",
        replace: true,
        transclude: true,
        controller: ['$scope', function ($scope) {
            if (angular.isUndefined($scope.dbOrgTreeSearch)) {
                $scope.dbOrgTreeSearch = {settings:{}};
            }
            $scope.dbOrgTreeSearch.orgNamePaths = [];
            $scope.dbOrgTreeSearch.settings = angular.extend({},settings,$scope.dbOrgTreeSearch.settings);
            //获取树结构数据
            function doGetOrgTreeData(orgType){
                if(!angular.isUndefined(dbOrgTreeDirectives.dbOrgTreeCaches[orgType])&&!$scope.dbOrgTreeSearch.settings.noCache){
                    $scope.dbOrgTreeSearch.orgNamePaths = dbOrgTreeDirectives.dbOrgTreeCaches[orgType];
                    initDbOrgTree();
                }else{
                    dbUtils.post("organizationPathAll",{orgType:orgType},function(retval){
                        $scope.dbOrgTreeSearch.orgNamePaths = retval;
                        dbOrgTreeDirectives.dbOrgTreeCaches[orgType]=retval;
                        initDbOrgTree();
                    });
                }
            }
            function initDbOrgTree(){
                //构造树结构
                //1.查找root
                var root =null;
                angular.forEach($scope.dbOrgTreeSearch.orgNamePaths,function(item){
                    if(item.parentOrgId==null){
                        root = {text: item.orgName,orgId:item.orgId,attr:item,opened:true,iconClass:"icon-state-warning",treeId:item.orgId};
                        return false;
                    }
                });
                if(!root){
                    console.log("db-org-tree root is null");
                    return;
                }
                //2.递归循环所有节点,将节点加入到父节点当中
                function getChildren(parentOrgId){
                    var child = [];
                    var type = $scope.dbOrgTreeSearch.queryForm.type.value;

                    angular.forEach($scope.dbOrgTreeSearch.orgNamePaths,function(item){
                        if(item.parentOrgId==parentOrgId){
                            var o = {text: item.orgName,orgId:item.orgId,attr:item,children:[],iconClass:item.orgType=="DIVISION"?'icon-state-warning':'icon-state-success',treeId:item.orgId};
                            //当树是部门时,只有部门数据可以选择
                            if(type=="DEPARTMENT"){
                                o.canSelect = item.orgType!="DIVISION";
                            }else{
                                o.canSelect = true;
                            }
                            if(!o.canSelect){
                                o.iconClass='icon-state-default';
                            }
                            child.push(o);
                        }
                    });
                    angular.forEach(child,function(item){
                        item.children=getChildren(item.orgId);
                    });
                    return child;
                }

                //生成树结构数据
                root.children = getChildren(root.orgId);
                //渲染树结构
                if($scope.dbTree){
                    $scope.dbTree.setData([root]);
                }else{
                    $scope.dbTree = {
                        data:[root]
                    }
                }
            }

            //
            $scope.dbOrgTreeSearch.queryForm = {
                type:null,
                keyWord:null
            };
            $scope.dbOrgTreeSearch.typeSelects = [];
            if($scope.dbOrgTreeSearch.settings.showDivision){
                $scope.dbOrgTreeSearch.queryForm.type = {"name":"行政机构","value":"DIVISION"};
                $scope.dbOrgTreeSearch.typeSelects.push({"name":"行政机构","value":"DIVISION"});
            }

            if($scope.dbOrgTreeSearch.settings.showDepartment){
                if( $scope.dbOrgTreeSearch.queryForm.type==null){
                    $scope.dbOrgTreeSearch.queryForm.type = {"name":"部门科室","value":"DEPARTMENT"};
                }
                $scope.dbOrgTreeSearch.typeSelects.push({"name":"部门科室","value":"DEPARTMENT"});
            }

            doGetOrgTreeData($scope.dbOrgTreeSearch.queryForm.type.value);
            //切换查询类型
            $scope.dbOrgTreeSearch.changeQueryType=function(item,model){
                doGetOrgTreeData(item.value);
            };

            //搜索的数据来源
            $scope.dbOrgTreeSearch.searchDataSource = [];
            //输入关键字时进行匹配
            $scope.dbOrgTreeSearch.refreshDataSource = function(search){
                if(search==""){
                    $scope.dbOrgTreeSearch.searchDataSource=[];
                    return ;
                }
                var retval = [];
                angular.forEach($scope.dbOrgTreeSearch.orgNamePaths,function(item){
                    var path = item.orgNamePath;
                    if(path.indexOf(search)>-1){
                        retval.push(item);
                    }
                });
                $scope.dbOrgTreeSearch.searchDataSource=retval;
            };
            //当前选择某个搜索结果下拉框的值时触发的事件
            $scope.dbOrgTreeSearch.queryOnSelect=function(item,model){
                $scope.dbTree.setItemSeleted({text: item.orgName,orgId:item.orgId,treeId:item.orgId,attr:item,children:[]});
            };
            //重新以当前条件加载树机构数据
            $scope.dbOrgTreeSearch.refreshTree = function(){
                doGetOrgTreeData($scope.dbOrgTreeSearch.queryForm.type.value);
            };

        }],

        link: function (scope, element, attrs) {
            console.log("link dbOrgTreeSearch")
        }
    }
}]);
