var app = angular.module('app');

app.controller('inventarioController', function($scope, $http, S_vars, $sce) {
    var $inventario = this;
    $inventario.titulo = 'Inventário';

    $inventario.iniciar_inventario = function() {
        var obj_ajax = {};
        obj_ajax._f = 'inicia_inventario';
        obj_ajax._p = {};
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
        	// console.log(data);
            $inventario.grid = $sce.trustAsHtml(data);
        });
    }

    $inventario.iniciar_inventario();
});