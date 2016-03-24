/**
 * Created by wash on 16/3/24.
 */
angular.module('myApp',['ui.bootstrap'])
    .controller('AccordionDemoCtrl', ['$scope', function($scope) {
        $scope.oneAtATime = true;

        $scope.groups = [
            {
                title: 'Accordion group header - #1',
                content: 'Dynamic group body - #1'
            },
            {
                title: 'Accordion group header - #2',
                content: 'Dynamic group body - #2'
            }
        ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
    }]);
