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
    }//

    $balancete.sendData = function() {
        var nome_folha_trabalho = prompt('Insira o nome da Folha de Trabalho');

        if (nome_folha_trabalho == '') return false;

        var rows = getSelRows();

        var obj_ajax = {};
        obj_ajax._f = 'envia_folha_trabalho';
        obj_ajax._p = {
            rows: rows,
            nome_folha_trabalho: nome_folha_trabalho
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            alert('Enviado para folha de trabalho com sucesso');
        });
    }

    $balancete.iniciar_master_detail();
});