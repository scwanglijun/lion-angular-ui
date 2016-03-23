/**
 * Created by xiang.wu on 16/3/1.
 * @ngdoc directive
 * @name lionCombonew
 * @module lion.ui
 * @restrict EA
 * @author xinag.wu@newtouch.cn
 * @description
 *
 * 下拉列表，所有属性均直接支持angularJS属性
 *
 * @usage
 * ```html
 *      <lion-combonew placeholder="请选择列表项" resources="typecombox.json"></lion-combonew>
 * ```
 * ```javascript
 *      var lion = angular.module('lion',['lion.ui']);
 lion.controller('AppController',['$scope',function($scope){

        }]);
 * ```
 *
 */
(function (){
    'use strict';//进入‘严格模式’标志
    var uis = angular.module('lion.ui', []);
    //定义默认配置信息
    uis.constant('lionCombonewConfig', {});
    //定义自定义指令
    uis.directive('lionCombonew',['lionCombonewConfig','$http',function(lionCombonewConfig,$http){
        return {
            restrict:'EA',
            templateUrl: "lionCombonewTpl.html",
            replace:true,
            transclude:true,
            scope:{
                menus:'=ngModel'
            },
            link: function (scope, element,attr) {
                scope.lion = scope.lion||{};
                scope.lion.ui = scope.lion.ui ||{};
                scope.lion.ui.dropMenu = {};
                $http.get(attr.resources).success(function(data){
                    scope.lion.ui.dropMenu.menus = data;
                });
                scope.lion.ui.dropMenu.placeholder = attr.placeholder;
                scope.lion.ui.dropMenu.showContent = false;
                scope.lion.ui.dropMenu.close = false;
                scope.lion.ui.dropMenu.showMenu = function showMenu(){
                    scope.lion.ui.dropMenu.showContent = !scope.lion.ui.dropMenu.showContent;
                };
                scope.lion.ui.dropMenu.showData = function(t){
                    var txt = element.find('span');
                    txt[0].innerHTML = t.menu.nameZh;
                    scope.lion.ui.dropMenu.showContent = !scope.lion.ui.dropMenu.showContent;
                    scope.lion.ui.dropMenu.close = true;
                }

                scope.lion.ui.dropMenu.clearData = function () {
                    var txt = element.find('span');
                    txt[0].innerHTML = attr.placeholder;
                    scope.lion.ui.dropMenu.showContent = false;
                    scope.lion.ui.dropMenu.close = false;
                }
            }
        }
    }]);
})();
