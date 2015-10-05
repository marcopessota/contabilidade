var app = angular.module('app', ["ngRoute"]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/diario', {
            templateUrl: 'templates/diario/diario.html',
            controller: 'diarioController',
            controllerAs: 'diarioCtrl'
        }).
        when('/auditoria', {
            templateUrl: 'templates/auditoria/auditoria.html',
            controller: 'auditoriaController',
            controllerAs: 'auditoriaCtrl'
        }).
        otherwise({
            redirectTo: '/diario'
        });
    }
]);
