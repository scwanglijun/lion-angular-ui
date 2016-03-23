/*基于bootstrap的tabs控件*/

/**
 * Created by xiang.wu on 16/3/1.
 * @ngdoc directive
 * @name tabs
 * @module lion.ui
 * @restrict E
 * @author xinag.wu@newtouch.cn
 * @description
 *
 * tabs
 *
 * @usage
 * ```html
 *      <tabs>
             <pane title="First Tab">
             <div style="margin-top: 20px;">This is the content of the first tab.</div>
             </pane>
             <pane title="Second Tab">
             <div style="margin-top: 20px;">This is the content of the second tab.</div>
             </pane>
        </tabs>
 * ```
 * ```javascript
 *      var lion = angular.module('lion',['lion.ui']);
 lion.controller('AppController',['$scope',function($scope){

        }]);
 * ```
 *
 */

angular.module('components', []).
directive('tabs', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: [ "$scope", function($scope) {
            var panes = $scope.panes = [];

            $scope.select = function(pane) {
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            }

            this.addPane = function(pane) {
                if (panes.length == 0) $scope.select(pane);
                panes.push(pane);
            }
        }],
        template:
        '<div class="tabbable">' +
        '<ul class="nav nav-tabs">' +
        '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
        '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
        '</li>' +
        '</ul>' +
        '<div class="tab-content" ng-transclude></div>' +
        '</div>',
        replace: true
    };
}).
directive('pane', function() {
    return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: { title: '@' },
        link: function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
        },
        template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
        replace: true
    };
})
