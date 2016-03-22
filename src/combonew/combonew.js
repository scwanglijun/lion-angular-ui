/**
 * Created by 钟梦蝶 on 16/3/1.
 * @ngdoc directive
 * @name oneDropMenu
 * @module one.ui
 * @restrict E
 * @author mengdie.zhong@newtouch.cn
 * @description
 *
 * 下拉列表，所有属性均直接支持angularJS属性
 *
 * @usage
 * ```html
 *      <one-drop-menu></one-drop-menu>
 * ```
 * ```javascript
 *      var one = angular.module('one',['one.ui']);
 one.controller('AppController',['$scope',function($scope){
            $scope.menus =[
                "百度",
                "腾讯",
                "新浪",
                "搜狐"
            ];

        }]);
 * ```
 *
 */
(function (){
    'use strict';//进入‘严格模式’标志
    var uis = angular.module('one.ui', []);
    //定义默认配置信息
    uis.constant('oneDropMenuConfig', {});
    //定义自定义指令
    uis.directive('oneDropMenu',['oneDropMenuConfig',function(oneDropMenuConfig){
        return {
            restrict:'E',
            templateUrl: "one/dropMenu.tpl.html",
            replace:true,
            transclude:true,
            scope:{
                menus:'=ngModel'
            },
            link: function (scope, element,attr) {
                scope.one = scope.one||{};
                scope.one.ui = scope.one.ui ||{};
                scope.one.ui.dropMenu = {};
                scope.one.ui.dropMenu.menus = scope.menus;
                scope.one.ui.dropMenu.showContent = false;
                scope.one.ui.dropMenu.showMenu = function showMenu(){
                    var input = element.find('input');
                    var ul = element.find("ul");
                    var li = element.find("li");
                    scope.one.ui.dropMenu.showContent = !scope.one.ui.dropMenu.showContent;
                    if(scope.one.ui.dropMenu.showContent){
                        input.addClass("one_ui_dropMenu_bottom_corner");
                        //获取下拉框中的值
                    }else{
                        input.removeClass("one_ui_dropMenu_bottom_corner");
                    }
                };
                scope.one.ui.dropMenu.showData = function(t){
                    var input = element.find('input');
                    var ul = element.find("ul");
                    input.val(t.menu);
                }
            }
        }
    }]);
})();
//添加html模板
angular.module("one.ui").run(["$templateCache", function ($templateCache) {
    $templateCache.put("one/dropMenu.tpl.html",
        "<div class=\"one_ui_dropMenu\"  ng-click=\"one.ui.dropMenu.showMenu()\">" +
        "<input type=\"text\" placeholder=\"请选择\" readonly>" +
        "<ul class=\"one_ui_dropMenu_select\" ng-show=\"one.ui.dropMenu.showContent\">" +
        "<li ng-repeat=\"menu in one.ui.dropMenu.menus\" ng-click=\"one.ui.dropMenu.showData(this)\">{{menu}}</li>" +
        "</ul>" +
        "</div>");
}
]);