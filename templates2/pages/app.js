/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var DBApp = angular.module("DBApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "db.components.grid",
    "db.components.form.grid",
    "db.components.data.table",
    "db.components.form",
    "db.components.form.fields",
    "db.components.orgTree",
    "db.components.resourceTree",
    "db.components.tree",
    "ui.select",
    "ngSanitize",
    "dbImService",
    "dbUtils",
    "ngAnimate",
    "toaster"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
DBApp.config(['$ocLazyLoadProvider', '$httpProvider', function ($ocLazyLoadProvider, $httpProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
    //添加请求头，防止后台无法判断是ajax请求
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
}]);

/* Setup Rounting For All Pages */
DBApp.config(['$stateProvider', '$urlRouterProvider', StateConfigController]);

/* Setup global settings */
DBApp.factory('settings', ['$rootScope', function ($rootScope) {
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
/*UI-SELECT多选框使用到的过滤器*/
DBApp.filter('selectPropsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            out = items;
        }
        return out;
    };
});

/* Setup App Main Controller */
DBApp.controller('AppController', ['$scope', '$rootScope', AppController]);

function AppController($scope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
DBApp.controller('HeaderController', ['$scope', '$window', '$http', '$state', 'dbUtils', function ($scope, $window, $http, $state, dbUtils) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });

    var loginName = $window.sessionStorage.getItem("loginName");
    $scope.loginName = loginName;
    $scope.logout = function () {
        dbUtils.confirm("确定退出系统吗?", function () {
            $http.post("../logout.do", {}).success(function (data, status, headers, config) {
                $window.sessionStorage.setItem("loginName", "");
                $window.location.href = "../";//退出后直接返回主页
            });
        });
    }
    $scope.reBackIndex = function () {
        $state.go("dashboard");
    }
}]);

