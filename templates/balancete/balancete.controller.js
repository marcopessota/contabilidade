var app = angular.module('app');

app.controller('balanceteController', function($scope, $http, S_vars, $sce) {
    var $balancete = this;
    $balancete.titulo = "Balancete";

    $balancete.iniciar_master_detail = function() {
        var obj_ajax = {};
        obj_ajax._f = 'inicia_balancete';
        obj_ajax._p = {};
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            // console.log(data);
            $balancete.grid = $sce.trustAsHtml(data);
        });
    }

    $balancete.iniciar_master_detail();
});