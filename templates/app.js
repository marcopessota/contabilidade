var app = angular.module('app', ['ngRoute', 'ngResource', 'datatables', 'colorbox', 'textAngular']);

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
        when('/master_detail', {
            templateUrl: 'templates/master_detail/master_detail.html',
            controller: 'masterDetailController',
            controllerAs: 'masterDetailCtrl'
        }).
        otherwise({
            redirectTo: '/diario'
        });
    }
]);

app.controller('appController', function($scope) {
    var $app = this;
    $app.titulo = "App";
    $app.selected_menu = "contabilidade";

    $app.select_menu = function(menu) {
        $app.selected_menu = menu;
    };
});
