var app = angular.module('app');

app.controller('masterDetailController', function($scope, $http, S_vars, $sce) {
    var $master_detail = this;
    $master_detail.titulo = 'Master Detail';
    $master_detail.textAngular = 'Insira o texto aqui';

    $master_detail.iniciar_master_detail = function() {
        var obj_ajax = {};
        obj_ajax._f = 'inicia_master_detail';
        obj_ajax._p = {};
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            // console.log(data);
            $master_detail.grid = $sce.trustAsHtml(data);
        });
    }

    $master_detail.iniciar_master_detail();
});