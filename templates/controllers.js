var app = angular.module('app');

app.controller('appController', function($scope) {
    var $app = this;
    $app.titulo = "App";
    $app.selected_menu = "contabilidade";

    $app.select_menu = function(menu) {
        $app.selected_menu = menu;
    };
});


app.controller('diarioController', function($scope) {
    var $diario = this;
    $diario.titulo = "Diario";

    // $diario.ServerSideProcessingCtrl = function(DTOptionsBuilder, DTColumnBuilder) {
    //     vm.dtOptions = DTOptionsBuilder.newOptions()
    //         .withOption('ajax', {
    //             // Either you specify the AjaxDataProp here
    //             // dataSrc: 'data',
    //             url: 'teste.json',
    //             type: 'POST'
    //         })
    //     // or here
    //     .withDataProp('data')
    //         .withOption('processing', true)
    //         .withOption('serverSide', true)
    //         .withPaginationType('full_numbers');
    //     vm.dtColumns = [
    //         DTColumnBuilder.newColumn('id').withTitle('ID'),
    //         DTColumnBuilder.newColumn('firstName').withTitle('First name'),
    //         DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    //     ];
    // }
});


app.controller('auditoriaController', function($scope) {
    var $auditoria = this;
    $auditoria.titulo = "Auditoria";
});