/* Setup Layout Part - Sidebar */
DBApp.controller('SidebarController', ['$scope', '$http', '$modal', '$window', '$state', function ($scope, $http, $modal, $window, $state) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($scope, $http, $modal, $window, $state); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
DBApp.controller('PageHeadController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
DBApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/**
 * 登录窗口控制器
 */
DBApp.controller('userLoginFormCtrl', ['$scope', '$http', 'dbUtils', '$modalInstance', '$window',
    function ($scope, $http, dbUtils, $modalInstance, $window) {

        $scope.data = {
            userName: null,
            password: null,
            validCode: null
        };
        //登录请求
        $scope.submitDialogForm = function (isValid) {
            $scope.submited = true;
            if (isValid) {
                Metronic.startPageLoading();
                var reqBody = angular.copy($scope.data);
                $http.post("../login.do", reqBody).success(function (data) {
                    Metronic.stopPageLoading();
                    var errorMsg = data["errorMsg"];
                    if (errorMsg != "") {
                        $scope.resetVerifyCode();
                        dbUtils.tip(errorMsg);
                    } else {
                        $window.sessionStorage.setItem("loginName", $scope.data.userName);
                        $modalInstance.close("success");
                    }
                }).error(function (data, status, headers, config) {
                    Metronic.stopPageLoading();
                    console.log(data);
                    dbUtils.tip("系统异常！");
                });
            }
        };

        $scope.verifyCodeUrl = "../verfyCode.do";
        $scope.resetVerifyCode = function () {
            $scope.verifyCodeUrl = $scope.verifyCodeUrl + "?d" + new Date();
        }

    }]);

function StateConfigController($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider.state('dashboard', {
        url: "/dashboard",
        views: {
            "mainContentContainer": { //mainContentContainer 对应页面上的ui-view值，用于指定view显示在哪个位置
                controller: "DashboardController", // 新加载的页面对应controller，需要确保值唯一
                templateUrl: "dashboard.html"//具体需要显示的页面URL路径
            }
        },
        data: {pageTitle: '应用管理系统'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                //在切换到这个view的时候需要先加载对应的js或其他文件，load当中可以放入数组加载多个文件
                return $ocLazyLoad.load(['DashboardController.js']);
            }]
        }
    }).state('securityUserList', {
        url: "/securityUserList",
        views: {
            "mainContentContainer": {
                controller: "userListCtrl",
                templateUrl: "views/security/userList.html"
            }
        },
        data: {pageTitle: '用户管理', pageSubTitle: '权限管理|用户管理——用户信息维护预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/security/userListCtrl.js', 'views/security/userEditorCtrl.js', 'views/security/changePwdCtrl.js']
                }]);
            }]
        }
    }).state('securityRoleList', {
        url: "/securityRoleList",
        views: {
            "mainContentContainer": {
                controller: "roleListCtrl",
                templateUrl: "views/security/roleList.html"
            }
        },
        data: {pageTitle: '角色管理', pageSubTitle: '权限管理|角色管理——系统角色信息维护预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true, files: ['views/security/roleListCtrl.js', 'views/security/roleEditorCtrl.js',
                        'views/security/authorizeUserCtrl.js', 'views/security/authorizeResourceCtrl.js',
                        'views/security/selectUserCtrl.js', 'views/security/selectResourceCtrl.js']
                }]);
            }]
        }
    }).state('security-resource-list', {
        url: "/security-resource-list",
        views: {
            "mainContentContainer": {
                controller: "resourceListCtrl",
                templateUrl: "views/security/resourceList.html"
            }
        },
        data: {pageTitle: '资源管理', pageSubTitle: '权限管理|资源管理——系统资源信息维护预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true, files: ['views/security/resourceListCtrl.js', 'views/security/resourceEditorCtrl.js']
                }]);
            }]
        }
    }).state('resourceEntry', {
        url: "/resourceEntry",
        views: {
            "mainContentContainer": {
                controller: "resourceEntryCtrl",
                templateUrl: "db/db-form.html"
            }
        },
        data: {pageTitle: '资源录入', pageSubTitle: '权限管理|资源录入——资源信息维护录入'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    serie: true,
                    files: ['views/security/resourceEntryCtrl.js']
                });
            }]
        }
    }).state('resourceModify', {
        url: "/resourceModify",
        views: {
            "mainContentContainer": {
                controller: "resourceModifyCtrl",
                templateUrl: "views/security/resourceModifyView.html"
            }
        },
        data: {pageTitle: '资源修改', pageSubTitle: '权限管理|资源修改——系统资源信息维护预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true, files: ['views/security/resourceModifyCtrl.js']
                }]);
            }]
        }
    }).state('securityImList', {
        url: "/securityImList",
        views: {
            "mainContentContainer": {
                controller: "imCodeCtrl",
                templateUrl: "views/im/imCodeTypeList.html"
            }
        },
        data: {pageTitle: '字典管理', pageSubTitle: '权限管理|字典管理——系统枚举分类以及字典项维护预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/im/imCodeTypeListCtrl.js', 'views/im/imCodeTypeEditorCtrl.js', 'views/im/imCodeListEditorCtrl.js']
                }]);
            }]
        }
    }).state('formTest', {
        url: "/formTest",
        views: {
            "mainContentContainer": {
                controller: "formCtrl",
                templateUrl: "views/form/form.html"
            }
        },
        data: {pageTitle: '示例代demo', pageSubTitle: 'db-condition-grid,db-form结合的例子'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/form/form.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('tree-test', {
        url: "/tree-test",
        views: {
            "mainContentContainer": {
                controller: "treeCtrl",
                templateUrl: "views/form/tree.html"
            }
        },
        data: {pageTitle: 'tree', pageSubTitle: 'tree test'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{files: ['views/form/tree.js']}]);
            }]
        }
    }).state('departmentEntry', {
        url: "/departmentEntry",
        views: {
            "mainContentContainer": {
                controller: "departmentEntryCtrl",
                templateUrl: "views/organization/departmentEntryView.html"
            }
        },
        data: {pageTitle: '部门录入', pageSubTitle: '部门管理|部门录入——部门信息维护录入'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/organization/departmentEntryCtrl.js',
                        'views/organization/departmentEditorCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('departmentModify', {
        url: "/departmentModify",
        views: {
            "mainContentContainer": {
                controller: "departmentModifyCtrl",
                templateUrl: "views/organization/departmentModifyView.html"
            }
        },
        data: {pageTitle: '部门修改', pageSubTitle: '部门管理|部门修改——部门信息维护编辑'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/organization/departmentModifyCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('departmentDisable', {
        url: "/departmentDisable",
        views: {
            "mainContentContainer": {
                controller: "departmentDisableCtrl",
                templateUrl: "views/organization/departmentDisableView.html"
            }
        },
        data: {pageTitle: '部门停用', pageSubTitle: '部门管理|部门停用——部门信息停止使用'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/organization/departmentDisableCtrl.js']);
            }]
        }
    }).state('departmentSearch', {
        url: "/departmentSearch",
        views: {
            "mainContentContainer": {
                controller: "departmentSearchCtrl",
                templateUrl: "views/organization/departmentSearchView.html"
            }
        },
        data: {pageTitle: '部门查询', pageSubTitle: '部门管理|部门查询——部门信息预览查询'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/organization/departmentSearchCtrl.js']);
            }]
        }
    }).state('departmentMigration', {
        url: "/departmentMigration",
        views: {
            "mainContentContainer": {
                controller: "departmentMigrationCtrl",
                templateUrl: "views/organization/departmentMigrationView.html"
            }
        },
        data: {pageTitle: '部门迁移', pageSubTitle: '部门管理|部门迁移——部门架构变更迁移'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/organization/departmentMigrationCtrl.js']);
            }]
        }
    }).state('talentEntry', {
        url: "/talentEntry",
        views: {
            "mainContentContainer": {
                controller: "talentEntryCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人才招聘', pageSubTitle: '人才管理|人才招聘——人才信息维护录入'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/talentEntryCtrl.js', 'views/role/talentDetailCtrl.js', 'views/role/talentEditorCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('talentModify', {
        url: "/talentModify",
        views: {
            "mainContentContainer": {
                controller: "talentModifyCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人才修改', pageSubTitle: '人才管理|人才修改——人才信息维护录入'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/talentModifyCtrl.js', 'views/role/talentEditorCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('talentInterview', {
        url: "/talentInterview",
        views: {
            "mainContentContainer": {
                controller: "talentInterviewCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人才面试', pageSubTitle: '人才管理|人才面试——人才面试结果信息维护'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/talentInterviewCtrl.js', 'views/role/talentInterviewViewCtrl.js', 'views/role/talentDetailCtrl.js']
                }]);
            }]
        }
    }).state('talentSearch', {
        url: "/talentSearch",
        views: {
            "mainContentContainer": {
                controller: "talentSearchCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人才查询', pageSubTitle: '人才管理|人才查询——人才信息查询预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/talentSearchCtrl.js', 'views/role/talentDetailCtrl.js']
                }]);
            }]
        }
    }).state('talentDeleted', {
        url: "/talentDeleted",
        views: {
            "mainContentContainer": {
                controller: "talentDeletedCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人才删除', pageSubTitle: '人才管理|人才删除——人才删除,注销'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/talentDeletedCtrl.js', 'views/role/talentDetailCtrl.js']
                }]);
            }]
        }
    }).state('partyRoleEntry', {
        url: "/partyRoleEntry",
        views: {
            "mainContentContainer": {
                controller: "partyRoleEntryCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: 'Role', pageSubTitle: '用户管理|角色管理'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/partyRoleEntryCtrl.js', 'views/role/partyRoleEditorCtrl.js', 'views/role/selectPartyRoleCtrl.js',
                        'views/role/partyRoleDetailCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('partyRoleModify', {
        url: "/partyRoleModify",
        views: {
            "mainContentContainer": {
                controller: "partyRoleModifyCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人员修改', pageSubTitle: '人员管理|人员修改——人员信息维护编辑'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/role/partyRoleModifyCtrl.js', 'views/role/partyRoleEditorCtrl.js', 'views/role/selectPartyRoleCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('partyRoleSearch', {
        url: "/partyRoleSearch",
        views: {
            "mainContentContainer": {
                controller: "partyRoleSearchCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人员查询', pageSubTitle: '人员管理|人员查询——人员信息预览查询'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/role/partyRoleSearchCtrl.js',
                    'views/role/partyRoleDetailCtrl.js']);
            }]
        }
    }).state('partyRoleQuit', {
        url: "/partyRoleQuit",
        views: {
            "mainContentContainer": {
                controller: "partyRoleQuitCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: 'Role', pageSubTitle: '用户管理|角色管理'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/role/partyRoleQuitCtrl.js',
                    'views/role/partyRoleDetailCtrl.js']);
            }]
        }
    }).state('partyRoleTransfer', {
        url: "/partyRoleTransfer",
        views: {
            "mainContentContainer": {
                controller: "partyRoleTransferCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '人员调动', pageSubTitle: '人员管理|人员调动——人员职位变动调配'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/role/partyRoleTransferCtrl.js',
                    'views/role/partyRoleDetailCtrl.js']);
            }]
        }
    }).state('partyRoleImageManage', {
        url: "/partyRoleImageManage",
        views: {
            "mainContentContainer": {
                controller: "partyRoleImageManageCtrl",
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '影像管理', pageSubTitle: '人员管理|影像管理——人员影像信息维护'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['views/role/partyRoleImageManageCtrl.js',
                    'views/role/partyRoleDetailCtrl.js']);
            }]
        }
    }).state('divisionEntry', {
        url: "/divisionEntry",
        views: {
            "mainContentContainer": {
                controller: "divisionEntryCtrl",
                templateUrl: "db/db-form.html"
            }
        },
        data: {pageTitle: '机构录入', pageSubTitle: '机构管理|机构录入——机构信息维护录入'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    serie: true,
                    files: ['views/organization/divisionEntryCtrl.js', Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                });
            }]
        }
    }).state('divisionModify', {
        url: "/divisionModify",
        views: {
            "mainContentContainer": {
                controller: "divisionModifyCtrl",
                templateUrl: "views/organization/divisionModifyView.html"
            }
        },
        data: {pageTitle: '机构修改', pageSubTitle: '机构管理|机构修改——机构信息维护修改'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    serie: true,
                    files: ['views/organization/divisionModifyCtrl.js', Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                });
            }]
        }
    }).state('divisionSearch', {
        url: "/divisionSearch",
        views: {
            "mainContentContainer": {
                controller: "divisionSearchCtrl",
                templateUrl: "views/organization/divisionSearchView.html"
            }
        },
        data: {pageTitle: '机构查询', pageSubTitle: '机构管理|机构查询——机构信息预览查询'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/organization/divisionSearchCtrl.js']
                }]);
            }]
        }
    }).state('divisionMigration', {
        url: "/divisionMigration",
        views: {
            "mainContentContainer": {
                controller: "divisionMigrationCtrl",
                templateUrl: "views/organization/divisionMigrationView.html"
            }
        },
        data: {pageTitle: '机构迁移', pageSubTitle: '机构管理|机构迁移——机构架构变更迁移'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/organization/divisionMigrationCtrl.js']
                }]);
            }]
        }
    }).state('flowTemplateEntry', {
        url: "/flowTemplateEntry",
        views: {
            "mainContentContainer": {
                controller: 'flowTemplateEntryCtrl',
                templateUrl: 'views/workflow/flowTemplateEntryView.html'
            }
        },
        data: {pageTitle: '审核流程', pageSubTitle: '审核管理|审核流程——审核流程管理'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/workflow/flowTemplateEntryCtrl.js', 'views/workflow/flowTemplateEditorCtrl.js']
                }]);
            }]
        }
    }).state('businessFlowEntry', {
        url: "/businessFlowEntry",
        views: {
            "mainContentContainer": {
                controller: 'businessFlowEntryCtrl',
                templateUrl: 'views/workflow/businessFlowEntryView.html'
            }
        },
        data: {pageTitle: '审核流程', pageSubTitle: '审核管理|审核流程——业务信息审核结果操作'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/workflow/businessFlowEntryCtrl.js', 'views/workflow/businessFlowRefuseCtrl.js', 'views/workflow/businessFlowDetailsCtrl.js', Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('productEntry', {
        url: "/productEntry",
        views: {
            "mainContentContainer": {
                controller: 'productEntryCtrl',
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '产品录入', pageSubTitle: '产品管理|产品录入——新产品信息录入维护'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/product/productEntryCtrl.js', 'views/product/productEditCtrl.js', 'views/product/productDetailCtrl.js']
                }]);
            }]
        }
    }).state('productModify', {
        url: "/productModify",
        views: {
            "mainContentContainer": {
                controller: 'productModifyCtrl',

                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '产品修改', pageSubTitle: '产品管理|产品修改——产品信息变更维护'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/product/productModifyCtrl.js', 'views/product/productEditCtrl.js']
                }]);
            }]
        }
    }).state('productSearch', {
        url: "/productSearch",
        views: {
            "mainContentContainer": {
                controller: 'productSearchCtrl',
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '产品查询', pageSubTitle: '产品管理|产品查询——产品信息信息查询并预览'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/product/productSearchCtrl.js', 'views/product/productDetailCtrl.js']
                }]);
            }]
        }
    }).state('productRemove', {
        url: "/productRemove",
        views: {
            "mainContentContainer": {
                controller: 'productRemoveCtrl',
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '产品删除', pageSubTitle: '产品管理|产品删除——删除不符合或错误产品信息'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/product/productRemoveCtrl.js', 'views/product/productDetailCtrl.js']
                }]);
            }]
        }
    }).state('raisingPeriodEntry', {
        url: "/raisingPeriodEntry",
        views: {
            "mainContentContainer": {
                controller: 'raisingPeriodEntryCtrl',
                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '期次录入', pageSubTitle: '产品管理|期次录入——产品募集期次信息录入'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/product/raisingPeriodEntryCtrl.js', 'views/product/raisingPeriodEditCtrl.js',
                        'views/product/raisingPeriodDetailCtrl.js', 'views/product/selectProductCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    }).state('raisingPeriodModify', {
        url: "/raisingPeriodModify",
        views: {
            "mainContentContainer": {
                controller: 'raisingPeriodModifyCtrl',

                templateUrl: "db/db-form-grid.html"
            }
        },
        data: {pageTitle: '期次修改', pageSubTitle: '产品管理|期次修改——产品募集期次信息变更修改'},
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    files: ['views/product/raisingPeriodModifyCtrl.js', 'views/product/raisingPeriodEditCtrl.js', 'views/product/selectProductCtrl.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        Metronic.getAssetsPath() + 'global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js']
                }]);
            }]
        }
    });


}

/* Init global settings and run the app */
DBApp.run(["$rootScope", "settings", "$state", "$templateCache", function ($rootScope, settings, $state, $templateCache) {
    $rootScope.$state = $state; // state to be accessed from view
    $templateCache.put("db/db-form.html", "<div class='row'><db-form></db-form></div>");
    $templateCache.put("db/db-form-grid.html", "<div class='row'><db-form-grid></db-form-grid></div>");

}]);
