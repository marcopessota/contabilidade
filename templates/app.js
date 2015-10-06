var app = angular.module('app', ['ngRoute', 'datatables']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/diario', {
            templateUrl: 'templates/diario/diario.html',
            controller: 'diarioController',
            controllerAs: 'diarioCtrl'
        }).
        when('/balancete', {
            templateUrl: 'templates/balancete/balancete.html',
            controller: 'balanceteController',
            controllerAs: 'balanceteCtrl'
        }).
        when('/folha_trabalho', {
            templateUrl: 'templates/folha_trabalho/folha_trabalho.html',
            controller: 'folhaTrabalhoController',
            controllerAs: 'folhaTrabalhoCtrl'
        }).
        otherwise({
            redirectTo: '/diario'
        });
    }
]);
