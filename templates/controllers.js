var app = angular.module('app');

app.controller('appController', function($scope) {
    var $app = this;
    $app.titulo = "App";
    $app.selected_menu = "contabilidade";



    $app.select_menu = function(menu){
		$app.selected_menu = menu;
	};
});


app.controller('diarioController', function($scope) {
    var $diario = this;
    $diario.titulo = "Diario";
});


app.controller('auditoriaController', function($scope) {
    var $auditoria = this;
    $auditoria.titulo = "Auditoria";
}); 
