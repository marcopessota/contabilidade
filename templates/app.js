var app = angular.module('app', ['ngDialog', 'highcharts-ng', 'ngAnimate', 'ngRoute', 'ngResource', 'ui.bootstrap',  'datatables', 'textAngular', 'colorbox', 'ui-rangeSlider']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/diario', {
            templateUrl: 'templates/diario/diario.html',
            controller: 'diarioController',
            controllerAs: 'diarioCtrl'
        }).
        when('/empresas', {
            templateUrl: 'templates/empresas/empresas.html',
            controller: 'empresasController',
            controllerAs: 'empresasCtrl'
        }).
        when('/exercicios', {
            templateUrl: 'templates/exercicios/exercicios.html',
            controller: 'exerciciosController',
            controllerAs: 'exerciciosCtrl'
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
        when('/balanco', {
            templateUrl: 'templates/balanco/balanco.html',
            controller: 'balancoController',
            controllerAs: 'balancoCtrl'
        }).when('/ratio', {
            templateUrl: 'templates/ratio/ratio.html',
            controller: 'ratioController',
            controllerAs: 'ratioCtrl'
        }).when('/tipologia', {
            templateUrl: 'templates/tipologia/tipologia.html',
            controller: 'tipologiaController',
            controllerAs: 'tipologiaCtrl'
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
            redirectTo: '/empresas'
        });
    }
]);

app.controller('appController', function($scope, S_vars){
    var $app = this;
    $app.titulo = "App";
    $app.vars = S_vars;
    $scope.$watch('appCtrl.vars.id_business', function(data){
       if(data != "" && data != null){
            $app.wrapper_class = "";
       }
    });
    if($app.vars.id_business == ""){
        $app.wrapper_class = "toggled";
    }
    $app.select_menu = function(menu) {
        $app.selected_menu = menu;
        if (menu == "empresas") {
            $app.wrapper_class = "toggled";
        }
        console.log(menu);
    };
});
