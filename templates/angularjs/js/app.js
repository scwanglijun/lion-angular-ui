/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);


/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);


/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);


/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });

    $scope.menus = [{
        "name":"控制面板","icon":"home","url":"#/dashboard.html","show":true
    },{
        "name":"系统设置","icon":"settings","open":"","show":true,
        "subList":[
            {"name":"用户管理","icon":"star","open":"open","show":true,"subList":[{"name":"角色管理","icon":"star","url":"#/system/role/role.html"},{"name":"用户组管理","icon":"star"},{"name":"用户管理","icon":"star",}]},
            {"name":"编码管理","icon":"star","open":"","show":true,"subList":[{},{}]},
            {"name":"部门管理","icon":"star","open":"","show":true,"url":"#/system/department/department.html"},
            {"name":"图标管理","icon":"star","open":"","show":true,"url":"#/system/icon/icon.html"}
        ]
    },{
        "name": "账户管理", "icon": "user","open":"","show":true,
        "subList": [
            {"name": "个人资料", "icon": "user", "url": "","open":"","show":true,},
            {"name": "待办事项", "icon": "calendar", "url": "","open":"","show":true,},
            {"name": "通知消息", "icon": "bell", "url": "","open":"","show":true,}
        ]
    }];
}]);

MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);


//配置路由
MetronicApp.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
   
   $urlRouterProvider.otherwise('/dashboard.html');

   $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'}
        });
}]);

