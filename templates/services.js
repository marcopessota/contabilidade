var app = angular.module('app', []);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/diario', {
            templateUrl: 'diario/diario.html',
            controller: 'diarioController'
        }).
        otherwise({
            redirectTo: '/addOrder'
        });
    }
]);
