angular.module('app').directive("lionDataGrid",function($http){
    return{
        restrict: 'E',
        controller:function($scope){
            this.setEditor=function(editor){
                $scope.cols.unshift(editor);
            };
            this.setColumns=function(cols){
                $scope.cols=cols;
            };
        },
        link: function (scope,element,attributes) {
            $http.get(attributes.resource).success(function(response){
                scope.rows = response.data;
                scope.$broadcast('ready-to-render',scope.rows,scope.cols);
            });
        }
    };
});
angular.module('app').directive("gridColumns",[function(){
    return{
        restrict: 'E',
        require:['^lionDataGrid','gridColumns'],
        controller:function(){
            var columns = [];
            this.addColumn = function(col){
                columns.push(col);
            };
            this.getColumns = function(){
                return columns;
            };
        },
        link: function (scope, element, attributes,controllers) {
            var lionDataGridController = controllers[0];
            var gridColumnsController = controllers[1];
            lionDataGridController.setColumns(gridColumnsController.getColumns());
        }
    };
}]);
angular.module('app').directive("gridColumn",[function(){
    return{
        restrict: 'E',
        require:'^gridColumns',
        link: function (scope,element,attributes,gridColumnsController) {
            gridColumnsController.addColumn({
                title:attributes.title,
                field:attributes.field
            });
        }
    };
}]);
angular.module('app').directive("grid",[function(){
    return{
        restrict: 'E',
        templateUrl:"templates/as_table.html",
        replace:true,
        controller:function($scope){
            $scope.$on('ready-to-render',function(e,rows,cols){
                $scope.rows = rows;
                $scope.cols = cols;
            });
            $scope.rank=function(){
                function JsonSort(json,key){
                    return json.sort(function(a, b) {
                        var x = a[key];
                        var y = b[key];
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                $scope.rows = JsonSort($scope.rows,this.$parent.col.field);
            }
        }
    };
}]);
angular.module('app').directive("withInlineEditor",[function(){
    return{
        restrict: 'A',
        require:'^lionDataGrid',
        link: function (scope, element, attributes,lionDataGridController) {
            lionDataGridController.setEditor({
                title:"Edit",
                field:""
            });
        }
    };
}]);
//angular.module('app').directive("editorInitializer",function($compile, $templateCache){
//    return{
//        restrict: 'E',
//        templateUrl:"templates/editor_initializer.html",
//        controller:function($scope){
//            $scope.edit = function (row) {
//                $scope.$broadcast('edit',row);
//            };
//        },
//        link: function (scope, element, attributes) {
//            scope.$on('edit',function(e,row){
//                var editor = $compile($templateCache.get("templates/editor.html"))(scope);
//                $(editor).insertAfter(element.parents("tr"));
//            });
//        }
//    };
//});