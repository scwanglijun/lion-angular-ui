'use strict';
var DBApp = angular.module('DBApp');//加载模块
DBApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        //Metronic.initAjax();
    });
});

