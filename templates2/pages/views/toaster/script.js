angular.module('main', ['ngAnimate', 'toaster'])

    .controller('myController', function($scope, toaster, $window) {

        $scope.bar = 'Hi';

        $scope.pop = function(){
            toaster.success({title: "title", body:"text1"});
            toaster.error("title", "text2");
            toaster.pop({type: 'wait', title: "title", body:"text"});
            toaster.pop('success', "title", '<ul><li>Render html</li></ul>', 5000, 'trustedHtml');
            toaster.pop('error', "title", '<ul><li>Render html</li></ul>', null, 'trustedHtml');
            toaster.pop('wait', "title", null, null, 'template');
            toaster.pop('warning', "title", "myTemplate.html", null, 'template');
            toaster.pop('note', "title", "text");
            toaster.pop('success', "title", 'Its address is https://google.com.', 5000, 'trustedHtml', function(toaster) {
                var match = toaster.body.match(/http[s]?:\/\/[^\s]+/);
                if (match) $window.open(match[0]);
                return true;
            });
            toaster.pop('warning', "Hi ", "{template: 'myTemplateWithData.html', data: 'MyData'}", 15000, 'templateWithData');
        };

        $scope.goToLink = function(toaster) {
            var match = toaster.body.match(/http[s]?:\/\/[^\s]+/);
            if (match) $window.open(match[0]);
            return true;
        };

        $scope.clear = function(){
            toaster.clear();
        };
    });