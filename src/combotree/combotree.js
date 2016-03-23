/**
 * Created by xiang.wu on 16/3/1.
 * @ngdoc directive
 * @name lionCombotree
 * @module lion.ui
 * @restrict EA
 * @author xinag.wu@newtouch.cn
 * @description
 *
 * 下拉列表，所有属性均直接支持angularJS属性
 *
 * @usage
 * ```html
 *      <lion-combotree placeholder="请选择列表项" resources="typecombox.json"></lion-combotree>
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
    uis.constant('lionCombotreeConfig', {});
    //定义自定义指令
    uis.directive('lionCombotree',['lionCombotreeConfig','$http',function(lionCombotreeConfig,$http){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            controller: [ "$scope", function($scope) {

            }],
            template:
            '<div class="btn-group lion-combotree bootstrap-select form-control">'+
            '<button class="btn form-control dropdown-toggle" ng-click="showContent()">'+
            '<span class="pull-left">{{placeholer}}</span>'+
            '<i class="caret"></i>'+
            '</button>'+
            '<div class="content" ng-transclude ng-show="lion.showContent"></div>'+
            '</div>',
            link: function (scope,element,attrs) {
                scope.placeholer = attrs.placeholder;
                scope.lion = scope.lion||{};
                scope.lion.showContent = false;
                scope.showContent = function () {
                    scope.lion.showContent = !scope.lion.showContent;
                };
            }
        }
    }])

    /*.directive('lionCombotreeContent',function () {
        return {
            require: '^lionCombotree',
            restrict: 'E',
            transclude: true,
            scope: { title: '@' },
            link: function(scope, element, attrs, lionCombotreeController) {
               //lionCombotreeController.addPane(scope);
            },
            templateUrl:'lionCombotreeTpl.html',
            replace: true
        };
    });*/
})();
