var app = angular.module('app', ['ngDialog','ngAnimate', 'ngRoute', 'ngResource', 'ui.bootstrap',  'datatables', 'textAngular', 'colorbox', 'ui-rangeSlider']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/diario', {
            templateUrl: 'templates/diario/diario.html',
            controller: 'diarioController',
            controllerAs: 'diarioCtrl'
        }).
        when('/sped', {
            templateUrl: 'templates/sped/sped.html',
            controller: 'spedController',
            controllerAs: 'spedCtrl'
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
        when('/plano_contas', {
            templateUrl: 'templates/plano_contas/plano_contas.html',
            controller: 'planoContasController',
            controllerAs: 'planoContasCtrl'
        }).
        otherwise({
            redirectTo: '/diario'
        });
    }
]);

app.controller('appController', function($scope, S_vars){
    var $app = this;
    $app.titulo = "App";

    $app.vars = S_vars;
    $app.selected_menu = "contabilidade";
    $app.select_menu = function(menu) {
        $app.selected_menu = menu;
    };
});
